import { Router } from "express"
import signUp from "../services/sign/signUp";
import signIn from "../services/sign/signIn";

const router = Router();

router.post("/signup", async (req, res, next) => {
	const { email, username, password, confirmPassword } = req.body;

	try {
		const token = await signUp({ email, username, password, confirmPassword });
	
		res.setHeader('Authorization', `Bearer ${token}`);
		res.json(token);
	} catch(err) {
		next(err);
	}
});

router.post("/signin", async (req, res) => {
	const { email, password } = req.body;

	const token = await signIn({ email, password });

	res.setHeader('Authorization', `Bearer ${token}`);
	res.json(token);
});

export default router;