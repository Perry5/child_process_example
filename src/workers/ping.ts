import ping from "ping";

function getPing(host: string) {
    return ping.promise.probe(host);
}

// receive message from master process
process.on("message",  (message) => {
    getPing(message)
        .then((response) => {
            const isAlive = response.alive ? `Host ${ response.host } is alive` : `Host ${ response.host } is dead`;

            // send response to master process
            process.send({ ping: isAlive });
            process.disconnect();
        });
});