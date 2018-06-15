import path from "path";
import express from "express";
import api from "./api";
export default app => {
  api(app);
  app.use(express.static(path.resolve(__dirname, "../clientBuild")));
  return app;
};