import { PrismaClient, Targets } from "@prisma/client"
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

interface ICreateTargetReq {
	token: string;
  title: string;
  isPrivate: boolean;
}

const createUsers = async ({ token, title, isPrivate }: ICreateTargetReq): Promise<Targets|void> => {
	try {
    const secret = process.env.JWT_SECRET as jwt.Secret;
    const decodedToken = jwt.verify(token, secret) as JwtPayload;

		const target = await prisma.targets.create({
			data: {
				userId: decodedToken.userId,
				isPrivate,
				title
			}
		});

		return target;

	} catch (err) {
		console.error(err);
		prisma.$disconnect;
	}
}

export default createUsers;