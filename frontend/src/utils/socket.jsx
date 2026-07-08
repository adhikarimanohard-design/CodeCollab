import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BASE_URL = "https://codecollab-v9om.onrender.com";
let stompClient = null;

export const connectWebSocket = (roomId, myId, callbacks) => {
  if (stompClient) stompClient.deactivate();

  const socket = new SockJS(`${BASE_URL}/ws`, null, {
    transports: ['websocket', 'xhr-streaming', 'xhr-polling']
  });

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 3000,
    heartbeatIncoming: 25000,
    heartbeatOutgoing: 25000,

    onConnect: () => {
      callbacks.onConnect();

      stompClient.subscribe(`/topic/room/${roomId}/code`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data.userId !== myId) callbacks.onCodeUpdate(data.code);
      });

      stompClient.subscribe(`/topic/room/${roomId}/users`, (msg) => {
        callbacks.onUsersUpdate(JSON.parse(msg.body));
      });

      stompClient.subscribe(`/topic/room/${roomId}/chat`, (msg) => {
        callbacks.onChatReceive(JSON.parse(msg.body));
      });

      stompClient.publish({
        destination: `/app/room/${roomId}/join`,
        body: JSON.stringify({ userId: myId })
      });
    },

    onDisconnect: () => callbacks.onDisconnect(),
    onStompError: (frame) => callbacks.onError(frame),
    onWebSocketError: (error) => callbacks.onError(error)
  });

  stompClient.activate();
};

export const sendSocketCodeUpdate = (roomId, code, myId) => {
  if (!stompClient || !stompClient.connected) return;
  stompClient.publish({
    destination: `/app/room/${roomId}/code`,
    body: JSON.stringify({ code, userId: myId })
  });
};

export const sendSocketChatMessage = (roomId, myId, name, message) => {
  if (!stompClient || !stompClient.connected) return;
  stompClient.publish({
    destination: `/app/room/${roomId}/chat`,
    body: JSON.stringify({ userId: myId, name, message })
  });
};