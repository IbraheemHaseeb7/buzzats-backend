/**
 *
 * @interface QueryResponse
 *
 * This interface verifies that a firm response is sent to the
 * client side everytime
 * */

export interface QueryResponse {
  status: number;
  data: any;
  description?: string | Error;
}
