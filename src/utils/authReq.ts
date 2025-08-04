import { Request } from "express";

interface AuthenticationRequest extends Request {
  user: {
    id: number;
    username: string;
    firstName: String;
    lastName: string;
    password: string;
    phone: string;
    email: string;
    role: string;
    isReserved: number;
    isOwner: number;
    isBan: number;
    refreshToken: string;
  };
}

export default AuthenticationRequest;
