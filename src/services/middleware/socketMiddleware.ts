import { Middleware } from 'redux';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from '@reduxjs/toolkit';

type WsActions = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsConnecting: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;
  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<any>;
};

export const socketMiddleware =
  (wsActions: WsActions): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const {
        wsConnect,
        wsDisconnect,
        wsConnecting,
        wsOpen,
        wsClose,
        wsError,
        wsMessage
      } = wsActions;

      if (wsConnect.match(action)) {
        socket = new WebSocket(action.payload);
        dispatch(wsConnecting());
        socket.onopen = () => dispatch(wsOpen());
        socket.onerror = () => dispatch(wsError('WebSocket error'));
        socket.onclose = () => dispatch(wsClose());
        socket.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            dispatch(wsMessage(parsed));
          } catch (err) {
            dispatch(wsError('Невалидный JSON от сервера'));
          }
        };
      }

      if (wsDisconnect.match(action)) {
        if (socket) {
          socket.close();
          socket = null;
        }
      }

      next(action);
    };
  };
