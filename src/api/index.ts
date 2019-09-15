import { Request, Response } from "express";
import { fork } from "child_process";
import winstonInstance from "../util/logger";
/**
 *
 * @param req - Request
 * @param res - Response
 */
export const getServices = (req: Request, res: Response) => {

    // stand up the worker processes
    winstonInstance.info("Standing Worker Process", { worker: "GeoIp"});
    const geoIpWorker = fork("./src/workers/geo-ip.ts", [], { execArgv:  ["-r", "ts-node/register"] });

    // extract list of services from url or default list
    const servicesArray = req.query.services.split(",");
    const { address } = req.query;

    // for each service send to appropriate worker
    for (const service of servicesArray) {
        if (service.toLowerCase() === "geoip") {
            geoIpWorker.send(address);
        }
    }

    geoIpWorker.on("message", (message => {
        return res.json(message);
    }));
};