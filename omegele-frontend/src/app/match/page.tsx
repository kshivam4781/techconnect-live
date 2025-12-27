"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import FlagModal from "@/components/FlagModal";

type MatchStatus = "idle" | "permission" | "ready" | "searching" | "matched" | "in-call" | "ended";

const matchingMessages = [
  "Looking for your next co-founder...",
  "Looking for your next hiring manager...",
  "Looking for your next mentor...",
  "Looking for your next teammate...",
  "Looking for your next tech partner...",
  "Looking for your next advisor...",
  "Looking for your next collaborator...",
  "Looking for your next peer...",
];

export default function MatchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>("idle");
  const [callMode, setCallMode] = useState<"VIDEO">("VIDEO");
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [matchTimer, setMatchTimer] = useState(0);
  const [callTimer, setCallTimer] = useState(0);
  const [conversationTimer, setConversationTimer] = useState<number | null>(null);
  const [matchingMessageIndex, setMatchingMessageIndex] = useState(0);
  const [conversationDuration, setConversationDuration] = useState<number>(60);
  const [showName, setShowName] = useState<boolean>(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [otherUserInfo, setOtherUserInfo] = useState<{ name: string; email: string; showName: boolean } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [otherUserLocation, setOtherUserLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagId, setFlagId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; userId: string; message: string; timestamp: Date; isOwn: boolean }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [flagStatus, setFlagStatus] = useState<{
    canSearch: boolean;
    flagCount: number;
    isBlocked: boolean;
    reason?: string;
  } | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);
  const [isStartingSearch, setIsStartingSearch] = useState<boolean>(false);
  const [longerConversationRequested, setLongerConversationRequested] = useState<boolean>(false);
  const [longerConversationRequestReceived, setLongerConversationRequestReceived] = useState<boolean>(false);
  const [isExtendedConversation, setIsExtendedConversation] = useState<boolean>(false);
  const [extendedDuration] = useState<number>(30 * 60); // 30 minutes in seconds
  const [isAcceptingTerms, setIsAcceptingTerms] = useState<boolean>(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const matchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Socket and WebRTC hooks
  const {
    socket,
    isConnected,
    matchData,
    joinQueue,
    leaveQueue,
    startCall,
    endCall,
    sendChatMessage,
    requestLongerConversation,
    respondToLongerConversation,
  } = useSocket();

  const { isVideoEnabled, isAudioEnabled, toggleVideo, toggleAudio, peerConnectionState } = useWebRTC({
    socket,
    matchId: currentMatchId,
    roomId: currentRoomId,
    localVideoRef,
    remoteVideoRef,
    enabled: (matchStatus === "ready" || matchStatus === "searching" || matchStatus === "matched" || matchStatus === "in-call") && callMode === "VIDEO",
    audioOnly: false,
  });

  // Monitor peer connection state for disconnections
  useEffect(() => {
    if (matchStatus === "in-call" && (peerConnectionState === "disconnected" || peerConnectionState === "failed") && !isEndingCallRef.current) {
      console.log("Peer connection disconnected/failed, will trigger auto-rematch if still disconnected after 3 seconds");
      // Wait a bit to see if it reconnects
      const timeout = setTimeout(() => {
        // Check current state again (using functional updates to get latest values)
        setMatchStatus((prevStatus) => {
          if ((prevStatus === "in-call" || prevStatus === "matched") && !isEndingCallRef.current) {
            console.log("Peer disconnected, automatically starting new search...");
            
            // Store current values before cleanup
            const sessionId = currentSessionId;
            const mode = callMode;
            
            // Clean up current match state
            setCurrentMatchId(null);
            setCurrentRoomId(null);
            setOtherUserId(null);
            setOtherUserInfo(null);
            setCallTimer(0);
            setConversationTimer(null);
            setShowInfoPanel(false);
            setShowChatPanel(false);
            setChatMessages([]);
            setIsExtendedConversation(false);
            setLongerConversationRequested(false);
            setLongerConversationRequestReceived(false);

            setTimeout(() => {
              if (sessionId && mode) {
                setMatchStatus("searching");
                hasJoinedQueueRef.current = false;
                const backendMode: "VIDEO" | "TEXT" = "VIDEO";
                
                fetch("/api/activity/update", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "SEARCHING", mode: backendMode }),
                }).catch(console.error);

                if (isConnected) {
                  hasJoinedQueueRef.current = true;
                  joinQueue(sessionId, backendMode);
                } else {
                  // Wait for connection
                  const checkConnection = setInterval(() => {
                    if (isConnected && sessionId) {
                      clearInterval(checkConnection);
                      hasJoinedQueueRef.current = true;
                      joinQueue(sessionId, backendMode);
                    }
                  }, 500);
                  
                  // Cleanup after 30 seconds
                  setTimeout(() => clearInterval(checkConnection), 30000);
                }
              } else {
                setMatchStatus("ready");
              }
            }, 500);
            
            return "searching";
          }
          return prevStatus;
        });
      }, 3000); // Wait 3 seconds before triggering rematch
      
      return () => clearTimeout(timeout);
    }
  }, [peerConnectionState, matchStatus, currentSessionId, callMode, isConnected, joinQueue]);

  // Handle video stream for ready state (preview before searching)
  // Note: This is now handled by useWebRTC hook, but keeping as fallback
  useEffect(() => {
    if (matchStatus === "ready" && callMode === "VIDEO") {
      // Check if stream exists on video element or if useWebRTC will handle it
      // The useWebRTC hook should handle stream management, so we just ensure it's playing
      const checkStream = () => {
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          const activeTracks = stream.getTracks().filter(t => t.readyState === 'live');
          if (activeTracks.length > 0 && localVideoRef.current.paused) {
            localVideoRef.current.play().catch((err) => {
              console.error("Error playing local video in ready state check:", err);
            });
          }
        }
      };
      
      // Check immediately and after a delay
      checkStream();
      setTimeout(checkStream, 500);
    }
  }, [matchStatus, callMode]);

  // Check if user is onboarded and fetch conversation config
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;

    const fetchUserConfig = async () => {
      setLoadingConfig(true);
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          console.error("Failed to fetch user config:", res.status, res.statusText);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          return;
        }
        const data = await res.json();
        if (data.user) {
          if (!data.user.onboarded) {
            router.push("/onboarding");
            return;
          }
          // Clamp conversation duration between 60-300 seconds
          const duration = data.user.initialConversationDuration ?? 60;
          setConversationDuration(Math.max(60, Math.min(300, duration)));
          setShowName(data.user.showName ?? true);
          
          // Set flag status
          if (data.flagStatus) {
            setFlagStatus(data.flagStatus);
          }
        }
      } catch (error) {
        console.error("Error fetching user config:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchUserConfig();
  }, [session, status, router]);

  // Timer for matching and rotating messages
  useEffect(() => {
    if (matchStatus === "searching") {
      matchIntervalRef.current = setInterval(() => {
        setMatchTimer((prev) => prev + 1);
      }, 1000);
      
      // Rotate matching messages every 2.5 seconds for better visibility
      messageIntervalRef.current = setInterval(() => {
        setMatchingMessageIndex((prev) => (prev + 1) % matchingMessages.length);
      }, 2500);
    } else {
      if (matchIntervalRef.current) {
        clearInterval(matchIntervalRef.current);
        matchIntervalRef.current = null;
      }
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
      setMatchTimer(0);
      setMatchingMessageIndex(0);
    }

    return () => {
      if (matchIntervalRef.current) {
        clearInterval(matchIntervalRef.current);
        matchIntervalRef.current = null;
      }
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    };
  }, [matchStatus]);

  // Developer tools blocking disabled for debugging purposes
  // Uncomment the code below if you want to re-enable protection features
  /*
  // Protection: Prevent right-click context menu (except in input fields)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow right-click in input, textarea, and contenteditable elements
      const isInputElement = 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable ||
        target.closest("input, textarea, [contenteditable]");
      
      if (!isInputElement) {
        e.preventDefault();
        return false;
      }
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow text selection in input, textarea, and contenteditable elements
      const isInputElement = 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable ||
        target.closest("input, textarea, [contenteditable]");
      
      if (!isInputElement) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable right-click (except in input fields)
    document.addEventListener("contextmenu", handleContextMenu);
    // Disable text selection (except in input fields)
    document.addEventListener("selectstart", handleSelectStart);
    // Disable drag
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Protection: Disable DevTools shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow shortcuts in input, textarea, and contenteditable elements
      const target = e.target as HTMLElement;
      const isInputElement = 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable ||
        target.closest("input, textarea, [contenteditable]");

      // Only block shortcuts outside of input fields
      if (isInputElement) {
        // Allow all shortcuts in input fields except DevTools shortcuts
        if (e.key === "F12" || 
            (e.key === "I" && e.ctrlKey && e.shiftKey) ||
            (e.key === "J" && e.ctrlKey && e.shiftKey) ||
            (e.key === "C" && e.ctrlKey && e.shiftKey)) {
          e.preventDefault();
          return false;
        }
        return; // Allow other shortcuts in input fields
      }

      // Disable F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (DevTools)
      if (e.key === "I" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.key === "J" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.key === "C" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.key === "U" && e.ctrlKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.key === "S" && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.key === "P" && e.ctrlKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+A (Select All) - but allow in input fields (handled above)
      if (e.key === "A" && e.ctrlKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+C (Copy) - but allow in input fields (handled above)
      if (e.key === "C" && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+X (Cut) - but allow in input fields (handled above)
      if (e.key === "X" && e.ctrlKey) {
        e.preventDefault();
        return false;
      }
    };

    // Detect DevTools opening (basic detection)
    let devToolsOpen = false;
    let alertShown = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          console.warn("Developer tools detected. Please close them to continue.");
          // Show warning only once per session to avoid being too intrusive
          if (!alertShown) {
            alertShown = true;
            alert("Developer tools detected. Please close them to continue using the application.");
          }
        }
      } else {
        devToolsOpen = false;
        // Reset alert flag when DevTools is closed
        if (alertShown) {
          alertShown = false;
        }
      }
    };

    // Monitor for DevTools
    const devToolsInterval = setInterval(detectDevTools, 500);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);
  */


  // Protection: Disable text selection via CSS
  useEffect(() => {
    // Add CSS to prevent text selection
    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Timer for call (counts up) and conversation duration (counts down)
  useEffect(() => {
    if (matchStatus === "in-call") {
      // Initialize conversation timer when call starts
      if (conversationTimer === null) {
        setConversationTimer(isExtendedConversation ? extendedDuration : conversationDuration);
      }
      
      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
        setConversationTimer((prev) => {
          if (prev !== null && prev > 0) {
            const newValue = prev - 1;
            // Auto-trigger next match when timer reaches 0
            if (newValue === 0 && !isEndingCallRef.current && handleNextMatchRef.current) {
              console.log("Conversation duration reached, automatically moving to next match");
              // Use setTimeout to avoid state update during render
              setTimeout(() => {
                handleNextMatchRef.current?.();
              }, 100);
            }
            return newValue;
          }
          return prev;
        });
      }, 1000);
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
      setCallTimer(0);
      setConversationTimer(null);
      // Reset extended conversation state when call ends
      setIsExtendedConversation(false);
      setLongerConversationRequested(false);
      setLongerConversationRequestReceived(false);
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [matchStatus, conversationDuration, conversationTimer, isExtendedConversation, extendedDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (seconds: number) => {
    return `${seconds}s`;
  };

  // Function to get reverse geocoding (address from coordinates)
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API with better parameters for accuracy
      // Using zoom=18 for maximum detail and addressdetails=1 for full address components
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&extratags=1&namedetails=1`,
        {
          headers: {
            'User-Agent': 'TechConnect-App/1.0', // Required by Nominatim
            'Accept-Language': 'en-US,en;q=0.9', // Request English language results
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Invalid response format from location service');
      }
      
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        // Build a comprehensive, accurate address string
        const parts: string[] = [];
        
        // Street address components (most specific first)
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.road || addr.street || addr.pedestrian) {
          parts.push(addr.road || addr.street || addr.pedestrian);
        }
        if (addr.suburb || addr.neighbourhood || addr.city_district) {
          parts.push(addr.suburb || addr.neighbourhood || addr.city_district);
        }
        
        // City/town/village
        if (addr.city || addr.town || addr.village || addr.municipality) {
          parts.push(addr.city || addr.town || addr.village || addr.municipality);
        }
        
        // State/province
        if (addr.state || addr.region || addr.province) {
          parts.push(addr.state || addr.region || addr.province);
        }
        
        // Country
        if (addr.country) {
          parts.push(addr.country);
        }
        
        // Postal code
        if (addr.postcode) {
          parts.push(addr.postcode);
        }
        
        // If we have a display name from Nominatim, use it as it's usually more accurate
        if (data.display_name && parts.length > 0) {
          // Use display_name but ensure it includes our key components
          return data.display_name;
        }
        
        return parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(8)}, ${longitude.toFixed(8)}`;
      }
      
      // Fallback to coordinates with higher precision
      return `${latitude.toFixed(8)}, ${longitude.toFixed(8)}`;
    } catch (error) {
      console.error('Error getting address:', error);
      // Return coordinates with higher precision as fallback
      return `${latitude.toFixed(8)}, ${longitude.toFixed(8)}`;
    }
  };

  // Function to request user location with high accuracy
  const requestUserLocation = async (): Promise<{ latitude: number; longitude: number; address: string } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        resolve(null);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true, // Use GPS for better accuracy
        timeout: 20000, // Increased timeout to 20 seconds for better accuracy
        maximumAge: 0, // Always get fresh location
      };

      let bestPosition: GeolocationPosition | null = null;
      let watchId: number | null = null;
      let attempts = 0;
      let resolved = false; // Track if we've already resolved
      const maxAttempts = 15; // Try up to 15 times to get better accuracy
      const minAccuracy = 30; // Target accuracy in meters (30m is very good for most use cases)

      // Use watchPosition to continuously get better accuracy
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          if (resolved) return; // Don't process if already resolved
          
          attempts++;
          const accuracy = position.coords.accuracy;
          console.log(`Location attempt ${attempts}:`, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: `${accuracy.toFixed(2)}m`,
          });

          // Keep track of the best position (most accurate)
          if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
          }

          // If we have good accuracy or reached max attempts, use this position
          if (accuracy <= minAccuracy || attempts >= maxAttempts) {
            resolved = true;
            
            // Stop watching
            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
              watchId = null;
            }

            const { latitude, longitude } = position.coords;
            console.log("Final location obtained:", {
              latitude,
              longitude,
              accuracy: `${position.coords.accuracy.toFixed(2)}m`,
            });
            
            // Get address from coordinates
            const address = await getAddressFromCoordinates(latitude, longitude);
            console.log("Address:", address);
            
            const locationData = {
              latitude,
              longitude,
              address,
            };
            
            setUserLocation(locationData);
            setLocationError(null);
            resolve(locationData);
          }
        },
        (error) => {
          if (resolved) return; // Don't process if already resolved
          
          // Stop watching on error
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
          }
          
          // If watchPosition fails, try getCurrentPosition as fallback
          if (attempts === 0) {
            console.log("watchPosition failed, trying getCurrentPosition as fallback");
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                if (resolved) return;
                resolved = true;
                
                const { latitude, longitude } = position.coords;
                console.log("Fallback location obtained:", {
                  latitude,
                  longitude,
                  accuracy: `${position.coords.accuracy.toFixed(2)}m`,
                });
                
                const address = await getAddressFromCoordinates(latitude, longitude);
                console.log("Address:", address);
                
                const locationData = {
                  latitude,
                  longitude,
                  address,
                };
                
                setUserLocation(locationData);
                setLocationError(null);
                resolve(locationData);
              },
              (fallbackError) => {
                if (resolved) return;
                resolved = true;
                
                console.error("Location error:", fallbackError);
                let errorMessage = "Failed to get location";
                
                switch (fallbackError.code) {
                  case fallbackError.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable location access to continue.";
                    break;
                  case fallbackError.POSITION_UNAVAILABLE:
                    errorMessage = "Location information unavailable.";
                    break;
                  case fallbackError.TIMEOUT:
                    errorMessage = "Location request timed out.";
                    break;
                }
                
                setLocationError(errorMessage);
                resolve(null);
              },
              options
            );
          } else {
            // If we have a best position from watchPosition, use it
            if (bestPosition && !resolved) {
              resolved = true;
              const { latitude, longitude } = bestPosition.coords;
              getAddressFromCoordinates(latitude, longitude).then((address) => {
                const locationData = {
                  latitude,
                  longitude,
                  address,
                };
                setUserLocation(locationData);
                setLocationError(null);
                resolve(locationData);
              });
            } else if (!resolved) {
              resolved = true;
              console.error("Location error:", error);
              let errorMessage = "Failed to get location";
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = "Location permission denied. Please enable location access to continue.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = "Location information unavailable.";
                  break;
                case error.TIMEOUT:
                  errorMessage = "Location request timed out.";
                  break;
              }
              
              setLocationError(errorMessage);
              resolve(null);
            }
          }
        },
        options
      );

      // Set a maximum timeout to stop watching after 25 seconds
      const timeoutId = setTimeout(() => {
        if (!resolved && watchId !== null) {
          resolved = true;
          navigator.geolocation.clearWatch(watchId);
          watchId = null;
          
          if (bestPosition) {
            const { latitude, longitude } = bestPosition.coords;
            getAddressFromCoordinates(latitude, longitude).then((address) => {
              const locationData = {
                latitude,
                longitude,
                address,
              };
              setUserLocation(locationData);
              setLocationError(null);
              resolve(locationData);
            });
          } else {
            setLocationError("Location request timed out. Please try again.");
            resolve(null);
          }
        }
      }, 25000);
    });
  };

  // Fetch active users count
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await fetch("/api/activity/stats");
        if (!res.ok) {
          console.error("Failed to fetch active users:", res.status, res.statusText);
          return;
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          return;
        }
        const data = await res.json();
        if (data.totalActive !== undefined) {
          setActiveUsersCount(data.totalActive);
        }
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
    // Update every 5 seconds for more responsive updates
    const interval = setInterval(fetchActiveUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update active users count when match status changes
  useEffect(() => {
    if (matchStatus === "searching" || matchStatus === "in-call") {
      // Immediately fetch updated count when user starts searching or enters call
      const fetchActiveUsers = async () => {
        try {
          const res = await fetch("/api/activity/stats");
          const data = await res.json();
          if (data.totalActive !== undefined) {
            setActiveUsersCount(data.totalActive);
          }
        } catch (error) {
          console.error("Error fetching active users:", error);
        }
      };
      // Small delay to ensure activity update has been processed
      const timeout = setTimeout(fetchActiveUsers, 1000);
      return () => clearTimeout(timeout);
    }
  }, [matchStatus]);

  // Reset loading state when search successfully starts
  useEffect(() => {
    if (matchStatus === "searching") {
      // Reset loading state after a short delay to ensure everything is set up
      const timeout = setTimeout(() => {
        setIsStartingSearch(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [matchStatus]);

  // Debug: Log socket connection status
  useEffect(() => {
    console.log("Socket connected:", isConnected);
    console.log("Current match status:", matchStatus);
    console.log("Match data:", matchData);
  }, [isConnected, matchStatus, matchData]);

  // Track if we've already joined the queue to prevent infinite loops
  const hasJoinedQueueRef = useRef(false);
  // Track if we're ending the call ourselves to prevent auto-rematch
  const isEndingCallRef = useRef(false);
  // Store handleNextMatch in ref to avoid dependency issues
  const handleNextMatchRef = useRef<(() => Promise<void>) | null>(null);

  // Auto-retry joining queue when socket connects if we're searching
  useEffect(() => {
    if (isConnected && matchStatus === "searching" && currentSessionId && !hasJoinedQueueRef.current) {
      // Socket just connected and we're searching, retry joining queue (only once)
      console.log("Socket connected while searching, retrying queue join");
      hasJoinedQueueRef.current = true;
      const backendMode: "VIDEO" | "TEXT" = "VIDEO";
      joinQueue(currentSessionId, backendMode);
    }
    
    // Reset the flag when we stop searching
    if (matchStatus !== "searching") {
      hasJoinedQueueRef.current = false;
    }
  }, [isConnected, matchStatus, currentSessionId, callMode]);

  // Share location when match is found and save to database
  useEffect(() => {
    if (matchStatus === "matched" && currentMatchId && userLocation && socket) {
      console.log("Sharing location with matched user:", userLocation);
      
      // Share via socket
      socket.emit("share-location", {
        matchId: currentMatchId,
        location: userLocation,
      });

      // Save to database
      fetch(`/api/matches/${currentMatchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: userLocation,
        }),
      }).then((res) => {
        if (res.ok) {
          console.log("Location saved to database");
        } else {
          console.error("Failed to save location to database");
        }
      }).catch((error) => {
        console.error("Error saving location to database:", error);
      });
    }
  }, [matchStatus, currentMatchId, userLocation, socket]);

  // Listen for other user's location
  useEffect(() => {
    if (!socket || !currentMatchId) return;

    const handleLocationShare = (data: { matchId: string; location: { latitude: number; longitude: number; address: string } }) => {
      if (data.matchId === currentMatchId) {
        console.log("Received other user location:", data.location);
        setOtherUserLocation(data.location);
      }
    };

    socket.on("location-shared", handleLocationShare);

    return () => {
      socket.off("location-shared", handleLocationShare);
    };
  }, [socket, currentMatchId]);

  // Fetch other user's information and location when match is found
  useEffect(() => {
    const fetchOtherUserInfo = async () => {
      if (!currentMatchId) return;
      
      try {
        const res = await fetch(`/api/matches/${currentMatchId}`);
        if (res.ok) {
          const data = await res.json();
          const match = data.match;
          const currentUserId = (session as any)?.userId;
          
          // Determine which user is the other user
          const otherUser = match.user1Id === currentUserId ? match.user2 : match.user1;
          const isUser1 = match.user1Id === currentUserId;
          
          if (otherUser) {
            setOtherUserInfo({
              name: otherUser.name || "User",
              email: otherUser.email || "",
              showName: otherUser.showName ?? true,
            });
          }

          // Set other user's location from database if available
          if (isUser1 && match.user2Latitude && match.user2Longitude) {
            setOtherUserLocation({
              latitude: match.user2Latitude,
              longitude: match.user2Longitude,
              address: match.user2Address || `${match.user2Latitude.toFixed(8)}, ${match.user2Longitude.toFixed(8)}`,
            });
          } else if (!isUser1 && match.user1Latitude && match.user1Longitude) {
            setOtherUserLocation({
              latitude: match.user1Latitude,
              longitude: match.user1Longitude,
              address: match.user1Address || `${match.user1Latitude.toFixed(8)}, ${match.user1Longitude.toFixed(8)}`,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching other user info:", error);
      }
    };

    if (currentMatchId && (matchStatus === "matched" || matchStatus === "in-call")) {
      fetchOtherUserInfo();
    }
  }, [currentMatchId, matchStatus, session]);

  // Handle chat messages from socket
  useEffect(() => {
    if (!socket || !currentMatchId) return;

    const handleChatMessage = (data: { userId: string; message: string; timestamp: string }) => {
      const currentUserId = (session as any)?.userId;
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          userId: data.userId,
          message: data.message,
          timestamp: new Date(data.timestamp),
          isOwn: data.userId === currentUserId,
        },
      ]);
    };

    socket.on("chat-message", handleChatMessage);

    return () => {
      socket.off("chat-message", handleChatMessage);
    };
  }, [socket, currentMatchId, session]);

  // Handle longer conversation requests and responses
  useEffect(() => {
    if (!socket || !currentMatchId) return;

    const handleLongerConversationRequested = (data: { matchId: string; requestedBy: string }) => {
      if (data.matchId === currentMatchId) {
        setLongerConversationRequestReceived(true);
        // Auto-open info panel to show the request
        setShowInfoPanel(true);
      }
    };

    const handleLongerConversationAccepted = (data: { matchId: string; respondedBy: string }) => {
      if (data.matchId === currentMatchId) {
        setIsExtendedConversation(true);
        setLongerConversationRequestReceived(false);
        setLongerConversationRequested(false);
        // Reset timer to 30 minutes
        setConversationTimer(extendedDuration);
      }
    };

    const handleLongerConversationDenied = (data: { matchId: string; respondedBy: string }) => {
      if (data.matchId === currentMatchId) {
        setLongerConversationRequestReceived(false);
        setLongerConversationRequested(false);
      }
    };

    socket.on("longer-conversation-requested", handleLongerConversationRequested);
    socket.on("longer-conversation-accepted", handleLongerConversationAccepted);
    socket.on("longer-conversation-denied", handleLongerConversationDenied);

    return () => {
      socket.off("longer-conversation-requested", handleLongerConversationRequested);
      socket.off("longer-conversation-accepted", handleLongerConversationAccepted);
      socket.off("longer-conversation-denied", handleLongerConversationDenied);
    };
  }, [socket, currentMatchId, extendedDuration]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Clear chat messages when match ends
  useEffect(() => {
    if (matchStatus !== "in-call") {
      setChatMessages([]);
    }
  }, [matchStatus]);

  // Handle socket errors (e.g., blocked users)
  useEffect(() => {
    if (!socket) return;

    const handleSocketError = (error: { message: string; flagCount?: number; isBlocked?: boolean }) => {
      console.error("Socket error:", error);
      
      // If user is blocked, update flag status
      if (error.isBlocked || error.message.includes("cannot start a search")) {
        setFlagStatus({
          canSearch: false,
          flagCount: error.flagCount || 0,
          isBlocked: true,
          reason: error.message || "You cannot start a search at this time. Please contact support for assistance.",
        });
        
        // Go back to idle state if searching
        if (matchStatus === "searching" || matchStatus === "ready") {
          setMatchStatus("idle");
        }
        
        alert(error.message || "You cannot start a search at this time. Please contact support for assistance.");
      }
    };

    socket.on("error", handleSocketError);

    return () => {
      socket.off("error", handleSocketError);
    };
  }, [socket, matchStatus]);

  // Auto-rematch when other user disconnects or call ends
  useEffect(() => {
    if (!socket || !currentMatchId) return;

    const handleCallEnded = (data: { matchId: string; reason?: string }) => {
      // Only auto-rematch if we're currently in a call and the call ended
      // Don't rematch if we ended it ourselves
      if ((matchStatus === "in-call" || matchStatus === "matched") && data.matchId === currentMatchId && !isEndingCallRef.current) {
        console.log("Other user disconnected or call ended, automatically starting new search...", data);
        
        // Clean up current match state
        setCurrentMatchId(null);
        setCurrentRoomId(null);
        setOtherUserId(null);
        setOtherUserInfo(null);
        setOtherUserLocation(null);
        setCallTimer(0);
        setConversationTimer(null);
        setShowInfoPanel(false);
        setShowChatPanel(false);
        setChatMessages([]);

        // Small delay before starting new search to ensure cleanup
        setTimeout(() => {
          // Automatically start searching again
          // Use the same call mode and session
          if (currentSessionId && callMode) {
            setMatchStatus("searching");
            hasJoinedQueueRef.current = false;
            const backendMode: "VIDEO" | "TEXT" = "VIDEO";
            
            // Update activity
            fetch("/api/activity/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "SEARCHING", mode: backendMode }),
            }).catch(console.error);

            // Join queue again
            if (isConnected) {
              hasJoinedQueueRef.current = true;
              joinQueue(currentSessionId, backendMode);
            } else {
              // Wait for connection
              const checkConnection = setInterval(() => {
                if (isConnected && currentSessionId) {
                  clearInterval(checkConnection);
                  hasJoinedQueueRef.current = true;
                  joinQueue(currentSessionId, backendMode);
                }
              }, 500);
              
              // Cleanup after 30 seconds
              setTimeout(() => clearInterval(checkConnection), 30000);
            }
          } else {
            // If no session, go back to ready state
            setMatchStatus("ready");
          }
        }, 500);
      }
    };

    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("call-ended", handleCallEnded);
    };
  }, [socket, currentMatchId, matchStatus, currentSessionId, callMode, isConnected, joinQueue]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentMatchId) return;

    sendChatMessage(currentMatchId, chatInput.trim());
    setChatInput("");
  };

  // Handle match found from socket
  useEffect(() => {
    if (matchData && matchStatus === "searching") {
      console.log("Match found! Setting up connection...", matchData);
      hasJoinedQueueRef.current = false; // Reset queue join flag since we're matched
      
      const matchId = matchData.matchId;
      setCurrentMatchId(matchId);
      setCurrentRoomId(matchData.roomId);
      setOtherUserId(matchData.otherUserId);
      setMatchStatus("matched");
      
      // Ensure local video stream is preserved
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        // Make sure all tracks are enabled
        stream.getTracks().forEach((track) => {
          track.enabled = true;
        });
        console.log("Local stream preserved, tracks:", stream.getTracks().length);
      } else {
        console.warn("No local stream found when match found, WebRTC hook should handle this");
      }
      
      // Auto-transition to in-call after 2 seconds to allow WebRTC to initialize
      setTimeout(() => {
        console.log("Starting call with matchId:", matchId, "roomId:", matchData.roomId);
        startCall(matchId);
        setMatchStatus("in-call");
        
        // Ensure streams are still attached after transition
        setTimeout(() => {
          if (localVideoRef.current && !localVideoRef.current.srcObject) {
            console.log("Re-requesting local stream");
            // Re-request stream if lost
            navigator.mediaDevices.getUserMedia({
              video: callMode === "VIDEO",
              audio: true,
            }).then((stream) => {
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch((err) => {
                  console.error("Error playing local video after re-acquisition:", err);
                });
              }
            }).catch((error) => {
              console.error("Error re-acquiring media:", error);
            });
          }
          
          // Check remote video
          if (remoteVideoRef.current) {
            console.log("Remote video element available, srcObject:", remoteVideoRef.current.srcObject ? "exists" : "null");
            if (remoteVideoRef.current.srcObject) {
              const stream = remoteVideoRef.current.srcObject as MediaStream;
              console.log("Remote stream tracks:", stream.getTracks().length);
              stream.getTracks().forEach((track) => {
                console.log("Remote track:", track.kind, "enabled:", track.enabled, "readyState:", track.readyState);
              });
            }
          }
        }, 1000);
      }, 2000);
    }
  }, [matchData, matchStatus, startCall, callMode]);

  // Debug: Monitor video element states
  useEffect(() => {
    const logVideoStates = () => {
      if (localVideoRef.current) {
        const localStream = localVideoRef.current.srcObject as MediaStream;
        console.log("Local video state:", {
          hasStream: !!localStream,
          tracks: localStream ? localStream.getTracks().length : 0,
          videoTracks: localStream ? localStream.getVideoTracks().length : 0,
          audioTracks: localStream ? localStream.getAudioTracks().length : 0,
          paused: localVideoRef.current.paused,
          readyState: localVideoRef.current.readyState,
          muted: localVideoRef.current.muted,
        });
      }
      if (remoteVideoRef.current) {
        const remoteStream = remoteVideoRef.current.srcObject as MediaStream;
        console.log("Remote video state:", {
          hasStream: !!remoteStream,
          tracks: remoteStream ? remoteStream.getTracks().length : 0,
          videoTracks: remoteStream ? remoteStream.getVideoTracks().length : 0,
          audioTracks: remoteStream ? remoteStream.getAudioTracks().length : 0,
          paused: remoteVideoRef.current.paused,
          readyState: remoteVideoRef.current.readyState,
          muted: remoteVideoRef.current.muted,
          volume: remoteVideoRef.current.volume,
        });
      }
    };
    
    // Log immediately and periodically when in relevant states
    if (matchStatus === "ready" || matchStatus === "searching" || matchStatus === "matched" || matchStatus === "in-call") {
      logVideoStates();
      const interval = setInterval(logVideoStates, 2000);
      return () => clearInterval(interval);
    }
  }, [matchStatus]);

  // Ensure remote video is properly displayed when in-call
  useEffect(() => {
    if (matchStatus === "in-call" && remoteVideoRef.current) {
      const checkAndSetupRemoteVideo = () => {
        if (remoteVideoRef.current) {
          const stream = remoteVideoRef.current.srcObject as MediaStream;
          if (stream) {
            // Ensure all tracks are enabled
            stream.getTracks().forEach((track) => {
              if (!track.enabled) {
                track.enabled = true;
                console.log("Enabled remote track in in-call effect:", track.kind);
              }
            });
            
            // Ensure video element settings
            remoteVideoRef.current.muted = false;
            if (remoteVideoRef.current.volume !== undefined) {
              remoteVideoRef.current.volume = 1.0;
            }
            
            // Try to play if not already playing
            if (remoteVideoRef.current.paused) {
              remoteVideoRef.current.play().then(() => {
                console.log("Remote video playing in in-call effect");
              }).catch((err) => {
                console.error("Error playing remote video in in-call effect:", err);
              });
            }
          } else {
            console.log("Remote video element exists but no stream attached in in-call state");
          }
        }
      };
      
      // Check immediately
      checkAndSetupRemoteVideo();
      
      // Check periodically for a short time to catch delayed stream attachment
      const interval = setInterval(checkAndSetupRemoteVideo, 500);
      const timeout = setTimeout(() => clearInterval(interval), 10000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [matchStatus]);

  const handleSelectMode = async (mode: "VIDEO") => {
    setCallMode(mode);
    setPermissionError(null);
    
    // Request video and audio permission
    setMatchStatus("permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      // Set the stream to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        // Ensure video plays
        try {
          await localVideoRef.current.play();
          console.log("Local video playing after permission granted");
        } catch (playError) {
          console.error("Error playing local video after permission:", playError);
          // Retry after a short delay
          setTimeout(() => {
            if (localVideoRef.current && localVideoRef.current.srcObject === stream) {
              localVideoRef.current.play().catch((err) => {
                console.error("Error playing local video on retry:", err);
              });
            }
          }, 100);
        }
      }
      
      setHasPermission(true);
      setMatchStatus("ready");
    } catch (error: any) {
      console.error("Error requesting permission:", error);
      setPermissionError(error.message || "Failed to access camera/microphone");
      setHasPermission(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (isAcceptingTerms) return;

    try {
      setIsAcceptingTerms(true);

      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptTerms: true }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let error: any = {};
        if (contentType && contentType.includes("application/json")) {
          error = await res.json().catch(() => ({}));
        }
        throw new Error(error.error || "Failed to accept terms");
      }

      // Refresh user data to update flagStatus
      const userRes = await fetch("/api/me");
      if (!userRes.ok) {
        console.error("Failed to refresh user data:", userRes.status, userRes.statusText);
        return;
      }
      const contentType = userRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);
        return;
      }
      const userData = await userRes.json();
      
      if (userData.flagStatus) {
        setFlagStatus(userData.flagStatus);
      }
    } catch (error: any) {
      console.error("Error accepting terms:", error);
      alert(error.message || "Failed to accept terms. Please try again.");
    } finally {
      setIsAcceptingTerms(false);
    }
  };

  const handleStartSearch = async () => {
    // Prevent multiple clicks
    if (isStartingSearch) return;

    try {
      setIsStartingSearch(true);

      // Check flag status before starting search
      if (flagStatus && !flagStatus.canSearch) {
        setIsStartingSearch(false);
        alert(flagStatus.reason || "You cannot start a search at this time. Please contact support for assistance.");
        return;
      }

      // Immediately update status to show feedback
      setMatchStatus("searching");
      hasJoinedQueueRef.current = false; // Reset queue join flag

      // Request location asynchronously (non-blocking)
      setLocationError(null);
      requestUserLocation().then((location) => {
        if (!location) {
          // If location is denied or unavailable, show error but allow to continue
          // User can still search, but location won't be shared
          console.warn("Location not available, continuing without location");
        }
      }).catch((error) => {
        console.error("Error getting location:", error);
        setLocationError("Location request failed. You can still search without location.");
      });

      const backendMode: "VIDEO" | "TEXT" = "VIDEO";

      // Start session
      const sessionRes = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: backendMode.toLowerCase() }),
      });

      if (!sessionRes.ok) {
        const errorData = await sessionRes.json().catch(() => ({}));
        if (sessionRes.status === 403 && errorData.isBlocked) {
          // User is blocked, update flag status and show message
          setFlagStatus({
            canSearch: false,
            flagCount: errorData.flagCount || 0,
            isBlocked: true,
            reason: errorData.error || "You cannot start a search at this time.",
          });
          alert(errorData.error || "You cannot start a search at this time. Please contact support for assistance.");
          setMatchStatus("idle");
          return;
        }
        throw new Error(errorData.error || "Failed to start session");
      }

      const contentType = sessionRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }
      const sessionData = await sessionRes.json();
      setCurrentSessionId(sessionData.sessionId);

      // Update activity
      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SEARCHING", mode: backendMode }),
      });

      // Wait for socket connection if not connected, then join queue
      // Increased timeout to 30 seconds (60 retries * 500ms) for Railway connections
      const waitForConnection = (retries = 60): Promise<void> => {
        return new Promise((resolve) => {
          if (isConnected) {
            resolve();
            return;
          }
          
          // Also check if socket exists and is connected
          if (socket && (socket as any).connected) {
            resolve();
            return;
          }
          
          let attempts = 0;
          const checkConnection = setInterval(() => {
            attempts++;
            if (isConnected || (socket && (socket as any).connected)) {
              clearInterval(checkConnection);
              resolve();
            } else if (attempts >= retries) {
              clearInterval(checkConnection);
              // Don't reject, just log - joinQueue will handle queuing
              console.warn("Socket connection timeout after 30s, but will attempt to join queue anyway");
              resolve(); // Resolve instead of reject so we still try to join
            }
          }, 500);
        });
      };

      try {
        await waitForConnection();
        if (sessionData.sessionId && !hasJoinedQueueRef.current) {
          console.log("Joining queue with sessionId:", sessionData.sessionId, "mode:", backendMode);
          hasJoinedQueueRef.current = true;
          joinQueue(sessionData.sessionId, backendMode);
        }
        // Reset loading state once we've successfully started
        setIsStartingSearch(false);
      } catch (error) {
        console.error("Error waiting for socket connection:", error);
        // Try to join anyway - joinQueue will queue the request if not connected
        if (sessionData.sessionId && !hasJoinedQueueRef.current) {
          console.log("Attempting to join queue despite connection error");
          hasJoinedQueueRef.current = true;
          joinQueue(sessionData.sessionId, backendMode);
        }
        // Reset loading state even on error since we're still attempting to join
        setIsStartingSearch(false);
      }
    } catch (error) {
      console.error("Error starting match:", error);
      setMatchStatus("ready");
      hasJoinedQueueRef.current = false;
      setIsStartingSearch(false);
      alert("Failed to start searching. Please try again.");
    }
  };

  const handleStopSearch = async () => {
    try {
      hasJoinedQueueRef.current = false; // Reset queue join flag
      
      if (currentSessionId) {
        await fetch("/api/session/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: currentSessionId }),
        });
      }

      leaveQueue();

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      // Stop any media streams
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      setMatchStatus("idle");
      setCurrentSessionId(null);
      setMatchTimer(0);
      setHasPermission(false);
      setPermissionError(null);
    } catch (error) {
      console.error("Error stopping search:", error);
    }
  };

  const handleBackToHome = () => {
    // Stop any media streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
    
    setMatchStatus("idle");
    setHasPermission(false);
    setPermissionError(null);
  };

  const handleEndCall = async () => {
    try {
      isEndingCallRef.current = true; // Mark that we're ending the call
      
      if (currentMatchId) {
        endCall(currentMatchId, "ended");
      }

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      setMatchStatus("ended");
      setCurrentMatchId(null);
      setCurrentRoomId(null);
      setOtherUserId(null);
      setOtherUserInfo(null);
      setCallTimer(0);
      setConversationTimer(null);
      setShowInfoPanel(false);
      setShowChatPanel(false);
      setIsExtendedConversation(false);
      setLongerConversationRequested(false);
      setLongerConversationRequestReceived(false);

      setTimeout(() => {
        setMatchStatus("idle");
        isEndingCallRef.current = false; // Reset flag after transition
      }, 2000);
    } catch (error) {
      console.error("Error ending call:", error);
      isEndingCallRef.current = false;
    }
  };

  const handleSkip = async () => {
    try {
      isEndingCallRef.current = true; // Mark that we're ending the call
      
      if (currentMatchId) {
        endCall(currentMatchId, "skipped");
      }

      await fetch("/api/activity/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });

      setMatchStatus("idle");
      setCurrentMatchId(null);
      setCurrentRoomId(null);
      setOtherUserId(null);
      setOtherUserInfo(null);
      setCallTimer(0);
      setConversationTimer(null);
      setShowInfoPanel(false);
      setShowChatPanel(false);
      setIsExtendedConversation(false);
      setLongerConversationRequested(false);
      setLongerConversationRequestReceived(false);
      
      // Reset flag after a delay
      setTimeout(() => {
        isEndingCallRef.current = false;
      }, 1000);
    } catch (error) {
      console.error("Error skipping:", error);
      isEndingCallRef.current = false;
    }
  };

  const handleNextMatch = async () => {
    try {
      isEndingCallRef.current = true; // Mark that we're ending the call
      
      // End current call
      if (currentMatchId) {
        endCall(currentMatchId, "skipped");
      }

      // Clean up current match state
      const previousSessionId = currentSessionId;
      const previousCallMode = callMode;
      
      setCurrentMatchId(null);
      setCurrentRoomId(null);
      setOtherUserId(null);
      setOtherUserInfo(null);
      setCallTimer(0);
      setConversationTimer(null);
      setShowInfoPanel(false);
      setShowChatPanel(false);
      setChatMessages([]);
      setIsExtendedConversation(false);
      setLongerConversationRequested(false);
      setLongerConversationRequestReceived(false);

      // Small delay before starting new search to ensure cleanup
      setTimeout(async () => {
        // Automatically start searching again
        if (previousSessionId && previousCallMode) {
          setMatchStatus("searching");
          hasJoinedQueueRef.current = false;
          const backendMode: "VIDEO" | "TEXT" = "VIDEO";
          
          // Update activity
          await fetch("/api/activity/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "SEARCHING", mode: backendMode }),
          }).catch(console.error);

          // Join queue again
          if (isConnected) {
            hasJoinedQueueRef.current = true;
            joinQueue(previousSessionId, backendMode);
          } else {
            // Wait for connection
            const checkConnection = setInterval(() => {
              if (isConnected && previousSessionId) {
                clearInterval(checkConnection);
                hasJoinedQueueRef.current = true;
                joinQueue(previousSessionId, backendMode);
              }
            }, 500);
            
            // Cleanup after 30 seconds
            setTimeout(() => clearInterval(checkConnection), 30000);
          }
        } else {
          // If no session, go back to ready state
          setMatchStatus("ready");
        }
        
        // Reset flag after transition
        setTimeout(() => {
          isEndingCallRef.current = false;
        }, 1000);
      }, 500);
    } catch (error) {
      console.error("Error going to next match:", error);
      isEndingCallRef.current = false;
    }
  };

  // Store handleNextMatch in ref so it can be called from timer
  useEffect(() => {
    handleNextMatchRef.current = handleNextMatch;
  }, [handleNextMatch]);

  const handleFlag = async () => {
    if (!currentMatchId || !otherUserId) return;

    try {
      // Immediately save flag to database
      const flagRes = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flaggedUserId: otherUserId,
          matchId: currentMatchId,
          reason: "", // Will be updated when user submits
        }),
      });

      if (!flagRes.ok) {
        throw new Error("Failed to create flag");
      }

      const flagData = await flagRes.json();
      setFlagId(flagData.flag.id);
      setShowFlagModal(true);
    } catch (error) {
      console.error("Error creating flag:", error);
      alert("Failed to report user. Please try again.");
    }
  };

  const handleFlagSubmit = async (reason: string, category?: string) => {
    if (!flagId) return;

    try {
      const res = await fetch(`/api/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, category }),
      });

      if (!res.ok) {
        throw new Error("Failed to update flag");
      }

      setShowFlagModal(false);
      setFlagId(null);
      
      // Optionally end the call after flagging
      await handleEndCall();
    } catch (error) {
      console.error("Error submitting flag:", error);
      throw error;
    }
  };

  const handleRequestLongerConversation = () => {
    if (!currentMatchId || longerConversationRequested || isExtendedConversation) return;
    
    requestLongerConversation(currentMatchId);
    setLongerConversationRequested(true);
  };

  const handleAcceptLongerConversation = () => {
    if (!currentMatchId) return;
    
    respondToLongerConversation(currentMatchId, true);
    setIsExtendedConversation(true);
    setLongerConversationRequestReceived(false);
    setLongerConversationRequested(false);
    // Reset timer to 30 minutes
    setConversationTimer(extendedDuration);
  };

  const handleDenyLongerConversation = () => {
    if (!currentMatchId) return;
    
    respondToLongerConversation(currentMatchId, false);
    setLongerConversationRequestReceived(false);
  };

  // Hide header and footer, prevent scrolling
  useEffect(() => {
    // Hide header and footer
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) {
      main.style.padding = '0';
      main.style.margin = '0';
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restore on unmount
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.style.padding = '';
        main.style.margin = '';
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 h-screen w-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center overflow-hidden">
        <p className="text-xs sm:text-sm text-[#9aa2c2]">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 h-screen w-screen bg-[#050710] text-[#f8f3e8] flex items-center justify-center px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-md w-full space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-[#272f45] bg-[#0b1018] p-4 sm:p-6 text-center">
          <h1 className="text-lg sm:text-xl font-semibold">Sign in to start matching</h1>
          <p className="text-xs sm:text-sm text-[#9aa2c2] px-2">
            You need to be signed in to start conversations with other tech professionals.
          </p>
          <button
            onClick={() => signIn("github")}
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-[#ffd447] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15] active:shadow-[0_0_30px_rgba(250,204,21,0.7)]"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#050710] text-[#f8f3e8] overflow-hidden flex flex-col">
      {/* Top Header - User Info and Options */}
      <div className="flex-shrink-0 z-50 border-b border-[#272f45] bg-[#0b1018]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3">
          {/* Left: Go Back Button */}
          <button
            onClick={() => {
              if (matchStatus === "idle") {
                router.push("/");
              } else {
                handleBackToHome();
              }
            }}
            className="flex items-center gap-1 sm:gap-2 rounded-lg border border-[#3b435a] bg-[#0f1729] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Go Back</span>
          </button>

          {/* Center: User Info and Active Users Count */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#1f2937] text-sm sm:text-lg font-semibold">
              {session?.user?.name?.charAt(0) || "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{session?.user?.name || "User"}</p>
              <p className="text-xs text-[#9aa2c2] truncate max-w-[120px] md:max-w-[200px]">{session?.user?.email || ""}</p>
            </div>
            {/* Active Users Count */}
            {activeUsersCount !== null && (
              <div className="ml-2 sm:ml-4 flex items-center gap-2 rounded-lg border border-[#3b435a] bg-[#0f1729] px-3 sm:px-4 py-1.5 sm:py-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#bef264]" />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold text-[#f8f3e8]">{activeUsersCount}</span>
                  <span className="text-[10px] sm:text-xs text-[#9aa2c2] hidden sm:inline">active now</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Options */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="/profile"
              className="flex items-center gap-1 sm:gap-2 rounded-lg border border-[#3b435a] bg-[#0f1729] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
              title="Profile"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Profile</span>
            </a>
            <a
              href="/"
              className="flex items-center gap-1 sm:gap-2 rounded-lg border border-[#3b435a] bg-[#0f1729] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
              title="Home"
            >
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>
      </div>

      {/* Configuration Page (Idle State) */}
      {matchStatus === "idle" && (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-2xl w-full space-y-4 sm:space-y-6 text-center">
            {/* Blocked Message */}
            {flagStatus && !flagStatus.canSearch && (
              <div className="rounded-xl sm:rounded-2xl border border-red-500/50 bg-red-500/10 p-4 sm:p-6 text-left">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-red-400 mb-1">Account Suspended</h3>
                    <p className="text-xs sm:text-sm text-red-300/90 mb-3">
                      {flagStatus.reason || "Your account has been temporarily suspended. Please contact support for assistance."}
                    </p>
                    {flagStatus.flagCount > 0 && (
                      <p className="text-xs text-red-300/70 mb-3">
                        Flag count: {flagStatus.flagCount}/5
                      </p>
                    )}
                    {/* Show Accept Terms button if terms not accepted */}
                    {!flagStatus.isBlocked && flagStatus.reason?.includes("Terms and Conditions") && (
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={handleAcceptTerms}
                          disabled={isAcceptingTerms}
                          className="inline-flex items-center justify-center rounded-full bg-[#ffd447] px-4 py-2 text-xs sm:text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15] active:shadow-[0_0_30px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAcceptingTerms ? "Accepting..." : "Accept Terms and Conditions"}
                        </button>
                        <p className="text-xs text-red-300/70">
                          By accepting, you agree to our{" "}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Terms and Conditions
                          </a>
                          ,{" "}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Privacy Policy
                          </a>
                          ,{" "}
                          <a href="/acceptable-use" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Acceptable Use Policy
                          </a>
                          , and{" "}
                          <a href="/cookies" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                            Cookie Policy
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Start a conversation
              </h1>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#9aa2c2] px-2">
                Get matched with another tech professional for a 1:1 conversation.
              </p>
              {!loadingConfig && (
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-[#9aa2c2] px-2">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {conversationDuration}s duration
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Name {showName ? "visible" : "hidden"}
                  </span>
                  <a href="/profile" className="text-[#ffd447] hover:underline">
                    Change
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-[#272f45] bg-[#0b1018] p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm font-medium text-[#f8f3e8]">Start video call</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleSelectMode("VIDEO")}
                    disabled={flagStatus ? !flagStatus.canSearch : false}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#3b435a] bg-[#050816] p-4 sm:p-5 transition active:border-[#ffd447] active:bg-[#18120b] disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
                  >
                    <svg
                      className="h-7 w-7 sm:h-8 sm:w-8 text-[#ffd447]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">Video Call</span>
                    <span className="text-xs text-[#9aa2c2]">Face-to-face conversation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Request Page */}
      {matchStatus === "permission" && (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-md w-full space-y-4 sm:space-y-6 text-center">
            <div className="space-y-3 sm:space-y-4">
              <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 animate-pulse rounded-full border-4 border-[#ffd447] border-t-transparent" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Requesting Camera Access</h2>
                <p className="mt-2 text-xs sm:text-sm text-[#9aa2c2] px-2">
                  Please allow camera and microphone access to continue
                </p>
                {permissionError && (
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-400 px-2">
                    {permissionError}
                  </p>
                )}
              </div>
              <button
                onClick={handleBackToHome}
                className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-4 sm:px-5 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ready State - Video Preview with Start Button */}
      {matchStatus === "ready" && (
        <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden min-h-0">
          {/* Blocked Message Banner */}
          {flagStatus && !flagStatus.canSearch && (
            <div className="w-full border-b border-red-500/50 bg-red-500/10 p-3 sm:p-4">
              <div className="flex items-start gap-3 max-w-7xl mx-auto">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-red-400 mb-1">Account Suspended</h3>
                  <p className="text-xs sm:text-sm text-red-300/90 mb-2">
                    {flagStatus.reason || "Your account has been temporarily suspended. Please contact support for assistance."}
                  </p>
                  {flagStatus.flagCount > 0 && (
                    <p className="text-xs text-red-300/70 mb-2">
                      Flag count: {flagStatus.flagCount}/5
                    </p>
                  )}
                  {/* Show Accept Terms button if terms not accepted */}
                  {!flagStatus.isBlocked && flagStatus.reason?.includes("Terms and Conditions") && (
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={handleAcceptTerms}
                        disabled={isAcceptingTerms}
                        className="inline-flex items-center justify-center rounded-full bg-[#ffd447] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15] active:shadow-[0_0_30px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAcceptingTerms ? "Accepting..." : "Accept Terms and Conditions"}
                      </button>
                      <p className="text-xs text-red-300/70">
                        By accepting, you agree to our{" "}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                          Terms and Conditions
                        </a>
                        ,{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                          Privacy Policy
                        </a>
                        ,{" "}
                        <a href="/acceptable-use" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                          Acceptable Use Policy
                        </a>
                        , and{" "}
                        <a href="/cookies" target="_blank" rel="noopener noreferrer" className="text-[#ffd447] hover:underline">
                          Cookie Policy
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Left Side - Video Preview */}
          <div className="flex-1 relative bg-[#0b1018] flex items-center justify-center p-2 sm:p-4 min-h-0">
            {/* Both Videos in Same Container - Stacked vertically (top and bottom) */}
            <div className="w-full max-w-4xl grid grid-cols-1 gap-2 sm:gap-4">
              {/* Your Video */}
              <div className="relative w-full rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden aspect-video">
                {callMode === "VIDEO" ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    onLoadedMetadata={() => {
                      console.log("Local video metadata loaded (ready state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on metadata (ready):", err);
                        });
                      }
                    }}
                    onCanPlay={() => {
                      console.log("Local video can play (ready state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on canplay (ready):", err);
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                    <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#1f2937] text-2xl sm:text-4xl font-semibold">
                      {session.user?.name?.charAt(0) || "?"}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur">
                  You
                </div>
              </div>

              {/* Placeholder for Other User (Empty until matched) */}
              <div className="relative w-full rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden aspect-video">
                <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                  <div className="text-center">
                    <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#1f2937] text-2xl sm:text-4xl font-semibold mx-auto mb-2">
                      ?
                    </div>
                    <p className="text-xs sm:text-sm text-[#9aa2c2]">Waiting for match...</p>
                  </div>
                </div>
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur">
                  Waiting...
                </div>
              </div>
            </div>

            {/* Top Buttons - Mobile: Both buttons, Desktop: Only Go Back */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between gap-2 z-10">
              <button
                onClick={handleBackToHome}
                className="rounded-full border border-[#3b435a] bg-[#0f1729] px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
              >
                Go Back
              </button>
              
              {/* Start Searching Button - Mobile only */}
              <button
                onClick={handleStartSearch}
                disabled={(flagStatus ? !flagStatus.canSearch : false) || isStartingSearch}
                className="md:hidden inline-flex h-8 sm:h-9 items-center justify-center rounded-full bg-[#ffd447] px-3 sm:px-4 text-xs sm:text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15] active:shadow-[0_0_30px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {isStartingSearch ? "Starting..." : "Start Searching"}
              </button>
            </div>
          </div>

          {/* Right Side - Start Button (Desktop only) */}
          <div className="hidden md:flex w-80 border-l border-[#272f45] bg-[#0b1018] p-6 flex-col items-center justify-center">
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                <p className="text-sm text-[#9aa2c2]">
                  {callMode === "VIDEO" 
                    ? "Your camera is on. Click below to start searching for a match."
                    : "Your microphone is ready. Click below to start searching for a match."}
                </p>
              </div>
              
              <button
                onClick={handleStartSearch}
                disabled={(flagStatus ? !flagStatus.canSearch : false) || isStartingSearch}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ffd447] px-8 text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_30px_rgba(250,204,21,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {isStartingSearch ? "Starting..." : "Start Searching"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matching/Searching Page - Omegle Style */}
      {(matchStatus === "searching" || matchStatus === "matched") && (
        <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden min-h-0">
          {/* Left Side - Video Area */}
          <div className="flex-1 relative bg-[#0b1018] min-h-0 flex items-center justify-center p-2 sm:p-4">
            {/* Both Videos in Same Container - Stacked vertically (top and bottom) */}
            <div className="w-full max-w-4xl grid grid-cols-1 gap-2 sm:gap-4 relative">
              {/* Matching Status Overlay - Centered */}
              {(matchStatus === "searching" || matchStatus === "matched") && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="text-center px-3 sm:px-4 bg-[#0b1018]/90 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                    {/* Animated Spinning Circle */}
                    <div className="mx-auto mb-3 sm:mb-4">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-[#ffd447] border-t-transparent animate-spin" />
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ffd447] mb-2 sm:mb-3">
                      MATCHING
                    </h2>
                    <p 
                      key={matchingMessageIndex}
                      className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#9aa2c2] min-h-[1.25rem] sm:min-h-[1.5rem] transition-all duration-500 ease-in-out px-2"
                    >
                      {matchStatus === "matched" 
                        ? "Match found! Connecting..." 
                        : matchingMessages[matchingMessageIndex]}
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs text-[#64748b]">
                      {formatTime(matchTimer)}
                    </p>
                  </div>
                </div>
              )}

              {/* Your Video */}
              <div className="relative w-full rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden aspect-video">
                {callMode === "VIDEO" ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    onLoadedMetadata={() => {
                      console.log("Local video metadata loaded (matched/searching state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on metadata (matched/searching):", err);
                        });
                      }
                    }}
                    onCanPlay={() => {
                      console.log("Local video can play (matched/searching state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on canplay (matched/searching):", err);
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold">
                      {session.user?.name?.charAt(0) || "?"}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur">
                  You
                </div>
              </div>

              {/* Remote Video or Placeholder */}
              <div className="relative w-full rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden aspect-video">
                {callMode === "VIDEO" ? (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      muted={false}
                      className="h-full w-full object-cover bg-[#111827]"
                      onLoadedMetadata={() => {
                        console.log("Remote video metadata loaded (matched state)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Audio tracks in metadata handler:", audioTracks.length);
                            audioTracks.forEach((track) => {
                              console.log("Audio track:", track.label, "enabled:", track.enabled);
                            });
                          }
                          remoteVideoRef.current.muted = false;
                          remoteVideoRef.current.volume = 1.0;
                          remoteVideoRef.current.play().catch((err) => {
                            console.error("Error playing remote video on metadata (matched):", err);
                          });
                        }
                      }}
                      onCanPlay={() => {
                        console.log("Remote video can play (matched state)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Audio tracks in canplay handler:", audioTracks.length);
                          }
                          remoteVideoRef.current.muted = false;
                          remoteVideoRef.current.volume = 1.0;
                          remoteVideoRef.current.play().catch((err) => {
                            console.error("Error playing remote video on canplay (matched):", err);
                          });
                        }
                      }}
                      onPlay={() => {
                        console.log("Remote video started playing (matched state)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Remote video playing - audio tracks:", audioTracks.length, "muted:", remoteVideoRef.current.muted, "volume:", remoteVideoRef.current.volume);
                            audioTracks.forEach((track) => {
                              console.log("Playing audio track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                            });
                          }
                          // Ensure audio is still enabled
                          remoteVideoRef.current.muted = false;
                          if (remoteVideoRef.current.volume !== undefined) {
                            remoteVideoRef.current.volume = 1.0;
                          }
                        }
                      }}
                    />
                    {!remoteVideoRef.current?.srcObject && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#111827] z-10">
                        <div className="text-center">
                          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold mx-auto mb-2">
                            {matchStatus === "matched" ? (otherUserInfo?.showName && otherUserInfo?.name ? otherUserInfo.name.charAt(0) : "?") : "?"}
                          </div>
                          <p className="text-xs text-[#9aa2c2]">
                            {matchStatus === "matched" ? "Connecting..." : "Waiting for match..."}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur z-20">
                      {matchStatus === "matched" && remoteVideoRef.current?.srcObject
                        ? (otherUserInfo?.showName ? (otherUserInfo.name || "User") : "Anonymous User")
                        : (matchStatus === "matched" ? "Connecting..." : "Waiting...")}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold">
                      {otherUserInfo?.showName && otherUserInfo?.name ? otherUserInfo.name.charAt(0) : "?"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* End Session Button */}
            <button
              onClick={handleStopSearch}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 rounded-full border border-[#3b435a] bg-[#0f1729] px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35] z-30 pointer-events-auto"
            >
              End Session
            </button>
          </div>

          {/* Right Side - User Info */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#272f45] bg-[#0b1018] p-3 sm:p-4 md:p-6 flex flex-col">
            {/* User Information */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-[#9aa2c2] mb-2">Your Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#1f2937] text-base sm:text-lg md:text-xl font-semibold">
                      {session.user?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold">{session.user?.name || "User"}</p>
                      <p className="text-xs text-[#9aa2c2] truncate">{session.user?.email || ""}</p>
                    </div>
                  </div>
                  {userLocation && (
                    <div className="mt-3 pt-3 border-t border-[#272f45]">
                      <div className="flex items-start gap-2">
                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#9aa2c2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#9aa2c2] mb-1">Location</p>
                          <p className="text-xs text-[#f8f3e8] break-words">{userLocation.address}</p>
                          <p className="text-xs text-[#64748b] mt-1">
                            {userLocation.latitude.toFixed(8)}, {userLocation.longitude.toFixed(8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-Call Page */}
      {matchStatus === "in-call" && (
        <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden m-0 p-0 min-h-0">
          {/* Column 1: Video Area - Desktop: 1/3, Mobile: Full */}
          <div className="flex-1 relative bg-[#0b1018] min-h-0 flex flex-col p-2 sm:p-4 border-b lg:border-b-0 lg:border-r border-[#272f45]">
            {/* Videos Container - Top half: Remote, Bottom half: Local */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-4 min-h-0">
              {/* Remote Video - Top Half */}
              <div className="flex-1 relative rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden min-h-0">
                {callMode === "VIDEO" ? (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      muted={false}
                      className="h-full w-full object-cover bg-[#111827]"
                      onLoadedMetadata={() => {
                        console.log("Remote video metadata loaded (in-call)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Audio tracks in metadata handler (in-call):", audioTracks.length);
                            audioTracks.forEach((track) => {
                              console.log("Audio track:", track.label, "enabled:", track.enabled);
                            });
                          }
                          remoteVideoRef.current.muted = false;
                          remoteVideoRef.current.volume = 1.0;
                          remoteVideoRef.current.play().catch((err) => {
                            console.error("Error playing remote video on metadata (in-call):", err);
                          });
                        }
                      }}
                      onCanPlay={() => {
                        console.log("Remote video can play (in-call)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Audio tracks in canplay handler (in-call):", audioTracks.length);
                          }
                          remoteVideoRef.current.muted = false;
                          remoteVideoRef.current.volume = 1.0;
                          remoteVideoRef.current.play().catch((err) => {
                            console.error("Error playing remote video on canplay (in-call):", err);
                          });
                        }
                      }}
                      onPlay={() => {
                        console.log("Remote video started playing (in-call)");
                        if (remoteVideoRef.current) {
                          const stream = remoteVideoRef.current.srcObject as MediaStream;
                          if (stream) {
                            const audioTracks = stream.getAudioTracks();
                            console.log("Remote video playing (in-call) - audio tracks:", audioTracks.length, "muted:", remoteVideoRef.current.muted, "volume:", remoteVideoRef.current.volume);
                            audioTracks.forEach((track) => {
                              console.log("Playing audio track (in-call):", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
                            });
                          }
                          // Ensure audio is still enabled
                          remoteVideoRef.current.muted = false;
                          if (remoteVideoRef.current.volume !== undefined) {
                            remoteVideoRef.current.volume = 1.0;
                          }
                        }
                      }}
                    />
                    {!remoteVideoRef.current?.srcObject && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#111827] z-10">
                        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold">
                          {otherUserInfo?.showName && otherUserInfo?.name ? otherUserInfo.name.charAt(0) : "?"}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold">
                      {otherUserInfo?.showName && otherUserInfo?.name ? otherUserInfo.name.charAt(0) : "?"}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur z-20">
                  {otherUserInfo?.showName ? (otherUserInfo.name || "User") : "Anonymous User"}
                </div>
              </div>

              {/* Local Video - Bottom Half */}
              <div className="flex-1 relative rounded-lg border border-[#343d55] bg-[#050816] overflow-hidden min-h-0">
                {callMode === "VIDEO" ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    onLoadedMetadata={() => {
                      console.log("Local video metadata loaded (in-call state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on metadata (in-call):", err);
                        });
                      }
                    }}
                    onCanPlay={() => {
                      console.log("Local video can play (in-call state)");
                      if (localVideoRef.current) {
                        localVideoRef.current.play().catch((err) => {
                          console.error("Error playing local video on canplay (in-call):", err);
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#111827]">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1f2937] text-xl sm:text-2xl font-semibold">
                      {session.user?.name?.charAt(0) || "?"}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium backdrop-blur">
                  You
                </div>
              </div>
            </div>

            {/* Conversation Timer - Top Center */}
            <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 rounded-full border border-[#343d55] bg-[#0b1018]/80 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium backdrop-blur z-10 flex items-center gap-2">
              {conversationTimer !== null && conversationTimer > 0 ? (
                <>
                  <span className={
                    isExtendedConversation 
                      ? (conversationTimer <= 120 ? "text-red-400 animate-pulse" : "text-[#ffd447]")
                      : (conversationTimer <= 10 ? "text-red-400 animate-pulse" : "text-[#ffd447]")
                  }>
                    {isExtendedConversation 
                      ? formatTime(conversationTimer)
                      : formatCountdown(conversationTimer)
                    }
                  </span>
                  {isExtendedConversation && conversationTimer <= 120 && (
                    <span className="text-red-400 text-[10px]">(Cannot extend)</span>
                  )}
                  <span className="text-[#9aa2c2]">•</span>
                  <span className="text-[#9aa2c2]">{formatTime(callTimer)}</span>
                </>
              ) : (
                <span className="text-[#9aa2c2]">{formatTime(callTimer)}</span>
              )}
            </div>

            {/* Side Panel Toggle Buttons - Mobile Only */}
            <div className="lg:hidden absolute top-4 right-4 flex flex-col gap-2 z-20">
              {/* User Info Button */}
              <button
                onClick={() => {
                  setShowInfoPanel(!showInfoPanel);
                  if (showInfoPanel) setShowChatPanel(false);
                }}
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition ${
                  showInfoPanel
                    ? "border-[#ffd447] bg-[#ffd447] text-[#18120b]"
                    : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] active:border-[#6471a3] active:bg-[#151f35]"
                }`}
                title="User Information"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Chat Button */}
              <button
                onClick={() => {
                  setShowChatPanel(!showChatPanel);
                  if (showChatPanel) setShowInfoPanel(false);
                }}
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition ${
                  showChatPanel
                    ? "border-[#ffd447] bg-[#ffd447] text-[#18120b]"
                    : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] active:border-[#6471a3] active:bg-[#151f35]"
                }`}
                title="Chat"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>

            {/* Controls */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 flex-wrap justify-center max-w-full px-2">
              <button
                onClick={toggleAudio}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border transition ${
                  !isAudioEnabled
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] active:border-[#6471a3] active:bg-[#151f35]"
                }`}
              >
                {!isAudioEnabled ? (
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>

              {callMode === "VIDEO" && (
                <button
                  onClick={toggleVideo}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border transition ${
                    !isVideoEnabled
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] active:border-[#6471a3] active:bg-[#151f35]"
                  }`}
                >
                  {isVideoEnabled ? (
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={handleRequestLongerConversation}
                disabled={
                  longerConversationRequested || 
                  isExtendedConversation || 
                  (conversationTimer !== null && conversationTimer <= 10 && !isExtendedConversation) ||
                  (conversationTimer !== null && conversationTimer <= 120 && isExtendedConversation)
                }
                className={`flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border transition ${
                  isExtendedConversation
                    ? "border-green-500/50 bg-green-500/10 text-green-400 cursor-not-allowed opacity-50"
                    : longerConversationRequested
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400 cursor-not-allowed opacity-50"
                    : (conversationTimer !== null && conversationTimer <= 10 && !isExtendedConversation)
                    ? "border-gray-500/50 bg-gray-500/10 text-gray-400 cursor-not-allowed opacity-50"
                    : "border-blue-500/50 bg-blue-500/10 text-blue-400 active:border-blue-500 active:bg-blue-500/20"
                }`}
                title={
                  isExtendedConversation 
                    ? "Conversation extended to 30 minutes" 
                    : longerConversationRequested 
                    ? "Request sent" 
                    : (conversationTimer !== null && conversationTimer <= 10 && !isExtendedConversation)
                    ? "Too late to request extension"
                    : "Request longer conversation (30 min)"
                }
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                onClick={handleFlag}
                className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 transition active:border-orange-500 active:bg-orange-500/20"
                title="Report user"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              </button>

              <button
                onClick={handleNextMatch}
                className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-[#ffd447] bg-[#ffd447]/10 text-[#ffd447] transition active:border-[#facc15] active:bg-[#ffd447]/20"
                title="Next Match"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={handleSkip}
                className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
                title="Skip"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={handleEndCall}
                className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-red-500 text-white transition active:bg-red-600"
                title="End Call"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 2: Chat Area - Desktop: 1/3, Mobile: Side Panel */}
          <div className="hidden lg:flex flex-1 flex-col border-r border-[#272f45] bg-[#0b1018] min-w-0">
            <div className="flex-1 flex flex-col h-full min-h-0">
              {/* Chat Header */}
              <div className="border-b border-[#272f45] p-4 flex-shrink-0">
                <h3 className="text-sm font-medium text-[#f8f3e8]">Chat</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[#9aa2c2]">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.isOwn
                            ? "bg-[#ffd447] text-[#18120b]"
                            : "bg-[#1f2937] text-[#f8f3e8]"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? "text-[#18120b]/70" : "text-[#9aa2c2]"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-[#272f45] p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-[#3b435a] bg-[#0f1729] px-4 py-2 text-sm text-[#f8f3e8] placeholder:text-[#9aa2c2] focus:outline-none focus:border-[#6471a3]"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="rounded-lg bg-[#ffd447] px-4 py-2 text-sm font-semibold text-[#18120b] transition hover:bg-[#facc15] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Column 3: User Info - Desktop: 1/3, Mobile: Side Panel */}
          <div className="hidden lg:flex flex-1 flex-col border-l border-[#272f45] bg-[#0b1018] min-w-0">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Your Information */}
              <div>
                <h3 className="text-sm font-medium text-[#9aa2c2] mb-2">Your Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2937] text-xl font-semibold">
                      {session.user?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{session.user?.name || "User"}</p>
                      <p className="text-xs text-[#9aa2c2]">{session.user?.email || ""}</p>
                    </div>
                  </div>
                  {userLocation && (
                    <div className="mt-3 pt-3 border-t border-[#272f45]">
                      <div className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-[#9aa2c2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#9aa2c2] mb-1">Location</p>
                          <p className="text-xs text-[#f8f3e8] break-words">{userLocation.address}</p>
                          <p className="text-xs text-[#64748b] mt-1">
                            {userLocation.latitude.toFixed(8)}, {userLocation.longitude.toFixed(8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#272f45]"></div>

              {/* Other User Information */}
              {otherUserInfo && (
                <div>
                  <h3 className="text-sm font-medium text-[#9aa2c2] mb-2">Matched User</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2937] text-xl font-semibold">
                        {otherUserInfo.showName && otherUserInfo.name ? otherUserInfo.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-base font-semibold">
                          {otherUserInfo.showName ? (otherUserInfo.name || "User") : "Anonymous User"}
                        </p>
                        {otherUserInfo.showName && otherUserInfo.email && (
                          <p className="text-xs text-[#9aa2c2]">{otherUserInfo.email}</p>
                        )}
                        {!otherUserInfo.showName && (
                          <p className="text-xs text-[#9aa2c2] italic">Name hidden by user</p>
                        )}
                      </div>
                    </div>
                    {otherUserLocation && (
                      <div className="mt-3 pt-3 border-t border-[#272f45]">
                        <div className="flex items-start gap-2">
                          <svg className="h-4 w-4 text-[#9aa2c2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#9aa2c2] mb-1">Location</p>
                            <p className="text-xs text-[#f8f3e8] break-words">{otherUserLocation.address}</p>
                            <p className="text-xs text-[#64748b] mt-1">
                              {otherUserLocation.latitude.toFixed(8)}, {otherUserLocation.longitude.toFixed(8)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Longer Conversation Request Notification */}
              {longerConversationRequestReceived && (
                <div className="mt-4 pt-4 border-t border-[#272f45]">
                  <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-400 mb-1">Longer Conversation Request</p>
                        <p className="text-xs text-[#9aa2c2] mb-3">
                          The other user wants to extend this conversation to 30 minutes. Would you like to accept?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAcceptLongerConversation}
                            className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 active:bg-blue-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={handleDenyLongerConversation}
                            className="flex-1 rounded-lg border border-[#3b435a] bg-[#0f1729] px-3 py-2 text-xs font-semibold text-[#f8f3e8] transition hover:bg-[#151f35] active:bg-[#1a253a]"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Extended Conversation Status */}
              {isExtendedConversation && (
                <div className="mt-4 pt-4 border-t border-[#272f45]">
                  <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium text-green-400">
                        Conversation extended to 30 minutes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: User Info Side Panel */}
          {showInfoPanel && (
            <div className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0b1018] border-l border-[#272f45] z-30 shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="h-full flex flex-col">
                {/* Panel Header */}
                <div className="border-b border-[#272f45] p-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm sm:text-base font-semibold text-[#f8f3e8]">User Information</h3>
                  <button
                    onClick={() => setShowInfoPanel(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Your Information */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-[#9aa2c2] mb-3">Your Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2937] text-xl font-semibold">
                          {session.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold">{session.user?.name || "User"}</p>
                          <p className="text-xs text-[#9aa2c2]">{session.user?.email || ""}</p>
                        </div>
                      </div>
                      {userLocation && (
                        <div className="mt-3 pt-3 border-t border-[#272f45]">
                          <div className="flex items-start gap-2">
                            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#9aa2c2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#9aa2c2] mb-1">Location</p>
                              <p className="text-xs text-[#f8f3e8] break-words">{userLocation.address}</p>
                              <p className="text-xs text-[#64748b] mt-1">
                                {userLocation.latitude.toFixed(8)}, {userLocation.longitude.toFixed(8)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#272f45]"></div>

                  {/* Other User Information */}
                  {otherUserInfo && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-[#9aa2c2] mb-3">Matched User</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2937] text-xl font-semibold">
                            {otherUserInfo.showName && otherUserInfo.name ? otherUserInfo.name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold">
                              {otherUserInfo.showName ? (otherUserInfo.name || "User") : "Anonymous User"}
                            </p>
                            {otherUserInfo.showName && otherUserInfo.email && (
                              <p className="text-xs text-[#9aa2c2]">{otherUserInfo.email}</p>
                            )}
                            {!otherUserInfo.showName && (
                              <p className="text-xs text-[#9aa2c2] italic">Name hidden by user</p>
                            )}
                          </div>
                        </div>
                        {otherUserLocation && (
                          <div className="mt-3 pt-3 border-t border-[#272f45]">
                            <div className="flex items-start gap-2">
                              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#9aa2c2] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[#9aa2c2] mb-1">Location</p>
                                <p className="text-xs text-[#f8f3e8] break-words">{otherUserLocation.address}</p>
                                <p className="text-xs text-[#64748b] mt-1">
                                  {otherUserLocation.latitude.toFixed(8)}, {otherUserLocation.longitude.toFixed(8)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Longer Conversation Request Notification */}
                  {longerConversationRequestReceived && (
                    <div className="mt-4 pt-4 border-t border-[#272f45]">
                      <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-400 mb-1">Longer Conversation Request</p>
                            <p className="text-xs text-[#9aa2c2] mb-3">
                              The other user wants to extend this conversation to 30 minutes. Would you like to accept?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={handleAcceptLongerConversation}
                                className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 active:bg-blue-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={handleDenyLongerConversation}
                                className="flex-1 rounded-lg border border-[#3b435a] bg-[#0f1729] px-3 py-2 text-xs font-semibold text-[#f8f3e8] transition hover:bg-[#151f35] active:bg-[#1a253a]"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extended Conversation Status */}
                  {isExtendedConversation && (
                    <div className="mt-4 pt-4 border-t border-[#272f45]">
                      <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs font-medium text-green-400">
                            Conversation extended to 30 minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile: Chat Side Panel */}
          {showChatPanel && (
            <div className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0b1018] border-l border-[#272f45] z-30 shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="h-full flex flex-col">
                {/* Panel Header */}
                <div className="border-b border-[#272f45] p-4 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm sm:text-base font-semibold text-[#f8f3e8]">Chat</h3>
                  <button
                    onClick={() => setShowChatPanel(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] text-[#f8f3e8] transition active:border-[#6471a3] active:bg-[#151f35]"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs sm:text-sm text-[#9aa2c2]">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            msg.isOwn
                              ? "bg-[#ffd447] text-[#18120b]"
                              : "bg-[#1f2937] text-[#f8f3e8]"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.isOwn ? "text-[#18120b]/70" : "text-[#9aa2c2]"}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-[#272f45] p-4 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-[#3b435a] bg-[#0f1729] px-4 py-2 text-sm text-[#f8f3e8] placeholder:text-[#9aa2c2] focus:outline-none focus:border-[#6471a3]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="rounded-lg bg-[#ffd447] px-4 py-2 text-sm font-semibold text-[#18120b] transition active:bg-[#facc15] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Overlay when panel is open on mobile */}
          {(showInfoPanel || showChatPanel) && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => {
                setShowInfoPanel(false);
                setShowChatPanel(false);
              }}
            />
          )}
        </div>
      )}

      {/* Ended State */}
      {matchStatus === "ended" && (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-md w-full space-y-4 sm:space-y-6 text-center">
            <div className="space-y-3 sm:space-y-4">
              <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 rounded-full border-4 border-[#3b435a] bg-[#050816] flex items-center justify-center">
                <svg
                  className="h-8 w-8 sm:h-12 sm:w-12 text-[#9aa2c2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Call ended</h2>
                <p className="mt-2 text-xs sm:text-sm text-[#9aa2c2] px-2">
                  Thanks for the conversation!
                </p>
              </div>
              <button
                onClick={() => setMatchStatus("idle")}
                className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-[#ffd447] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-[#18120b] shadow-[0_0_22px_rgba(250,204,21,0.45)] transition active:-translate-y-0.5 active:bg-[#facc15]"
              >
                Start new conversation
              </button>
            </div>
          </div>
        </div>
      )}

      <FlagModal
        isOpen={showFlagModal}
        onClose={() => {
          setShowFlagModal(false);
          setFlagId(null);
        }}
        flaggedUserId={otherUserId || ""}
        matchId={currentMatchId || ""}
        onFlagSubmit={handleFlagSubmit}
      />

    </div>
  );
}
