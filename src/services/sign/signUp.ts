import { PrismaClient } from "@prisma/client"
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import convertUserToPayload from "../jwt/convertUserToPayload";
import ApiError from "../../classes/apiError";

const prisma = new PrismaClient();

interface ISignUpReq {
	email: string;
	username: string;
	password: string;
  confirmPassword: string;
}

interface ISignUpRes {
  token: string
}

const signUp = async ({ email, username, password, confirmPassword }: ISignUpReq): Promise<ISignUpRes|void> => {
  if (password != confirmPassword) throw new ApiError("The passwords are differents.", 400);

  const user = await prisma.users.findFirst({
    where: {
      OR: [
        {
          username,
        }, {
          email,
        }
      ]
    }
  });

  if (user != null) {
    if (user.username == username) throw new ApiError("Username already exists.", 400);
    if (user.email == email) throw new ApiError("Email already in use.", 400);
    throw new ApiError("Something went wrong.", 400);
  }

  const salt =  await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  const createdUser = await prisma.users.create({
    data: {
      id: v4(),
      email,
      username: username.toLowerCase(),
      password: passwordHashed
    }
  });

  const userPayloadFormat = convertUserToPayload({ user: createdUser });

  const secret = process.env.JWT_SECRET as jwt.Secret;
  const token = jwt.sign(userPayloadFormat, secret, {
    expiresIn: 60000
  })

  prisma.$disconnect;
  return { token };
}

export default signUp;
