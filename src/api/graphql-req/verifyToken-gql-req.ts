import { gql } from "graphql-request";
import { getAccessToken } from '../../share/token'
import { client } from './initializeGql'
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
   const reqHeader = {
      auth: getAccessToken(),
   }
   return client.request(verifyToken, {}, reqHeader)
}
