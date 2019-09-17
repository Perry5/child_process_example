import whois from "whois";
// const whoisRdapService = new whoisRdap();

/**
 * Uses the whois-rdap module to retrieve the WHOIS information of the given host
 * A Record<K, T> is an object type whose property keys are K and whose property values are T
 * @param host - string - The IP address or URL to be looked up
 */

// receive message from master process
process.on("message",  (message) => {
    whois.lookup(message, {}, (err: any, data: any) => {
        process.send({  rdap: data });
        // send response to master process
        process.disconnect();
    });
});