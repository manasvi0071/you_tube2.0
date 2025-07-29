import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  selectPeers,
  HMSPeer,
} from "@100mslive/react-sdk";
import { useEffect } from "react";

const MeetingRoom = () => {
  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers);

  useEffect(() => {
    const authToken = process.env.NEXT_PUBLIC_HMS_AUTH_TOKEN;

    if (!authToken) {
      console.error("❌ HMS Auth Token is missing. Please check your .env.local file.");
      return;
    }

    hmsActions.join({
      userName: "Manasvi 😄",
      authToken: authToken,
      settings: {
        isAudioMuted: true,
        isVideoMuted: true,
      },
      initEndpoint: "", // leave this empty unless using a token server
    });
  }, [hmsActions]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎥 Live Meeting Room</h1>
      {peers.length === 0 && <p>Waiting for participants...</p>}
      {peers.map((peer: HMSPeer) => (
        <div key={peer.id}>
          👤 {peer.name} ({peer.roleName})
        </div>
      ))}
    </div>
  );
};

export default function MeetingPage() {
  return (
    <HMSRoomProvider>
      <MeetingRoom />
    </HMSRoomProvider>
  );
}
