import cors from "cors"
import express from "express";

import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening on port, localhost:${port}`);
});