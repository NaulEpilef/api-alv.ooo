import { PrismaClient, Targets } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../../classes/apiError";

const prisma = new PrismaClient();

interface IEditTarget {
  targetId: string;
  token: string;
  title: string;
  isPrivate: boolean;
}

const editTarget = async ({ targetId, isPrivate, title, token }: IEditTarget): Promise<Targets|void> => {
  try {
    const secret = process.env.JWT_SECRET as jwt.Secret;
    const decodedToken = jwt.verify(token, secret) as JwtPayload;


    const target = await prisma.targets.findFirst({
      where: {
        id: targetId,
        userId: decodedToken.userId
      }
    });

    if (target == null) throw new ApiError("The user is not the owner of this target", 400);

    const targetEdited = await prisma.targets.update({
      data: {
        title,
        isPrivate
      },
      where: {
        id: target.id,
      }
    });

    prisma.$disconnect;
    return targetEdited;
  } catch (err) {
    console.error(err);
    prisma.$disconnect;
  }
}

export default editTarget;