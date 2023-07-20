import { PrismaClient, Targets } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../../classes/apiError";
import { ISuccessResponse } from "../../interfaces/error";
import { editTargetSchema } from "../../validations/targetValidation";

const prisma = new PrismaClient();

interface IEditTarget {
  targetId: string;
  token: string;
  title: string;
  isPrivate: boolean;
}

const editTarget = async ({ targetId, isPrivate, title, token }: IEditTarget): Promise<ISuccessResponse<null>|void> => {
	const editTargetValidation = editTargetSchema.validate({ targetId, title, isPrivate });

	if (editTargetValidation === undefined)
		throw new ApiError("Something went wrong when trying to sign in.", 500);

	if (editTargetValidation.error != undefined) {
    if (editTargetValidation.error.details.filter(detail => detail.path.includes("targetId")).length > 0)
      throw new ApiError("Not sure about the 'target' you want to edit.", 400);

		if (editTargetValidation.error.details.filter(detail => detail.path.includes("title")).length > 0)
			throw new ApiError("'title' must be a valid title.", 400);
	
		if (editTargetValidation.error.details.filter(detail => detail.path.includes("isPrivate")).length > 0)
			throw new ApiError("'privacy' must be a valid value.", 400);
	}

  const secret = process.env.JWT_SECRET as jwt.Secret;
  const decodedToken = jwt.verify(token, secret) as JwtPayload;


  const target = await prisma.targets.findFirst({
    where: {
      id: targetId,
      userId: decodedToken.userId
    }
  });

  if (target == null) throw new ApiError("The user is not the owner of this target", 400);

  await prisma.targets.update({
    data: {
      title,
      isPrivate
    },
    where: {
      id: target.id,
    }
  });

  prisma.$disconnect;
  return { status: "success", data: null };
}

export default editTarget;