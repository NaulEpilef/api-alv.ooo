import { Router } from "express"

import createTarget from "../services/targets/createTarget";
import authValidationUser from "../middlewares/authValidationUser";
import editTarget from "../services/targets/editTarget";
import listAllTargets from "../services/targets/listAllTargets";
import listUserTargets from "../services/targets/listUserTargets";
import authIsUserLogged from "../middlewares/authIsUserLogged";

const router = Router();

router.get("/listAll", async (req, res) => {
	const listTargets = await listAllTargets();

	res.json(listTargets);
});

router.get("/:username", authIsUserLogged, async (req, res) => {
	const { username } = req.params;
	const { isLogged, currentUser } = req.body;

	const userTargets = await listUserTargets({ currentUser, username, isLogged });

	res.json(userTargets);
});

router.post("/create", authValidationUser, async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1] as string;
	const { title, isPrivate } = req.body;

	try {
		const target = await createTarget({ token, title, isPrivate });
	
		res.json(target);
	} catch (err) {
		next(err);
	}
});


router.put("/edit", authValidationUser, async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1] as string;
	const { targetId, title, isPrivate } = req.body;

	try {
		const target = await editTarget({ targetId, token, title, isPrivate });
	
		res.json(target);
	} catch (err) {
		next(err);
	}
});

export default router;