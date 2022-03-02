import { io } from "socket.io-client";

export const createSocket = (socketHost: string, username: string) => io(socketHost, { query: { username } });