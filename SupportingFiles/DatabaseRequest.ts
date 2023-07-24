import { ColumnValue, Connection, Request } from "tedious";
import { QueryResponse } from "../interfaces/QueryResponse";

/**
 *
 * @param {string} path The query string for the database
 * @param {Connection} connection connection variable that stores connection info
 * @param {Function} callback used to return the database results
 * @returns {QueryResponse}
 *
 * This function is used to make query into the database and
 * takes in the parameter path which is basically the query
 * string for the database and return QueryResponse type
 * */
export async function makeRequest(
  path: string,
  connection: Connection,
  callback: Function
) {
  // stores the result that is returned via callback function
  const result: ColumnValue[] = [];
  const request: Request = new Request(
    path,
    (error: Error, rowCount: number, rows: any[]) => {
      // error handled
      if (error) {
        callback({
          status: 500,
          data: [],
          description: error,
        } as QueryResponse);
      }

      connection.close();
    }
  );

  // error response
  request.on("error", (error: Error) => {
    callback({ status: 500, data: [], description: error } as QueryResponse);
    return;
  });

  // successful response
  request.on("row", (columns: ColumnValue[]) => {
    let temp: any;

    columns.forEach((column: ColumnValue) => {
      temp[column.metadata.colName] = column.value;
    });

    result.push(temp);
  });

  // returning on completed request
  request.on("requestCompleted", () => {
    callback({
      status: 200,
      data: result,
      description: "Your request was successfully proceeded",
    } as QueryResponse);
    return;
  });

  connection.execSql(request);
}
