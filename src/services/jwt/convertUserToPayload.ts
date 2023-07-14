import { Users } from "@prisma/client";

interface ICreatePayloadReq {
  user: Users;
}

interface ICreatePayloadRes {
  userId: string;
  username: string;
  email: string;
}

const convertUserToPayload = ({ user }: ICreatePayloadReq): ICreatePayloadRes => {
  return {
    userId: user.id,
    email: user.email,
    username: user.username
  }
}

export default convertUserToPayload;