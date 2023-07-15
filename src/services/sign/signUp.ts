import { PrismaClient } from "@prisma/client"
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import convertUserToPayload from "../jwt/convertUserToPayload";
import ApiError from "../../classes/apiError";
import { signUpSchema } from "../../validations/signValidations";

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
  const signUpValidation = signUpSchema.validate({ email, username, password, confirmPassword });
  
  if (signUpValidation === undefined)
    throw new ApiError("Something went wrong when trying to sign up.", 500);

  if (signUpValidation.error != undefined) {
    if (signUpValidation.error.details.filter(detail => detail.path.includes("email")).length > 0)
      throw new ApiError("'email' must be a valid email.", 400);
  
    if (signUpValidation.error.details.filter(detail => detail.path.includes("username")).length > 0)
      throw new ApiError("'username' must be a valid username.", 400);

    if (password != confirmPassword)
      throw new ApiError("The 'password' and 'confirm password' are differents.", 400);
  
    if (signUpValidation.error.details.filter(detail => detail.path.includes("password")).length > 0)
      throw new ApiError("'password' must be a valid password.", 400);

    if (signUpValidation.error.details.filter(detail => detail.path.includes("confirmPassword")).length > 0)
      throw new ApiError("'confirmPassword' must be a valid confirmPassword.", 400);
  }

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
