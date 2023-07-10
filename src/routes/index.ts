import express from "express";
import signRoutes from "./sign.routes";
import targetsRoutes from "./targets.routes";

const app = express();

app.use("/", signRoutes);
app.use("/target", targetsRoutes);

export default app;