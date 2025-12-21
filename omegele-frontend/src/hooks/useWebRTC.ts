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
        // Check if we already have a stream from the video element
        let stream = localStreamRef.current;
        
        if (!stream && localVideoRef.current?.srcObject) {
          stream = localVideoRef.current.srcObject as MediaStream;
          localStreamRef.current = stream;
          // Ensure all tracks are enabled
          stream.getTracks().forEach((track) => {
            if (!track.enabled) {
              track.enabled = true;
            }
          });
        }

        // If still no stream, request new one
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: !audioOnly,
            audio: true,
          });
          localStreamRef.current = stream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            // Ensure video plays
            localVideoRef.current.play().catch((err) => {
              console.error("Error playing local video:", err);
            });
          }
        } else {
          // Ensure stream is still attached to video element
          if (localVideoRef.current && localVideoRef.current.srcObject !== stream) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch((err) => {
              console.error("Error playing local video:", err);
            });
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
              console.log("Received remote track:", event, "streams:", event.streams.length);
              
              // Get or create remote stream
              let remoteStream = remoteStreamRef.current;
              
              if (!remoteStream || !event.streams[0]) {
                // Create new stream or use the one from event
                remoteStream = event.streams[0] || new MediaStream();
                remoteStreamRef.current = remoteStream;
              }
              
              // Add track to stream if not already present
              const track = event.track;
              if (track && !remoteStream.getTracks().includes(track)) {
                remoteStream.addTrack(track);
                console.log("Added track to remote stream:", track.kind, track.label);
              }
              
              // Try to set stream to video element if available
              // If not available, it will be set when the element is rendered (handled by useEffect below)
              if (remoteVideoRef.current) {
                console.log("Setting remote stream to video element, tracks:", remoteStream.getTracks().length);
                
                // Ensure all tracks are enabled before setting
                remoteStream.getTracks().forEach((track) => {
                  if (!track.enabled) {
                    track.enabled = true;
                    console.log("Enabled remote track before setting to element:", track.kind, track.label);
                  }
                });
                
                remoteVideoRef.current.srcObject = remoteStream;
                
                // Ensure audio is enabled and not muted
                remoteVideoRef.current.muted = false;
                if (remoteVideoRef.current.volume !== undefined) {
                  remoteVideoRef.current.volume = 1.0;
                }
                
                // Log all tracks
                remoteStream.getAudioTracks().forEach((track) => {
                  console.log("Remote audio track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                });
                remoteStream.getVideoTracks().forEach((track) => {
                  console.log("Remote video track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                });
                
                // Force play to ensure video and audio work
                // Use a small delay to ensure the stream is fully attached
                setTimeout(() => {
                  if (remoteVideoRef.current && remoteVideoRef.current.srcObject === remoteStream) {
                    remoteVideoRef.current.play().then(() => {
                      console.log("Remote video playing successfully");
                    }).catch((err) => {
                      console.error("Error playing remote video:", err);
                    });
                  }
                }, 100);
              } else {
                console.log("remoteVideoRef.current is null, stream stored in ref. Will be set when element is available.");
              }
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

  // Ensure remote video is properly set up and playing
  // This effect runs when the video element becomes available or when matchId/enabled changes
  useEffect(() => {
    if (!enabled || !matchId) return;
    
    const checkRemoteVideo = () => {
      if (remoteVideoRef.current) {
        // Use remoteStreamRef if video element doesn't have a stream
        if (!remoteVideoRef.current.srcObject && remoteStreamRef.current) {
          console.log("Restoring remote stream to video element, tracks:", remoteStreamRef.current.getTracks().length);
          
          // Ensure all tracks are enabled before setting
          remoteStreamRef.current.getTracks().forEach((track) => {
            if (!track.enabled) {
              track.enabled = true;
              console.log("Enabled remote track before restoration:", track.kind, track.label);
            }
          });
          
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
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
          
          // Ensure video element is not muted and volume is max
          remoteVideoRef.current.muted = false;
          if (remoteVideoRef.current.volume !== undefined) {
            remoteVideoRef.current.volume = 1.0;
          }
          
          // Try to play if paused or not playing
          if (remoteVideoRef.current.paused || remoteVideoRef.current.readyState < 3) {
            remoteVideoRef.current.play().then(() => {
              console.log("Remote video playing after restoration");
            }).catch((err) => {
              console.error("Error playing remote video in check:", err);
            });
          }
        }
      } else if (remoteStreamRef.current) {
        // Stream exists but video element is not available yet
        console.log("Remote stream available but video element not ready, tracks:", remoteStreamRef.current.getTracks().length);
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

