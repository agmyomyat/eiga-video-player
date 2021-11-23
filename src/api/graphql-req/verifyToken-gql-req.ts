import { gql } from "graphql-request";
import { client } from "./initializeGql";
const verifyToken = gql`
   mutation VerifyToken {
      verifyToken {
         verify
         status
         statusCode
         bnet
         user
         bnet2
      }
   }
`
export async function verifyTokenMutation() {
	return client.request(verifyToken);
}
