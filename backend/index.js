import express from "express";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid"; // To generate unique session IDs
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const wss = new WebSocketServer({ server });
const sessions = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    
    if (data.type === "createSession") {
      // Generate unique session ID
      const sessionId = uuidv4();
      sessions[sessionId] = [ws];
      ws.sessionId = sessionId;
      ws.send(JSON.stringify({ type: "sessionCreated", sessionId }));
    }

    if (data.type === "joinSession") {
      const { sessionId } = data;
      if (sessions[sessionId]) {
        sessions[sessionId].push(ws);
        ws.sessionId = sessionId;
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

    if (data.type === "signal") {
      const { sessionId, signal } = data;
      sessions[sessionId]?.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify({ type: "signal", signal }));
        }
      });
    }
  });

  ws.on("close", () => {
    const { sessionId } = ws;
    if (sessionId && sessions[sessionId]) {
      sessions[sessionId] = sessions[sessionId].filter(client => client !== ws);
      if (sessions[sessionId].length === 0) {
        delete sessions[sessionId];
      }
    }
  });
});
