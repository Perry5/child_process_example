import express from "express";
const router = express.Router();
import { celebrate, Joi } from "celebrate";

// Controllers (route handlers)
import * as services from "./index";

/**
 * Primary app route.
 * localhost:4040/info/?address=173.67.10.172&services=geo_ip
 */
router.route("/info/:address?/:services?")
    .get(celebrate({
        query: Joi.object({
            address: Joi
                .alternatives()
                .try(
                    Joi.string().ip(), Joi.string().uri() // allow either an IP or URI
                ).required(),
            services: Joi.string().default(["geoip", "ping", "rdap", "reversedns"])
        })
    }), services.getServices);

export default router;