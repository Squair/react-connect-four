import { io } from "socket.io-client";

export const createSocket = (socketHost: string, username: string, boardSizeId: string) => io(socketHost, { query: { username, boardSizeId } });