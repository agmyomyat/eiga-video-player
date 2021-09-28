import { gql } from "graphql-request";
import { client } from "./initializeGql";
const loginEmbed = gql`
	mutation LoginEmbed($userName: String!, $password: String!) {
		loginEmbedUploader(input: { userName: $userName, password: $password }) {
			statusCode
			status
			userName
			jwt
			verify
			bnet
		}
	}
`;

type LoginProp = {
	userName: String;
	password: String;
};
export async function loginEmbedMutation({ ...prop }: LoginProp) {
	return client.request(loginEmbed, prop);
}
