import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import convertUserToPayload from "../jwt/convertUserToPayload";
import ApiError from "../../classes/apiError";
import { signInSchema } from "../../validations/signValidations";

const prisma = new PrismaClient();

interface ISignInReq {
	email: string;
	password: string;
}

interface ISignInRes {
  token: string;
}

const signIn = async ({ email, password }: ISignInReq): Promise<ISignInRes|void> => {
  const signInValidation = signInSchema.validate({ email, password });
  
  if (signInValidation === undefined)
    throw new ApiError("Something went wrong when trying to sign in.", 500);

  if (signInValidation.error != undefined) {
    if (signInValidation.error.details.filter(detail => detail.path.includes("email")).length > 0)
      throw new ApiError("'email' must be a valid email.", 400);
  
    if (signInValidation.error.details.filter(detail => detail.path.includes("password")).length > 0)
      throw new ApiError("'password' must be a valid password.", 400);
  }

  const user = await prisma.users.findFirst({
    where: {
      email
    }
  });

  if (user == null) throw new ApiError("User not found.", 400);

  const isSamePassword = await bcrypt.compare(password, user.password);

  if (!isSamePassword) throw new ApiError("The password is wrong.", 400);

  const userPayloadFormat = convertUserToPayload({ user });

  const secret = process.env.JWT_SECRET as jwt.Secret;
  const token = jwt.sign(userPayloadFormat, secret, {
    expiresIn: 60000
  });

  prisma.$disconnect;

  return { token };
}

export default signIn;
