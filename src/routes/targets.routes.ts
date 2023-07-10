import { Router } from "express"

import createTargets from "../services/targets/createTarget";
import authValidationUser from "../middlewares/authValidationUser";

const router = Router();

router.post("/create", authValidationUser, async (req, res) => {
	const { title, isPrivate } = req.body;

	// const createdTarget = await createTargets({ title, isPrivate });

	res.json({ message: "final" });
});

export default router;