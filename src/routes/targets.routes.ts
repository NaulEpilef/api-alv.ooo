import { Router } from "express"

import createTarget from "../services/targets/createTarget";
import authValidationUser from "../middlewares/authValidationUser";
import editTarget from "../services/targets/editTarget";

const router = Router();

router.post("/create", authValidationUser, async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1] as string;
	const { title, isPrivate } = req.body;

	const target = await createTarget({ token, title, isPrivate });

	res.json(target);
});


router.put("/edit", authValidationUser, async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1] as string;
	const { targetId, title, isPrivate } = req.body;

	const target = await editTarget({ targetId, token, title, isPrivate });

	res.json(target);
});

export default router;