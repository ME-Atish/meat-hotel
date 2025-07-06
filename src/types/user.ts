import { ObjectId } from "mongoose";

enum Role {
  USER,
  ADMIN
}

export interface User {
  _id: ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  email: string;
  role: "ADMIN" | "USER";
  isReserved: boolean;
  isOwner: boolean;
  isBan: boolean;
  refreshToken: string;
}