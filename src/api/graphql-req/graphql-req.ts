import { gql } from "graphql-request";
import { client } from "./initializeGql";
import { gqlEndpoint } from "./endPoint";

const uploadEmbed = gql`
	mutation createEmbed(
		$movieName: String
		$season: Int
		$episode: Int
		$eigaLink: String
		$uploadStatus: Boolean
	) {
		createEmbedVideo(
			input: {
				data: {
					movieName: $movieName
					season: $season
					episode: $episode
					eigaLink: $eigaLink
					uploadStatus: $uploadStatus
				}
			}
		) {
			embedVideo {
				eigaLink
			}
		}
	}
`;
type EmbedProp = {
	movieName: string;
	season: number;
	episode: number;
	eigaLink: string;
	uploadStatus: boolean;
	header: string;
};
export async function uploadEmbedQuery({ ...prop }: EmbedProp) {
	return client.request(uploadEmbed, prop);
}
