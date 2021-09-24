import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../../share/token";

export const client = new GraphQLClient(`${process.env.API_URL}/graphql`, {
	headers: {
		auth: getAccessToken(),
	},
});
