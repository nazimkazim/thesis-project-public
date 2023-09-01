//import fs from "fs";
//import readline from "readline";
//import AWS from "aws-sdk";
//import { v4 as uuidv4 } from "uuid";
import {
  DynamoDBClient,
  GetItemCommand,
  // PutItemCommand,
  // QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const clientParams = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const dynamoDb = new DynamoDBClient(clientParams);
// const path = './data/yelp_academic_dataset_business.json';
// const documentClient = new AWS.DynamoDB.DocumentClient();

/* export async function saveYelpBusinessDataIntoDynamoDB() {
    const fileStream = fs.createReadStream(path);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const item = JSON.parse(line);
        const params = {
            TableName: 'places',
            Item: AWS.DynamoDB.Converter.marshall({
                "pl": item.business_id,
                "business_name": item.name,
                "business_address": item.address,
                "city": item.city,
                "state": item.state,
                "postal_code": item.postal_code,
                "latitude": item.latitude,
                "longitude": item.longitude,
                "stars": item.stars,
                "review_count": item.review_count,
                "is_open": item.is_open,
                "attributes": item.attributes || "N/A",
                "categories": item.categories,
                "hours": item.hours || "N/A",
                "plsrt": "N/A"
            })
        };

        try {
            await dynamoDb.send(new PutItemCommand(params));
            console.log(`Successfully inserted item with id ${item.business_id}`);
        } catch (error) {
            console.error(`Error inserting item with id ${item.business_id}:`, error);
        }
    }
} */

export async function getItems(req, res) {
  console.log("Get items", new Date().toISOString());
  const pages = req.query.pages;
  const params = {
    TableName: "places",
    Limit: pages ? parseInt(pages) : 10,
  };

  try {
    const data = await dynamoDb.send(new ScanCommand(params));
    const items = data.Items.map((item) => unmarshall(item));
    res.json(items);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send(err);
  }
}

export async function getItem(req, res) {
  const params = {
    TableName: "places",
    Key: marshall({
      pl: req.params.id,
      plsrt: "N/A", // This value might vary depending on your data
    }),
  };

  try {
    const data = await dynamoDb.send(new GetItemCommand(params));
    const item = unmarshall(data.Item);
    res.json(item);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send(err);
  }
}

export async function getItemsByName(req, res) {
  const { name, limit, startKey } = req.query;
  const params = {
    TableName: "places",
    FilterExpression: "business_name = :name",
    ExpressionAttributeValues: {
      ":name": { S: name },
    },
    Limit: limit ? parseInt(limit) : undefined,
    ExclusiveStartKey:
      startKey && startKey !== "undefined" && startKey !== ""
        ? JSON.parse(startKey)
        : undefined,
  };

  try {
    const data = await dynamoDb.send(new ScanCommand(params));
    const items = data.Items.map((item) => unmarshall(item));
    const response = {
      items,
      lastEvaluatedKey: data.LastEvaluatedKey,
    };
    res.json(response);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send(err);
  }
}

export async function storeViewedItem(req, res) {
  const { categories, createdDate, location, rating } = req.body;

  /* const params = {
    TableName: "queries",
    Item: AWS.DynamoDB.Converter.marshall({
      qkey: uuidv4(),
      categories,
      createdDate,
      location,
      rating,
    }),
  }; */

  try {
    // await dynamoDb.send(new PutItemCommand(params));
    // Sends a success status back to the client
    res.sendStatus(200);
  } catch (error) {
    console.error(`Error inserting item with id ${location}:`, error);
    // Sends an error status and message back to the client
    res.status(500).send("Error inserting item into DynamoDB");
  }
}

export async function getItemsByCategory(req, res) {
  const { category } = req.body;

  const params = {
    TableName: "places",
  };

  try {
    const { Items } = await dynamoDb.send(new ScanCommand(params));
    const filteredItems = Items.filter((item) => {
      return item.categories.S.toLowerCase().includes(category.toLowerCase());
    });
    res.json(filteredItems);
  } catch (error) {
    console.error(`Error retrieving items by category: ${category}`, error);
    res.status(500).send("Error retrieving items");
  }
}

export async function getRecommendations(req, res) {
  const ec2Url = process.env.AWS_LOAD_BALANCER;
  const localUrl = process.env.LOCAL_URL;
  try {
    const { title } = req.body;

    const response = await axios.post(ec2Url, {
      title,
    });

    res.json(response.data);

    /* let businessIds = response.data.map((item) => item.business_id);
    businessIds = businessIds.filter((id) => id);

    // Get full objects from DynamoDB
    const places = await Promise.all(
      businessIds.map(async (id) => {
        const params = {
          TableName: "places",
          KeyConditionExpression: "pl = :pl",
          ExpressionAttributeValues: {
            ":pl": { S: id },
          },
        };

        const command = new QueryCommand(params);

        const data = await dynamoDb.send(command);

        // Unmarshall the items
        const unmarshalledItems = data.Items.map((item) => unmarshall(item));

        return unmarshalledItems;
      })
    );

    res.json(places.flat()); */
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.toString() });
  }
}
