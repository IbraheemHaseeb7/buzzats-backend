import { ConnectionConfig } from "tedious";
import dotenv from "dotenv";
/**
 *
 * We export the configuration object so we can use it back
 * in the api.ts file where it is actually used to maintain
 * the connections with the database
 * */

dotenv.config();
export const config: ConnectionConfig = {
  server: process.env.SERVER,
  authentication: {
    type: "default",
    options: {
      userName: process.env.NAME,
      password: process.env.PASSWORD,
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: process.env.DATABASE,
  },
};
