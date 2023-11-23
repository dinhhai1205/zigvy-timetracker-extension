import simpleDDP from 'simpleddp';
import ws from 'isomorphic-ws';
import { simpleDDPLogin } from 'simpleddp-plugin-login';

export const ddpClient = new simpleDDP(
  {
    endpoint: 'wss://time-tracker.zigvy.com//websocket',
    SocketConstructor: ws,
    reconnectInterval: 5000,
  },
  [simpleDDPLogin]
);
