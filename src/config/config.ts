import logger from "../util/logger";
import dotenv from "dotenv";
import Joi from "joi";
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
    MONGOOSE_DEBUG: Joi.boolean()
        .when("NODE_ENV", {
            is: Joi.string().equal("development"),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
        }),
    MONGODB_URI_LOCAL: Joi.string().required()
        .description("Mongo DB host url"),
    MONGO_PORT: Joi.number()
        .default(27017),
    SESSION_SECRET: Joi.string().required()
        .description("Session Secret")
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    mongoUri: envVars.MONGODB_URI,
    mongoLocal: {
        host: envVars.MONGODB_URI_LOCAL,
        port: envVars.MONGO_PORT
    },
    sessionSecret: envVars.SESSION_SECRET,
    facebookId: envVars.FACEBOOK_ID,
    facebookSecret: envVars.FACEBOOK_SECRET,
    auth0ClientId: envVars.AUTH0_CLIENT_ID,
    auth0Domain: envVars.AUTH0_DOMAIN,
    auth0ClientSecret: envVars.AUTH0_CLIENT_SECRET,
};

export default config;