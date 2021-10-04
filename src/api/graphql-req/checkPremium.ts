import { gql } from "graphql-request";
import { client } from "./initializeGql";
const checkPremium= gql`
query checkPremium{
  getUserData{
    premium
  }
}
`;
const requestHeaders = {
  authorization: 'Bearer '
}
export async function checkPremiumQuery(token:string) {
	return client.request(checkPremium,{},{auth:`Bearer ${token}`});
}