import * as geoIp from "geoip-lite";
import winstonInstance from "../util/logger";

/**
 * A Record<K, T> is an object type whose property keys are K and whose
 * property values are T
 * @param address
 */
function getGeoIp(address: string): Record<string, any> {
    return geoIp.lookup(address);
}

// receive message from master process
process.on("message",  (message) => {
    const geoIp =  getGeoIp(message);

    // send response to master process
    process.send({  geoIp });
    process.disconnect();
});