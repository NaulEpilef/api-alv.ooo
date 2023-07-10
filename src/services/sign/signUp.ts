import { PrismaClient } from "@prisma/client"
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import convertUserToPayload from "../jwt/convertUserToPayload";

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
	try {
    if (password != confirmPassword) throw "As senhas não são iguais";

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username,
          }, {
            email
          }
        ]
      }
    });

    if (user != null) {
      if (user.username == username) throw "Nome de usuário já existe";
      if (user.email == email) throw "E-mail já existe";
      throw "Algo deu errado";
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
	} catch (err) {
		console.error(err);
		prisma.$disconnect;
	}
}

export default signUp;
