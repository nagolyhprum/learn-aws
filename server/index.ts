import express from "express";
import path from "path";
const app = express();
app.use((req, res) => res.sendFile("index.html", {
  root : path.resolve(__dirname, "../clientBuild/")
}));
app.listen(8080, () => console.log("listening"));