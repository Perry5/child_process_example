import logger from "../util/logger";
import dotenv from "dotenv";
import { Joi } from "celebrate";
import fs from "fs";

// Load your environment variables from the .env file
if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" }); // load vars in .env in PROCESS.ENV
} else {
    logger.debug("Make sure you have a .env file");
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(["development", "production", "test", "provision"])
        .default("development"),
    PORT: Joi.number()
        .default(4040),
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
};

export default config;