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
				id
			}
		}
	}
`;
const updateEmbed = gql`
	mutation UpdateEmbed(
		$id: ID!
		$movieName: String
		$season: Int
		$episode: Int
		$eigaLink: String
		$uploadStatus: Boolean
		$originalLink: String
	) {
		updateEmbedVideo(
			input: {
				where: { id: $id }
				data: {
					movieName: $movieName
					season: $season
					episode: $episode
					eigaLink: $eigaLink
					uploadStatus: $uploadStatus
					originalLink: $originalLink
				}
			}
		) {
			embedVideo {
				id
			}
		}
	}
`;
type EmbedProp = {
	movieName?: string;
	season?: number;
	episode?: number;
	eigaLink?: string;
	uploadStatus: boolean;
};
type UpdateEmbedProp = {
	id: Required<number>;
	movieName?: string;
	season?: number;
	episode?: number;
	eigaLink?: string;
	uploadStatus: boolean;
	originalLink: string | undefined;
};
export async function uploadEmbedMutation({ ...prop }: EmbedProp) {
	return client.request(uploadEmbed, prop);
}
export async function updateEmbedMutation({ ...prop }: UpdateEmbedProp) {
	return client.request(updateEmbed, prop);
}
