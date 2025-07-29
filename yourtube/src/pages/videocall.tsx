// pages/videocall.tsx
import React, { useRef, useEffect } from 'react';

const VideoCall: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // This will access the user's camera and show it in the local video
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getLocalStream();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Video Call</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <p><strong>You</strong></p>
          <video ref={localVideoRef} autoPlay playsInline muted width="300" />
        </div>
        <div>
          <p><strong>Remote</strong></p>
          <video ref={remoteVideoRef} autoPlay playsInline width="300" />
        </div>
      </div>
      <p>This is your video calling page. Connect WebRTC or use a video SDK next.</p>
    </div>
  );
};

export default VideoCall;
