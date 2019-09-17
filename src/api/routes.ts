import express from "express";
const router = express.Router();
import { celebrate, Joi } from "celebrate";

// Controllers (route handlers)
import * as services from "./index";

/**
 * Primary app route.
 */
router.route("/info/:host?/:services?")
    .get(celebrate({
        query: Joi.object({
            host: Joi
                .alternatives()
                .try(
                    Joi.string().ip(), Joi.string().uri() // allow either an IP or URI
                ).required(),
            services: Joi.string().default(["geoip", "ping", "rdap", "reversedns"])
        })
    }), services.getServices);

export default router;