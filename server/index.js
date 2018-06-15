require('dotenv').config()
import init from "./init";
import express from "express";
init(express()).listen(80, () => console.log("listening on port 80"));
