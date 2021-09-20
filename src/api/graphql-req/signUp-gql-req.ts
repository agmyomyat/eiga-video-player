import { gql } from "graphql-request";
import { client } from "./initializeGql";
const registerEmbed = gql`
	mutation RegisterEmbed($userName: String!, $password: String!) {
		embedRegister(input: { userName: $userName, password: $password }) {
			status
			success
			alreadyCreated
		}
	}
`;
type RegisterProp = {
	userName: string;
	password: string;
};
export async function registerEmbedMutation({ ...prop }: RegisterProp) {
	return client.request(registerEmbed, prop);
}
