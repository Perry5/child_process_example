import express from "express";
import compression from "compression";  // compresses requests=
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import expressWinston from "express-winston";
import winstonInstance from "./util/logger";
import config from "./config/config";

// Controllers (route handlers)
import * as homeController from "./controllers/home";

// Create Express server
const app = express();

// Express configuration
app.set("port", config.port || 4040);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });


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

/**
 * Primary app routes.
 */
app.post("/services", homeController.index);

export default app;
