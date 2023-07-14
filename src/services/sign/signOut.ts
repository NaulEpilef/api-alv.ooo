import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import convertUserToPayload from "../jwt/convertUserToPayload";

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

    if (user == null) throw "Usuário não encontrado";

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) throw "A senha está errada";

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
