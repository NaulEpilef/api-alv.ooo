import { PrismaClient, Targets } from "@prisma/client"
import jwt, { JwtPayload } from "jsonwebtoken";

import { createTargetSchema } from "../../validations/targetValidation";
import ApiError from "../../classes/apiError";
import { ISuccessResponse } from "../../interfaces/error";

const prisma = new PrismaClient();

interface ICreateTargetReq {
	token: string;
  title: string;
  isPrivate: boolean;
}

const createTarget = async ({ token, title, isPrivate }: ICreateTargetReq): Promise<ISuccessResponse<null>|void> => {
	const createTargetValidation = createTargetSchema.validate({ title, isPrivate });

	if (createTargetValidation === undefined)
		throw new ApiError("Something went wrong when trying to sign in.", 500);

	if (createTargetValidation.error != undefined) {
		if (createTargetValidation.error.details.filter(detail => detail.path.includes("title")).length > 0)
			throw new ApiError("'title' must be a valid title.", 400);
	
		if (createTargetValidation.error.details.filter(detail => detail.path.includes("isPrivate")).length > 0)
			throw new ApiError("'privacy' must be a valid value.", 400);
	}

	const secret = process.env.JWT_SECRET as jwt.Secret;
	const decodedToken = jwt.verify(token, secret) as JwtPayload;

	await prisma.targets.create({
		data: {
			userId: decodedToken.userId,
			isPrivate,
			title
		}
	});

	prisma.$disconnect;
	return { status: "success", data: null };
}

export default createTarget;