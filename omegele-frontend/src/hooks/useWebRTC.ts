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
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

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
          }
        }

        // Only create peer connection when we have a matchId
        if (matchId && socket && !peerConnectionRef.current) {
          // Create peer connection
          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          });

          peerConnectionRef.current = pc;

          // Add local stream tracks to peer connection
          if (stream) {
            stream.getTracks().forEach((track) => {
              pc.addTrack(track, stream);
            });
          }

          // Handle remote stream
          pc.ontrack = (event) => {
            console.log("Received remote track:", event);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
              // Ensure audio is enabled and not muted
              remoteVideoRef.current.muted = false;
              if (remoteVideoRef.current.volume !== undefined) {
                remoteVideoRef.current.volume = 1.0;
              }
              // Log audio tracks
              event.streams[0].getAudioTracks().forEach((track) => {
                console.log("Remote audio track:", track.label, "enabled:", track.enabled);
              });
              // Force play to ensure audio works
              remoteVideoRef.current.play().catch((err) => {
                console.error("Error playing remote video:", err);
              });
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

          // Handle connection state changes
          pc.onconnectionstatechange = () => {
            console.log("Peer connection state:", pc.connectionState);
          };

          // Create and send offer
          console.log("Creating offer for matchId:", matchId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit("webrtc-offer", { matchId, offer });
        }
      } catch (error) {
        console.error("Error initializing media:", error);
      }
    };

    initMedia();

    return () => {
      // Only cleanup peer connection, keep stream
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
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

        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
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

  // Ensure remote video audio is enabled when stream changes
  useEffect(() => {
    const checkAudio = () => {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        // Ensure all audio tracks are enabled
        stream.getAudioTracks().forEach((track) => {
          if (!track.enabled) {
            track.enabled = true;
            console.log("Enabled remote audio track:", track.label);
          }
        });
        // Ensure video element is not muted and volume is max
        remoteVideoRef.current.muted = false;
        if (remoteVideoRef.current.volume !== undefined) {
          remoteVideoRef.current.volume = 1.0;
        }
      }
    };

    // Check immediately
    checkAudio();
    
    // Check periodically to catch stream changes
    const interval = setInterval(checkAudio, 1000);
    
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
  };
}

