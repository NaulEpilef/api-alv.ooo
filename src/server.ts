import express from "express";

import routes from "./routes";

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Listening on port, localhost:${port}`);
});