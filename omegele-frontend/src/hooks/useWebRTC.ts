"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCOptions {
  socket: Socket | null;
  matchId: string | null;
  roomId: string | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  audioOnly?: boolean;
}

export function useWebRTC({
  socket,
  matchId,
  roomId,
  localVideoRef,
  remoteVideoRef,
  enabled,
  audioOnly = false,
}: UseWebRTCOptions) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const handlersAttachedRef = useRef(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [peerConnectionState, setPeerConnectionState] = useState<RTCPeerConnectionState>("new");

  // Initialize local media stream (start camera when enabled, even without matchId)
  useEffect(() => {
    if (!enabled) {
      // Don't cleanup stream if we're just transitioning states
      // Only cleanup peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      return;
    }

    const initMedia = async () => {
      try {
        // Check if we already have a valid stream
        let stream = localStreamRef.current;
        
        // Check if stream from ref is still valid (has active tracks)
        if (stream) {
          const activeTracks = stream.getTracks().filter(track => track.readyState === 'live');
          if (activeTracks.length === 0) {
            // Stream is no longer valid, clear it
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            localStreamRef.current = null;
          }
        }
        
        // Check video element for existing stream
        if (!stream && localVideoRef.current?.srcObject) {
          const elementStream = localVideoRef.current.srcObject as MediaStream;
          const activeTracks = elementStream.getTracks().filter(track => track.readyState === 'live');
          if (activeTracks.length > 0) {
            stream = elementStream;
            localStreamRef.current = stream;
            // Ensure all tracks are enabled
            stream.getTracks().forEach((track) => {
              if (!track.enabled) {
                track.enabled = true;
              }
            });
          }
        }

        // If still no valid stream, request new one
        if (!stream) {
          console.log("Requesting new media stream, audioOnly:", audioOnly);
          stream = await navigator.mediaDevices.getUserMedia({
            video: !audioOnly,
            audio: true,
          });
          localStreamRef.current = stream;
          console.log("Got media stream with tracks:", stream.getTracks().map(t => `${t.kind}:${t.label}`).join(", "));
        }

        // Always ensure stream is attached to video element and playing
        if (stream && localVideoRef.current) {
          // Ensure all tracks are enabled
          stream.getTracks().forEach((track) => {
            if (!track.enabled) {
              track.enabled = true;
              console.log("Enabled local track in initMedia:", track.kind, track.label);
            }
          });
          
          // Only update if different to avoid unnecessary re-renders
          if (localVideoRef.current.srcObject !== stream) {
            localVideoRef.current.srcObject = stream;
            console.log("Set local stream to video element, tracks:", stream.getTracks().length);
          }
          
          // Ensure video plays - use multiple attempts if needed
          const playVideo = async () => {
            try {
              if (localVideoRef.current && localVideoRef.current.srcObject === stream) {
                await localVideoRef.current.play();
                console.log("Local video playing successfully, tracks:", stream.getTracks().length);
              } else {
                console.warn("Local video element or stream mismatch during play");
              }
            } catch (err) {
              console.error("Error playing local video:", err);
              // Retry after a short delay
              setTimeout(() => {
                if (localVideoRef.current && localVideoRef.current.srcObject === stream) {
                  localVideoRef.current.play().then(() => {
                    console.log("Local video playing on retry");
                  }).catch((retryErr) => {
                    console.error("Error playing local video on retry:", retryErr);
                  });
                }
              }, 100);
            }
          };
          
          // Play immediately
          playVideo();
          
          // Also try after a small delay to handle any timing issues
          setTimeout(playVideo, 100);
          
          // Additional retry after longer delay
          setTimeout(playVideo, 500);
        } else {
          if (!stream) {
            console.warn("No local stream available to attach");
          }
          if (!localVideoRef.current) {
            console.warn("Local video element not available");
          }
        }

        // Only create peer connection when we have a matchId
        if (matchId && socket) {
          let pc = peerConnectionRef.current;
          
          // Create new peer connection if it doesn't exist
          if (!pc) {
            pc = new RTCPeerConnection({
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
              ],
            });
            peerConnectionRef.current = pc;
            handlersAttachedRef.current = false; // Reset flag for new connection
          }

          // Add local stream tracks to peer connection if not already added
          if (stream && pc) {
            const existingTracks = pc.getSenders().map(sender => sender.track);
            stream.getTracks().forEach((track) => {
              // Only add track if it's not already in the connection
              if (!existingTracks.includes(track)) {
                pc.addTrack(track, stream);
                console.log("Added track to peer connection:", track.kind, track.label);
              }
            });
          }

          // Handle remote stream (set handlers only once when creating new connection)
          if (!handlersAttachedRef.current) {
            pc.ontrack = (event) => {
              console.log("Received remote track:", event.track.kind, event.track.label, "streams:", event.streams.length);
              
              // Get or create remote stream
              let remoteStream = remoteStreamRef.current;
              
              // Use the stream from the event if available, otherwise create new or use existing
              if (event.streams && event.streams.length > 0 && event.streams[0]) {
                remoteStream = event.streams[0];
                remoteStreamRef.current = remoteStream;
                console.log("Using remote stream from event, tracks:", remoteStream.getTracks().length);
              } else if (!remoteStream) {
                remoteStream = new MediaStream();
                remoteStreamRef.current = remoteStream;
                console.log("Created new remote stream");
              }
              
              // Add track to stream if not already present
              const track = event.track;
              if (track) {
                const existingTrack = remoteStream.getTracks().find(t => t.id === track.id);
                if (!existingTrack) {
                  remoteStream.addTrack(track);
                  console.log("Added track to remote stream:", track.kind, track.label, "total tracks:", remoteStream.getTracks().length);
                  
                  // Ensure track is enabled
                  if (!track.enabled) {
                    track.enabled = true;
                    console.log("Enabled newly added remote track:", track.kind, track.label);
                  }
                  
                  // If this is an audio track, ensure it's playing
                  if (track.kind === "audio") {
                    console.log("Audio track added to remote stream:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                    
                    // Ensure track is enabled
                    if (!track.enabled) {
                      track.enabled = true;
                      console.log("Enabled audio track:", track.label);
                    }
                    
                    // Ensure remote video element is set up for audio
                    if (remoteVideoRef.current) {
                      // Set stream if not already set
                      if (!remoteVideoRef.current.srcObject || remoteVideoRef.current.srcObject !== remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        console.log("Set remote stream to video element for audio track");
                      }
                      
                      // Ensure audio settings
                      remoteVideoRef.current.muted = false;
                      if (remoteVideoRef.current.volume !== undefined) {
                        remoteVideoRef.current.volume = 1.0;
                      }
                      
                      // Force play
                      remoteVideoRef.current.play().then(() => {
                        console.log("Remote video playing after audio track added");
                      }).catch((err) => {
                        console.error("Error playing remote video after audio track added:", err);
                        // Retry after delay
                        setTimeout(() => {
                          if (remoteVideoRef.current && remoteVideoRef.current.srcObject === remoteStream) {
                            remoteVideoRef.current.muted = false;
                            if (remoteVideoRef.current.volume !== undefined) {
                              remoteVideoRef.current.volume = 1.0;
                            }
                            remoteVideoRef.current.play().catch((retryErr) => {
                              console.error("Error playing remote video on retry after audio track:", retryErr);
                            });
                          }
                        }, 200);
                      });
                    }
                  }
                } else {
                  console.log("Track already in remote stream:", track.kind, track.label);
                }
              }
              
              // Set stream to video element immediately if available
              const setRemoteStreamToElement = () => {
                if (remoteVideoRef.current && remoteStreamRef.current) {
                  const stream = remoteStreamRef.current;
                  console.log("Setting remote stream to video element, tracks:", stream.getTracks().length);
                  
                  // Ensure all tracks are enabled before setting
                  stream.getTracks().forEach((track) => {
                    if (!track.enabled) {
                      track.enabled = true;
                      console.log("Enabled remote track:", track.kind, track.label);
                    }
                  });
                  
                  // Only update if different to avoid unnecessary re-renders
                  if (remoteVideoRef.current.srcObject !== stream) {
                    remoteVideoRef.current.srcObject = stream;
                    console.log("Remote stream attached to video element");
                  }
                  
                  // Ensure audio is enabled and not muted
                  remoteVideoRef.current.muted = false;
                  if (remoteVideoRef.current.volume !== undefined) {
                    remoteVideoRef.current.volume = 1.0;
                  }
                  
                  // Log all tracks for debugging
                  stream.getAudioTracks().forEach((track) => {
                    console.log("Remote audio track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                  });
                  stream.getVideoTracks().forEach((track) => {
                    console.log("Remote video track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                  });
                  
                  // Force play to ensure video and audio work
                  const playRemoteVideo = async () => {
                    try {
                      if (remoteVideoRef.current && remoteVideoRef.current.srcObject === stream) {
                        await remoteVideoRef.current.play();
                        console.log("Remote video playing successfully");
                      }
                    } catch (err) {
                      console.error("Error playing remote video:", err);
                      // Retry after a short delay
                      setTimeout(() => {
                        if (remoteVideoRef.current && remoteVideoRef.current.srcObject === stream) {
                          remoteVideoRef.current.play().catch((retryErr) => {
                            console.error("Error playing remote video on retry:", retryErr);
                          });
                        }
                      }, 200);
                    }
                  };
                  
                  // Play immediately and after a delay
                  playRemoteVideo();
                  setTimeout(playRemoteVideo, 100);
                } else {
                  console.log("Remote video element not available yet, stream stored in ref. Tracks:", remoteStreamRef.current?.getTracks().length || 0);
                }
              };
              
              // Try to set immediately
              setRemoteStreamToElement();
              
              // Also try after a small delay in case element isn't ready
              setTimeout(setRemoteStreamToElement, 100);
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
              if (event.candidate && socket && matchId) {
                console.log("Sending ICE candidate:", event.candidate);
                socket.emit("webrtc-ice-candidate", {
                  matchId,
                  candidate: event.candidate,
                });
              }
            };
            
            handlersAttachedRef.current = true;
          }

          // Handle connection state changes
          pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            console.log("Peer connection state:", state);
            setPeerConnectionState(state);
            
            if (state === "connected") {
              // Ensure remote video is playing when connected
              if (remoteVideoRef.current) {
                if (remoteStreamRef.current && !remoteVideoRef.current.srcObject) {
                  remoteVideoRef.current.srcObject = remoteStreamRef.current;
                }
                remoteVideoRef.current.muted = false;
                if (remoteVideoRef.current.volume !== undefined) {
                  remoteVideoRef.current.volume = 1.0;
                }
                remoteVideoRef.current.play().then(() => {
                  console.log("Remote video playing after connection");
                }).catch((err) => {
                  console.error("Error playing remote video after connection:", err);
                });
              }
            }
          };
          
          // Set initial state
          setPeerConnectionState(pc.connectionState);

          // Create and send offer only if we don't have a local description
          // Add a small delay to ensure both users are in the socket room
          if (pc.signalingState === "stable" && !pc.localDescription) {
            console.log("Creating offer for matchId:", matchId);
            // Small delay to ensure socket room is set up
            setTimeout(async () => {
              try {
                if (pc.signalingState === "stable" && !pc.localDescription) {
                  const offer = await pc.createOffer();
                  await pc.setLocalDescription(offer);
                  console.log("Sending WebRTC offer for matchId:", matchId);
                  socket.emit("webrtc-offer", { matchId, offer });
                }
              } catch (error) {
                console.error("Error creating/sending offer:", error);
              }
            }, 500);
          } else {
            console.log("Peer connection already has offer or in progress, state:", pc.signalingState);
          }
        }
      } catch (error) {
        console.error("Error initializing media:", error);
      }
    };

    initMedia();

    return () => {
      // Only cleanup peer connection, keep stream
      if (peerConnectionRef.current && !enabled) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        handlersAttachedRef.current = false;
      }
    };
  }, [enabled, matchId, socket, localVideoRef, remoteVideoRef, audioOnly]);


  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket || !matchId || !peerConnectionRef.current) return;

    const handleOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", { matchId, answer });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        // Check if we already have a remote description
        if (pc.remoteDescription) {
          console.log("Remote description already set, skipping answer. Current state:", pc.signalingState);
          return;
        }

        // Only set if we're in the right state (have-local-offer)
        if (pc.signalingState === "have-local-offer") {
          console.log("Setting remote answer, current state:", pc.signalingState);
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else {
          console.log("Cannot set remote answer, wrong signaling state:", pc.signalingState);
        }
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    socket.on("webrtc-offer", handleOffer);
    socket.on("webrtc-answer", handleAnswer);
    socket.on("webrtc-ice-candidate", handleIceCandidate);

    return () => {
      socket.off("webrtc-offer", handleOffer);
      socket.off("webrtc-answer", handleAnswer);
      socket.off("webrtc-ice-candidate", handleIceCandidate);
    };
  }, [socket, matchId]);

  // Ensure local video element is properly set up when it becomes available
  useEffect(() => {
    if (!enabled) return;
    
    const checkLocalVideo = () => {
      if (localVideoRef.current) {
        // First, check if video element already has a stream
        let stream = localVideoRef.current.srcObject as MediaStream;
        
        // If no stream on element, try to get from ref
        if (!stream || stream.getTracks().length === 0) {
          stream = localStreamRef.current;
        }
        
        // If still no stream, check if we need to request one
        if (!stream || stream.getTracks().length === 0) {
          console.log("No local stream found, will be requested by initMedia");
          return;
        }
        
        // Ensure stream is attached
        if (localVideoRef.current.srcObject !== stream) {
          localVideoRef.current.srcObject = stream;
          console.log("Restored local stream to video element, tracks:", stream.getTracks().length);
        }
        
        // Ensure all tracks are enabled
        stream.getTracks().forEach((track) => {
          if (!track.enabled) {
            track.enabled = true;
            console.log("Enabled local track:", track.kind);
          }
        });
        
        // Ensure video is playing
        if (localVideoRef.current.paused) {
          localVideoRef.current.play().then(() => {
            console.log("Local video playing in check");
          }).catch((err) => {
            console.error("Error playing local video in check:", err);
          });
        }
        
        // Log video element state
        console.log("Local video check - hasStream:", !!localVideoRef.current.srcObject, "paused:", localVideoRef.current.paused, "readyState:", localVideoRef.current.readyState);
      }
    };
    
    // Check immediately and periodically
    checkLocalVideo();
    const interval = setInterval(checkLocalVideo, 500);
    
    return () => clearInterval(interval);
  }, [enabled]);

  // Ensure remote video is properly set up and playing
  // This effect runs when the video element becomes available or when matchId/enabled changes
  useEffect(() => {
    if (!enabled || !matchId) return;
    
    const checkRemoteVideo = () => {
      if (remoteVideoRef.current) {
        // Use remoteStreamRef if video element doesn't have a stream
        if (!remoteVideoRef.current.srcObject && remoteStreamRef.current) {
          const stream = remoteStreamRef.current;
          console.log("Restoring remote stream to video element, tracks:", stream.getTracks().length);
          
          // Ensure all tracks are enabled before setting
          stream.getTracks().forEach((track) => {
            if (!track.enabled) {
              track.enabled = true;
              console.log("Enabled remote track before restoration:", track.kind, track.label);
            }
          });
          
          remoteVideoRef.current.srcObject = stream;
        }
        
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        if (stream) {
          // Ensure all tracks are enabled
          stream.getTracks().forEach((track) => {
            if (!track.enabled) {
              track.enabled = true;
              console.log("Enabled remote track:", track.kind, track.label);
            }
          });
          
          // Log audio tracks specifically
          const audioTracks = stream.getAudioTracks();
          console.log("Remote stream audio tracks:", audioTracks.length);
          audioTracks.forEach((track) => {
            console.log("Audio track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState, "muted:", track.muted);
          });
          
          // Ensure video element is not muted and volume is max
          remoteVideoRef.current.muted = false;
          if (remoteVideoRef.current.volume !== undefined) {
            remoteVideoRef.current.volume = 1.0;
          }
          
          // Explicitly ensure audio tracks are not muted
          audioTracks.forEach((track) => {
            if (track.muted) {
              console.log("Unmuting audio track:", track.label);
              // Note: track.muted is read-only, but we can check if it's actually muted
            }
          });
          
          // Try to play if paused or not playing
          if (remoteVideoRef.current.paused || remoteVideoRef.current.readyState < 3) {
            remoteVideoRef.current.play().then(() => {
              console.log("Remote video playing after restoration, audio tracks:", audioTracks.length);
              // Double-check audio after play
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.muted = false;
                  if (remoteVideoRef.current.volume !== undefined) {
                    remoteVideoRef.current.volume = 1.0;
                  }
                  console.log("Audio check after play - muted:", remoteVideoRef.current.muted, "volume:", remoteVideoRef.current.volume);
                }
              }, 100);
            }).catch((err) => {
              console.error("Error playing remote video in check:", err);
            });
          } else {
            // Even if playing, ensure audio settings are correct
            remoteVideoRef.current.muted = false;
            if (remoteVideoRef.current.volume !== undefined) {
              remoteVideoRef.current.volume = 1.0;
            }
          }
        }
      } else if (remoteStreamRef.current) {
        // Stream exists but video element is not available yet
        const audioTracks = remoteStreamRef.current.getAudioTracks();
        console.log("Remote stream available but video element not ready, tracks:", remoteStreamRef.current.getTracks().length, "audio tracks:", audioTracks.length);
      }
    };

    // Check immediately
    checkRemoteVideo();
    
    // Check periodically to catch when element becomes available or stream changes
    const interval = setInterval(checkRemoteVideo, 500);
    
    return () => clearInterval(interval);
  }, [matchId, enabled]);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return {
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    peerConnectionState,
  };
}

