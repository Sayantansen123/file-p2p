import React, { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";


const webrtc = () => {
    const [peer, setPeer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [file, setFile] = useState(null);
    const [receivedFile, setReceivedFile] = useState(null);
    const peerRef = useRef(null);
    const fileDataRef = useRef([]);

    useEffect(() => {
        // Connect to WebSocket signaling server
        const ws = new WebSocket("ws://localhost:5000");
        setSocket(ws);
    
        ws.onmessage = (message) => {
          const data = JSON.parse(message.data);
          if (data.type === "signal" && peerRef.current) {
            peerRef.current.signal(data.signal);
          }
        };
    
        return () => ws.close();
      }, []);

  return (
    <div>
      
    </div>
  )
}

export default webrtc
