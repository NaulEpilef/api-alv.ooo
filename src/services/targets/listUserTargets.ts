import { PrismaClient, Users } from "@prisma/client";
import { ITargetListAll } from "../../interfaces/targets";

const prisma = new PrismaClient();

interface IListUserTargetsReq {
  currentUser: Users;
  username: string;
  isLogged: boolean;
}

const listUserTargets = async ({ currentUser, username, isLogged }: IListUserTargetsReq): Promise<ITargetListAll[]|void> => {
  try {
    const userTargets = await prisma.targets.findMany({
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
        user: {
          username,
        },
        AND: {
          OR: [
            {
              isPrivate: false,
            },
            {
              isPrivate: isLogged ? currentUser.username == username : false,
            },
          ],
        }
      }
    });

    prisma.$disconnect;
    return userTargets;
  } catch (err) {
    console.error(err);
    prisma.$disconnect;
  }
}

export default listUserTargets;