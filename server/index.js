require('dotenv').config()
import init from "./init";
import express from "express";
const app = express();
init(app);
app.listen(80, () => console.log("listening on port 80"));
export default () => true;
