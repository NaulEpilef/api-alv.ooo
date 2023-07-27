import { PrismaClient, Targets } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../../classes/apiError";
import { ISuccessResponse } from "../../interfaces/error";
import { toggleCompleteTargetSchema } from "../../validations/targetValidation";

const prisma = new PrismaClient();

interface IToggleCompleteTarget {
  targetId: string;
  token: string;
  isCompleted: boolean;
}

const toggleCompleteTarget = async ({ targetId, isCompleted, token }: IToggleCompleteTarget): Promise<ISuccessResponse<null>|void> => {
	const toggleCompleteTargetValidation = toggleCompleteTargetSchema.validate({ targetId, isCompleted });

	if (toggleCompleteTargetValidation === undefined)
		throw new ApiError("Something went wrong when trying to sign in.", 500);

	if (toggleCompleteTargetValidation.error != undefined) {
    if (toggleCompleteTargetValidation.error.details.filter(detail => detail.path.includes("targetId")).length > 0)
      throw new ApiError("Not sure about the 'target' you want to edit.", 400);

		if (toggleCompleteTargetValidation.error.details.filter(detail => detail.path.includes("isCompleted")).length > 0)
			throw new ApiError("'isCompleted' must be a valid value.", 400);
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
      isCompleted
    },
    where: {
      id: target.id,
    }
  });

  prisma.$disconnect;
  return { status: "success", data: null };
}

export default toggleCompleteTarget;