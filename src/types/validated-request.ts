import { Request } from "express";
import { User as UserType } from "@/types/user";
import { HydratedDocument } from "mongoose";

export interface ValidatedRequest extends Request {
  user: UserType | HydratedDocument<UserType>
}