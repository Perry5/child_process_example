import winstonInstance from "../util/logger";

function getPing(address: string): string {
    winstonInstance.info(`Looking up Ping for ${address}`);
    return `Got Ping: ${address}`;
}

// receive message from master process
process.on("message",  (message) => {

    const ping =  getPing(message);

    // send response to master process
    winstonInstance.info("Sending Ping back to API");
    process.send(ping);
    process.disconnect();
});