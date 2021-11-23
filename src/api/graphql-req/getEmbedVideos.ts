import { gql } from 'graphql-request'
import { client } from './initializeGql'
const embedVideos = gql`
   query getEmbedVideos($uploader: String) {
      embedVideos(sort: "updated_at:desc", where: { uploader: $uploader }) {
         id
         movieName
         eigaLink
         season
         episode
         uploadStatus
         uploader
      }
   }
`
export async function getEmbedVideosQuery({ ...prop }: { uploader: string }) {
   return client.request(embedVideos, prop)
}
const embedVideos2 = gql`
   query EmbedVideos2($uploader: String!) {
      embedVideo2s(sort: "updated_at:desc", where: { uploader: $uploader }) {
         id
         embedLink
         movie_name
         upload_status
         season
         episode
      }
   }
`
export async function getEmbedVideos2Query({ ...prop }: { uploader: string }) {
   return client.request(embedVideos2, prop)
}