import { Request } from "express";
import { User } from "@/types/user";

export interface ValidatedRequest extends Request {
  user: User
}