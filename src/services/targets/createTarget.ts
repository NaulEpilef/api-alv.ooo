import { PrismaClient, Targets } from "@prisma/client"

const prisma = new PrismaClient();

interface ICreateTargetReq {
  title: string;
  isPrivate: boolean;
}

const createUsers = async ({ title, isPrivate }: ICreateTargetReq): Promise<Targets|void> => {
	try {
    
	} catch (err) {
		console.error(err);
		prisma.$disconnect;
	}
}

export default createUsers;