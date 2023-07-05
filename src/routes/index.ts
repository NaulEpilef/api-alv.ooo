import { Router } from "express";

const routes = Router();

routes.post("/admin", (req, res) => {
    res.json({ message: "VRABAPAPTPA" });
});

export default routes;