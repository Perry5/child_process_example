import { Request, Response } from "express";
import bbPromise from "bluebird";
import { Joi } from "celebrate";
import dns from "dns";
import { initiateWorker } from "../util/worker-util";

/**
 * The getServices (HTTP) end-point receives a an address and a list of end-points via a GET request.
 * It then queue's up a number of child processes (serving as workers) using different arguments.
 * Then using bluebird's map function, we return each worker/process and then execute a function when
 * they have all resolved.
 *
 * @param req - Request - Incoming HTTP request
 * @param res - Response - HTTP response
 */
export const getServices = (req: Request, res: Response) => {
    // extract list of services from url or default list
    let servicesArray: string[]  = Array.isArray(req.query.services)? req.query.services: req.query.services.split(",");

    // const servicesArray = req.query.services.split(",");
    const { host } = req.query;

    // Do a DNS lookup for all hosts passed in that way we are checking only on the IP address
    dns.lookup(host, {}, (err, address, family) => {
        const workerResults = servicesArray.map((service: string) => {
            if (service.toLowerCase() === "geoip") {
                return initiateWorker("geo-ip.ts", address);
            } else if (service.toLowerCase() === "ping") {
                return initiateWorker( "ping.ts", address);
            } else if (service.toLowerCase() === "rdap") {
                return initiateWorker("rdap.ts", address);
            }
        });

        return bbPromise.map(workerResults, (result) => { return result; })
            .then((response) => {
                return res.json(response);
            });

    });
};