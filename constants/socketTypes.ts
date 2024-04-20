import { SignalData } from "simple-peer";

export interface ServerToClientEvents {
  invalidUser: () => void;
  userOffline: () => void;
  getSignalDetails: (signal: SignalData, id: string) => void;
  sendSignalAnswer: (signal: SignalData, id: string) => void;
  ttees: () => void;
}

export interface ClientToServerEvents {
  saveSignalOffer: (signal: SignalData) => void;
  getSignalOffer: (id: string) => void;
  sendSignalAnswer: (signal: SignalData, id: string) => void;
}
