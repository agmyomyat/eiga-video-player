import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../../share/token";

export const client = new GraphQLClient("http://localhost:1337/graphql", {
	headers: {
		auth: getAccessToken(),
	},
});
