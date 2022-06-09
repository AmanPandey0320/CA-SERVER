declare namespace Express {
  export interface Request {
    currIp: string;
    reqId: string;
    sessionID: string;
    session: any;
  }
}
