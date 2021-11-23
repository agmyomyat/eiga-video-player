import { gql } from 'graphql-request'
import { client } from './initializeGql'
const embedVideos = gql`
   query searchEmbedVideos($uploader: String, $movieName: String!) {
      embedVideos(
         where: { uploader: $uploader, movieName_contains: $movieName }
      ) {
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
export async function searchEmbedVideosQuery({
   ...prop
}: {
   uploader: string
   movieName: string
}) {
   return client.request(embedVideos, prop)
}
const embedVideos2 = gql`
   query searchEmbedVideos2($uploader: String!, $movie_name: String!) {
      embedVideo2s(
         where: { uploader: $uploader, movie_name_contains: $movie_name }
      ) {
         id
         embedLink
         movie_name
         upload_status
         season
         episode
      }
   }
`
export async function searchEmbedVideos2Query({
   ...prop
}: {
   uploader: string
   movie_name: string
}) {
   return client.request(embedVideos2, prop)
}
