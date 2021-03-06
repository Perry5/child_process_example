import winston from "winston";

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "my-lane-task"},
    transports: [
        new winston.transports.File({ filename: "debug.log", level: "debug" })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    }));
}

export default logger;