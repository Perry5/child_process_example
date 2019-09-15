import { Request, Response } from "express";
import { fork } from "child_process";
import logger from "../util/logger";
import bbPromise from "bluebird";
const BASE_PATH = "./src/workers/";

function loadProcess(process: string, address: string) {
    console.log();
    console.log(`ABOUT TO LOAD PROCESS FOR: ${process} WITH ADDRESS: ${address}`);
    console.log();
    let path = `${BASE_PATH}${process}`;
    console.log(`PATH TO PROCESS IS: ${path} `);
    console.log();
    console.log("RETURNING PROMISE FOR PROCESS");
    return new bbPromise((resolve, reject) => {
        const worker = fork(path, [], { execArgv:  ["-r", "ts-node/register"] });
        worker.send(address);
        worker.on("message", (message => {
            resolve(message);
        }));
    });

}

/**
 * Thanks to fork, computation intensive tasks can be separated from the main event loop.
 *
 * In the example below, the server won't be blocked by the computation intensive task triggered by /compute route.
 * The task will be handled by another Node process. Once it finished, the result will be send back to the server so that it can be then returned over HTTP as a response.
 *
 * @param req - Request
 * @param res - Response
 */
export const getServices = (req: Request, res: Response) => {
    // extract list of services from url or default list
    const servicesArray = req.query.services.split(",");
    const { address } = req.query;
    interface InfoType {
        geoIp?: {};
        ping?: {};
        rdap?: {};
        reverseDNS?: {};
        [key: string]: any;
    }
    let services: InfoType = {};

    console.log();
    console.log("LOOPING OVER SERVICES TO BUILD NEW LIST");
    console.log();
    const commands = servicesArray.map((service: string) => {
        console.log();
        console.log(`GOT IN FIRST MAP: ${service}`);
        console.log();
        if (service.toLowerCase() === "geoip") {
            console.log();
            console.log(`FOUND SERVICE: ${service}`);
            console.log();
            return loadProcess("geo-ip.ts", address);
        } else if (service.toLowerCase() === "ping") {
            console.log();
            console.log(`FOUND SERVICE: ${service}`);
            console.log();
            return loadProcess( "ping.ts", address);
        }
    });

    console.log();
    console.log(`CREATING MAP FROM COMMANDS ${commands.length}`);
    console.log();
    return bbPromise.map(commands, (command) => {
        console.log();
        console.log(`RETURNING COMMAND: ${command}`);
        console.log();
        return command;
    })
        .then((response) => {
            console.log();
            console.log(`FINAL RESPONSE IS: ${response[0]}`);
            console.log(`FINAL RESPONSE IS: ${response[1]}`);
            console.log();
        });

    // for each service send to appropriate worker
    // for (const service of servicesArray) {
    //     if (service.toLowerCase() === "geoip") {
    //
    //         return loadProcess.bind(null, service, address);
    //
    //         // // stand up the worker processes
    //         // logger.info("Standing Worker Process", { worker: "GeoIp"});
    //         // const geoIpWorker = fork("./src/workers/geo-ip.ts", [], { execArgv:  ["-r", "ts-node/register"] });
    //         // logger.info(`Sending to ${service} worker`);
    //         // geoIpWorker.send(address);
    //         // geoIpWorker.on("message", (message => {
    //         //     services.GeoIp = message;
    //         // }));
    //     } else if (service.toLowerCase() === "ping") {
    //         // logger.info("Standing Worker Process", { worker: "Ping"});
    //         // const pingWorker = fork("./src/workers/ping.ts", [], { execArgv:  ["-r", "ts-node/register"] });
    //         // logger.info(`Sending to ${service} worker`);
    //         // pingWorker.send(address);
    //         // pingWorker.on("message", (message => {
    //         //     services.ping = message;
    //         // }));
    //     }
    // }

    // return res.json(services);
};