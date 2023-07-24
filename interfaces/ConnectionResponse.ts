/**
 *
 * @interface ConnectionResponse
 *
 * The connection response verifies that we only send the
 * desired format response to the client side
 * */

export interface ConnectionResponse {
  response: string;
  description: any;
}
