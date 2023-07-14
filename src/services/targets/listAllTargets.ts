import { PrismaClient } from "@prisma/client";
import { ITargetListAll } from "../../interfaces/targets";

const prisma = new PrismaClient();

const listAllTargets = async (): Promise<ITargetListAll[]|void> => {
  try {
    const listTargets = await prisma.targets.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        isCompleted: true,
        isPrivate: true,
        user: {
          select: {
            username: true
          }
        }
      },
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