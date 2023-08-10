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
import { sendEmail } from "../SupportingFiles/Sendgrid";

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
// router.post("/query", (req: ExpressRequest, res: ExpressResponse) => {
//   const body: { query: string } = req.body;
//   const connection: Connection = new Connection(config);

//   connection.connect(async (error: Error | undefined) => {
//     if (error) {
//       // sends server error response
//       res.status(500).send({
//         status: 500,
//         description: "Connection could not be established to the server",
//       } as QueryResponse);
//     } else {
//       // successfully request being proceeded
//       await makeRequest(body.query, connection, (resp: QueryResponse) => {
//         res.status(resp.status).send(resp);
//       });
//     }
//   });
// });

/**
 *
 * This mail route is used to send OTP code to the users on their email
 * addresses that they enter while signing up on the buzzats application.
 * This can then be used to verify if the user is from comsats or not.
 * */
router.post("/mail", async (req: ExpressRequest, res: ExpressResponse) => {
  const body: { email: string; code: string } = req.body;

  // promise is used to verify what response to send to the client
  await sendEmail(body.email, body.code)
    .then((result: any) => {
      return res.status(200).send({ description: "Email sent Successfully" });
    })
    .catch((error: Error) => {
      return res.status(500).send({ description: "Email could not be sent" });
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
