import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import convertUserToPayload from "../jwt/convertUserToPayload";
import ApiError from "../../classes/apiError";

const prisma = new PrismaClient();

interface ISignInReq {
	email: string;
	password: string;
}

interface ISignInRes {
  token: string;
}

const signIn = async ({ email, password }: ISignInReq): Promise<ISignInRes|void> => {
	try {
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
	} catch (err) {
		console.error(err);
		prisma.$disconnect;
	}
}

export default signIn;
