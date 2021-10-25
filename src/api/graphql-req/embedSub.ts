
import { gql } from "graphql-request";
import { client } from "./initializeGql";
const embedSub = gql`
query EmbedVideos($eigaLink:String!){
  embedVideos(where:{eigaLink:$eigaLink}){
    eng_sub
    fileSize
  }
}
`
type Prop = {
	eigaLink:string
}
export async function embedSubQuery({ ...prop }: Prop) {
	return client.request(embedSub, prop);
}