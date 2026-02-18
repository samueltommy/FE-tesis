import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Scan, Activity, Loader2, ServerCrash } from 'lucide-react';
import { Badge } from '../ui/badge';

interface VideoFeedProps {
  title: string;
  type: 'top' | 'side';
  selectedId?: string;
  enableYolo?: boolean;
}

export const VideoFeed = ({ title, type, selectedId, enableYolo }: VideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  
  // Track the state of the video feed to show the appropriate UI
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'playing' | 'error'>('connecting');

  useEffect(() => {
    const initWebRTC = async () => {
      setStreamStatus('connecting');
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      pc.addTransceiver('video', { direction: 'recvonly' });

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // Listen for connection failures
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setStreamStatus('error');
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await new Promise<void>((resolve) => {
          if (pc.iceGatheringState === 'complete') {
            resolve();
          } else {
            const checkState = () => {
              if (pc.iceGatheringState === 'complete') {
                pc.removeEventListener('icegatheringstatechange', checkState);
                resolve();
              }
            };
            pc.addEventListener('icegatheringstatechange', checkState);
            setTimeout(() => {
              pc.removeEventListener('icegatheringstatechange', checkState);
              resolve();
            }, 1000); 
          }
        });

        const camId = type === 'top' ? '1' : '2';
        const webrtcUrl = `http://127.0.0.1:8080/offer?cam=${camId}`;

        const response = await fetch(webrtcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sdp: pc.localDescription?.sdp,
            type: pc.localDescription?.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch WebRTC answer: ${response.statusText}`);
        }

        const answer = await response.json();
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('WebRTC Connection Error:', error);
        setStreamStatus('error');
      }
    };

    initWebRTC();

    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [type]);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden rounded-lg border border-zinc-800 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900/90 px-2 py-1.5 backdrop-blur-md border-b border-zinc-800 z-10 shadow-sm shrink-0">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          {type === 'top' ? <Scan className="w-4 h-4 text-emerald-400" /> : <Activity className="w-4 h-4 text-amber-400" />}
          {title}
        </h3>
        <Badge 
          variant="outline" 
          className={`
            ${streamStatus === 'playing' ? 'bg-red-950/40 text-red-500 border-red-900 animate-pulse' : 'bg-zinc-800 text-zinc-400 border-zinc-700'} 
            text-[10px] px-2 py-0.5 rounded-full
          `}
        >
          {streamStatus === 'playing' ? '● LIVE' : streamStatus === 'error' ? 'OFFLINE' : 'CONNECTING'}
        </Badge>
      </div>

      {/* Video Area */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        
        {/* Loading Ornament */}
        {streamStatus === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="mb-4"
            >
              <Loader2 className="w-10 h-10 text-zinc-500" />
            </motion.div>
            <span className="text-zinc-400 font-mono text-xs tracking-widest animate-pulse">
              ESTABLISHING EDGE NODE CONNECTION...
            </span>
            <span className="text-zinc-600 font-mono text-[10px] mt-2">
              CAM-{type === 'top' ? '01' : '02'} FEED
            </span>
          </div>
        )}

        {/* Error State */}
        {streamStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
            <ServerCrash className="w-10 h-10 text-red-900 mb-4" />
            <span className="text-red-500 font-mono text-xs tracking-widest">
              CONNECTION FAILED
            </span>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 text-[10px] text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {/* Video Element */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          onPlaying={() => setStreamStatus('playing')}
          // Reverted back to object-contain so no tracking data gets cut off
          className={`w-full h-full object-contain bg-black transition-opacity duration-700 ${streamStatus === 'playing' ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
};