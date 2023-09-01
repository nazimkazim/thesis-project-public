"use strict";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getItems, getItem, getItemsByName, storeViewedItem, getItemsByCategory, getRecommendations } from "./map.js";

const app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

/* app.get('/', async (req, res) => {
    await saveYelpBusinessDataIntoDynamoDB();
    res.send('Hello World!');
}); */

app.get("/map/search", getItemsByName);
app.get("/map/:id", getItem);
app.get("/map", getItems);
app.post("/map/searchByCategory", getItemsByCategory);
app.post("/map/recommendations", getRecommendations)
app.post("/queries/viewed-item", storeViewedItem);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
