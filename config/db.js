import mongoose from "mongoose";
import config from "./config.js";

mongoose.connect(config.dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));