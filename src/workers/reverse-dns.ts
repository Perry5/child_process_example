function getReverseDns(address: string): string {
    return address;
}

// receive message from master process
process.on("message",  (message) => {
    const reverseDns =  getReverseDns(message);

    // send response to master process
    process.send(reverseDns);
    process.disconnect();
});