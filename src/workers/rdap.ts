import whois from "whois";

/**
 * Uses the whois-rdap module to retrieve the WHOIS information of the given host
 */

// receive message from master process
process.on("message",  (message) => {
    whois.lookup(message, { "verbose": false }, (err: any, data: any) => {
        process.send({  rdap: data });
        // send response to master process
        process.disconnect();
    });
});