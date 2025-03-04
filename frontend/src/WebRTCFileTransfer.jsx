import React, { useState, useRef, useEffect } from "react";
import SimplePeer from "simple-peer";




const WebRTCFileTransfer = () => {
    const [sCreated, setsCreated] = useState(false);
    const [socket, setSocket] = useState(null);
    const wsRef = useRef(null);
    const fileInputRef = useRef(null);
    const [sessionId, setSessionId] = useState("");
    const [joinedSession, setJoinedSession] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState([]);

    useEffect(() => {
        if (!wsRef.current) {
            const ws = new WebSocket("ws://localhost:5000");
            wsRef.current = ws;
            setSocket(ws);

            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);

                if (data.type === "sessionCreated") {
                    setSessionId(data.sessionId);
                    setsCreated(true);
                } else if (data.type === "sessionJoined") {
                    setJoinedSession(true);
                } else if (data.type === "file") {
                    const fileBlob = new Blob([new Uint8Array(data.fileData)]);
                    const fileURL = URL.createObjectURL(fileBlob);

                    setReceivedFiles((prev) => [
                        ...prev,
                        { name: data.fileName, data: fileURL },
                    ]);
                }
            };

            return () => {
                ws.close();
                wsRef.current = null;
            };
        }
    }, []);

    const createSession = () => {
        if (socket) {
            socket.send(JSON.stringify({ type: "createSession" }));
        }
    };

    const joinSession = () => {
        if (socket && sessionId) {
            socket.send(JSON.stringify({ type: "joinSession", sessionId }));
        }
    };

    const sendFile = () => {
        if (!joinedSession) {
            alert("Join a session first!");
            return;
        }

        const file = fileInputRef.current.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const data = {
                type: "file",
                sessionId,
                fileName: file.name,
                fileData: Array.from(new Uint8Array(reader.result)),
            };

            socket.send(JSON.stringify(data));
            console.log("File sent:", file.name);
        };
    };

    return (
        <div className="p-5 text-center">
            <h1 className="text-2xl font-bold">WebRTC File Transfer</h1>

            {!sessionId ? (
                <button onClick={createSession} className="bg-blue-500 text-white p-2 rounded mt-4">
                    Create Session
                </button>
            ) : (
                <><p className="mt-2">Session ID: <strong>{sessionId}</strong></p>
                    {sCreated ? <div>session created by you</div> : <></>}
                </>
            )}

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Enter Session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="border p-2"
                />
                <button onClick={joinSession} className="bg-green-500 text-white p-2 rounded ml-2">
                    Join Session
                </button>
            </div>

            {joinedSession && (
                <div className="mt-5">
                    <input type="file" ref={fileInputRef} className="p-2 border" />
                    <button onClick={sendFile} className="bg-purple-500 text-white p-2 rounded ml-2">
                        Send File
                    </button>
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
};

export default WebRTCFileTransfer;
