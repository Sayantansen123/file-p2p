import React, { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";


const webrtc = () => {
    const [peer, setPeer] = useState(null);
    const [socket, setSocket] = useState(null);
    const [file, setFile] = useState(null);
    const [receivedFile, setReceivedFile] = useState(null);
    const peerRef = useRef(null);
    const fileDataRef = useRef([]);

  return (
    <div>
      
    </div>
  )
}

export default webrtc
