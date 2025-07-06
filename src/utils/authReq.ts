import { Request } from "express";

interface authenticationRequest extends Request {
  user: Object;
}

export default authenticationRequest