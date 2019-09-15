import winstonInstance from "../util/logger";

function getPing(address: string): string {
    return `Got Ping: ${address}`;
}

// receive message from master process
process.on("message",  (message) => {

    const ping =  getPing(message);

    // send response to master process
    process.send({ ping });
    process.disconnect();
});