import express from "express";
import compression from "compression";  // compresses requests=
import bodyParser from "body-parser";
import expressWinston from "express-winston";
import swaggerUiExpress from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import rateLimit from "express-rate-limit";
import winstonInstance from "./util/logger";
import config from "./config/index";
import routes from "./api/routes";



// Create Express server
const app = express();

// Express configuration
app.set("port", config.port || 4040);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This allows a max number of 60 requests within 15 minutes.
const limiter = new rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60
});

app.use(limiter);

if (config.env === "development") {
    expressWinston.requestWhitelist.push("body");
    expressWinston.responseWhitelist.push("body");

    const loggerOptions = {
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    };
    app.use(expressWinston.logger(loggerOptions));
}

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

app.use(routes);

export default app;
