// const { Router } = require("express");
// const PropertyModel = require("../models/PropertyModel.js");
import { Router } from "express";
import PropertyModel from "../models/PropertyModel.js";
import { ObjectId } from "mongodb";

const propertyRouter = Router();

propertyRouter.get("/", async (req, res) => {
  try {
    const query = req.query;
    const filter = {};
    if (query.agent_ref) {
      filter.AGENT_REF = new RegExp(query.agent_ref, "i");
    }
    if (query.badrooms !== "0") {
      filter.BEDROOMS = query.badrooms;
    }
    if (query.max_price || query.min_price) {
      filter.$expr = {
        $and: [
          { $gte: [{ $toDouble: "$PRICE" }, Number(query.min_price)] },
          {
            $lte: [
              { $toDouble: "$PRICE" },
              query.max_price === "0" ? 2000 : Number(query.max_price),
            ],
          },
        ],
      };
    }
    if (query.prop_sub_id !== "") {
      filter.PROP_SUB_ID = query.prop_sub_id;
    }
    if (query.location !== "") {
      filter.$or = [
        { ADDRESS_2: new RegExp(query.location, "i") },
        { ADDRESS_3: new RegExp(query.location, "i") },
      ];
    }
    const properties = await PropertyModel.find(filter).limit(5);
    res.send(properties);
  } catch (error) {
    res.status(403).json({ message: "Something went wrong" });
  }
});

propertyRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const properties = await PropertyModel.findById(new ObjectId(id));
    return res.send(properties);
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Something went wrong" });
  }
});

// module.exports = propertyRouter;
export default propertyRouter;
