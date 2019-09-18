import express from "express";
const router = express.Router();
import { celebrate, Joi } from "celebrate";

// Controllers (route handlers)
import * as services from "./index";

/**
 * Primary app route.
 * Verification done by Joi and Celebrate. Enforces that the host is an IP or a relative URI
 */
router.route("/info/:host?/:services?")
    .get(celebrate({
        query: Joi.object({
            services: Joi.string().default(["geoip", "ping", "rdap", "reversedns"]),
            host: Joi
                .alternatives()
                .try(
                    Joi.string().uri({ allowRelative: true, relativeOnly: true }),
                    Joi.string().ip()// allow either an IP or URI
                ).required()
        })
    }), services.getServices);

export default router;