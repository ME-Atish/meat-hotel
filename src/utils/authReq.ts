import { Request } from "express";
import mongoose from "mongoose";



interface AuthenticationRequest extends Request {
  user: {
    _id: mongoose.Types.ObjectId;
    username: string;
    firstName: String;
    lastName: string;
    password: string;
    phone: string;
    email: string,
    role: string;
    isReserved: boolean;
    isOwner: boolean;
    isBan: boolean;
    refreshToken: string;
  };
}

export default AuthenticationRequest;
