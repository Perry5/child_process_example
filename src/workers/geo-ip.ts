import * as geoIp from "geoip-lite";

/**
 * Uses the geoip-lite module to retrieve the GEO IP of a host and returns an Object (Record)
 * A Record<K, T> is an object type whose property keys are K and whose property values are T
 * @param host - string - The IP address or URL to be looked up
 */
function getGeoIp(host: string): Record<string, any> {
    return geoIp.lookup(host);
}

// receive message from master process
process.on("message",  (message) => {
    const geoIp =  getGeoIp(message);

    // send response to master process
    process.send({  geoIp });
    process.disconnect();
});