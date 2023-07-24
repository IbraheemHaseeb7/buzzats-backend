import express, {
  Router,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import cors from "cors";
import { Connection } from "tedious";
import { config } from "../SupportingFiles/Connection";
import { makeRequest } from "../SupportingFiles/DatabaseRequest";
import { QueryResponse } from "../interfaces/QueryResponse";
import serverless from "serverless-http";

/**
 * Initalizing the express app so we can
 * create server
 * Also initializing the port for the server
 *
 * NOTE: The server is only initialized during the testing
 *       Since we are deploying on the netlify, we don't need
 *       the port number or server as it is serverless.
 * */
const app = express();
const router: Router = express.Router();
const PORT: number = 3000;

/**
 * Adding all the external features into
 * the express server to allow use of things
 * like environment variables
 *
 * */
app.use(express.json());
app.use(cors());
app.use("/.netlify/functions/api", router);

/**
 * This is the post request that is supposed to handle
 * all the queries that are made from the clients side
 * whose response is then sent back to the user in
 * JSON format
 *
 * @param {string} path
 * @param {Function} annonymous
 * */
router.post("/query", (req: ExpressRequest, res: ExpressResponse) => {
  const body: { query: string } = req.body;
  const connection: Connection = new Connection(config);

  connection.connect((error: Error | undefined) => {
    if (error) {
      // sends server error response
      res.status(500).send({
        data: [],
        status: 500,
        description: "Connection could not be established to the server",
      } as QueryResponse);
    } else {
      // successfully request being proceeded
      makeRequest(body.query, connection, (resp: QueryResponse) => {
        res.status(resp.status).send(resp);
      });
    }
  });
});

/**
 *
 * Listens to server at @const PORT
 * only during the server testing
 * during development
 * */
// app.listen(PORT, () => {
//   console.log(`SERVER STARTED AT ${PORT}`);
// });

module.exports.handler = serverless(app);
