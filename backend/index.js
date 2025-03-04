const express = require("express");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const wss = new WebSocketServer({ server });
const sessions = {}; // Stores active sessions

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "createSession") {
      const sessionId = uuidv4();
      sessions[sessionId] = [ws];
      ws.sessionId = sessionId;
      console.log(`Session created: ${sessionId}`);
      ws.send(JSON.stringify({ type: "sessionCreated", sessionId }));
    }

    if (data.type === "joinSession") {
      const { sessionId } = data;
      if (sessions[sessionId]) {
        sessions[sessionId].push(ws);
        ws.sessionId = sessionId;
        console.log(`User joined session: ${sessionId}`);
        ws.send(JSON.stringify({ type: "sessionJoined", sessionId }));
        sessions[sessionId].forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify({ type: "peerJoined" }));
          }
        });
      } else {
        ws.send(JSON.stringify({ type: "error", message: "Session not found" }));
      }
    }

    if (data.type === "file") {
      const { sessionId, fileName, fileData } = data;
      console.log(`File received in session ${sessionId}: ${fileName}`);

      sessions[sessionId]?.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify({ type: "file", fileName, fileData }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    const { sessionId } = ws;
    if (sessionId && sessions[sessionId]) {
      sessions[sessionId] = sessions[sessionId].filter(client => client !== ws);
      if (sessions[sessionId].length === 0) delete sessions[sessionId];
    }
  });
});
