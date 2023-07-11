import { PrismaClient, Targets } from "@prisma/client";

const prisma = new PrismaClient();

const listAllTargets = async (): Promise<Targets[]|void> => {
  try {
    const listTargets = await prisma.targets.findMany({
      where: {
        isPrivate: false
      }
    });

    prisma.$disconnect;
    return listTargets;
  } catch (err) {
    console.error(err);
    prisma.$disconnect;
  }
}

export default listAllTargets;