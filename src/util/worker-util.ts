import { fork } from "child_process";
import logger from "../util/logger";
import bbPromise from "bluebird";
const BASE_PATH = "./src/workers/"; // base path to workers

/**
 * Utility function which takes in the name of a particular process and address (IP or Domain) and using the
 * child_process fork() method it starts up a new process to compute the task. The server won't be blocked by this
 * computation because this is another Node process. Once it is finished the result is sent back to the server
 * so it can be returned over HTTP as a response.
 *
 * @param process - string - The name of the process / worker to start up.
 * @param address - string - The IP address or Domain to execute on
 */
export const initiateWorker = (process: string, address: string) => {

    logger.info("Initiating new worker", { worker: process });

    let path = `${BASE_PATH}${process}`;
    return new bbPromise((resolve, reject) => {
        const worker = fork(path, [], { execArgv:  ["-r", "ts-node/register"] });
        worker.send(address);
        logger.info("Returning worker response to API", { worker: process });
        worker.on("message", (message => {
            resolve(message);
        }));
    });
};