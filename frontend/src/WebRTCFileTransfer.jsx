import React, { useState, useEffect, useRef } from "react";

export default function WebRTCFileTransfer() {
  const [ws, setWs] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [joinedSession, setJoinedSession] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:5000");
    setWs(websocket);

    websocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "sessionCreated") {
        setSessionId(data.sessionId);
      }

      if (data.type === "sessionJoined") {
        setJoinedSession(true);
      }

      if (data.type === "file") {
        setReceivedFiles((prev) => [...prev, { name: data.fileName, data: data.fileData }]);
      }
    };

    return () => websocket.close();
  }, []);

  const createSession = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "createSession" }));
    }
  };

  const joinSession = () => {
    if (ws && sessionId) {
      ws.send(JSON.stringify({ type: "joinSession", sessionId }));
    }
  };

  const sendFile = () => {
    const file = fileInputRef.current.files[0];
    if (file && ws) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        ws.send(JSON.stringify({ type: "file", sessionId, fileName: file.name, fileData: reader.result }));
      };
    }
  };

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold">WebRTC File Transfer</h1>

      {!sessionId ? (
        <button onClick={createSession} className="bg-blue-500 text-white p-2 rounded mt-4">Create Session</button>
      ) : (
        <p className="mt-2">Session ID: <strong>{sessionId}</strong></p>
      )}

      <div className="mt-4">
        <input 
          type="text" 
          placeholder="Enter Session ID" 
          value={sessionId} 
          onChange={(e) => setSessionId(e.target.value)} 
          className="border p-2"
        />
        <button onClick={joinSession} className="bg-green-500 text-white p-2 rounded ml-2">Join Session</button>
      </div>

      {joinedSession && (
        <div className="mt-5">
          <input type="file" ref={fileInputRef} className="p-2 border" />
          <button onClick={sendFile} className="bg-purple-500 text-white p-2 rounded ml-2">Send File</button>
        </div>
      )}

      {receivedFiles.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-bold">Received Files:</h2>
          <ul>
            {receivedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.data} download={file.name} className="text-blue-500 underline">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}