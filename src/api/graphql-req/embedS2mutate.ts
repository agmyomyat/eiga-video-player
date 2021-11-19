import { gql } from 'graphql-request'
import { client } from './initializeGql'
import { gqlEndpoint } from './endPoint'

const uploadEmbed = gql`
   mutation createEmbed2(
      $movie_name: String
      $season: Int
      $episode: Int
      $eigaLink: String
      $uploadStatus: Boolean
   ) {
      createEmbedVideo2(
         input: {
            data: {
               movie_name: $movie_name
               season: $season
               episode: $episode
               embedLink: $eigaLink
               upload_status: $uploadStatus
            }
         }
      ) {
         embedVideo2 {
            id
         }
      }
   }
`
const updateEmbed = gql`
   mutation UpdateEmbed2(
      $id: ID!
      $movie_name: String
      $season: Int
      $episode: Int
      $embedLink: String
      $uploadStatus: Boolean
      $original_link: String
      $video_size: String
   ) {
      updateEmbedVideo2(
         input: {
            where: { id: $id }
            data: {
               movie_name: $movie_name
               season: $season
               episode: $episode
               embedLink: $embedLink
               upload_status: $uploadStatus
               original_link: $original_link
               video_size: $video_size
            }
         }
      ) {
         embedVideo2 {
            id
         }
      }
   }
`
type EmbedProp = {
   movie_name?: string
   season?: number
   episode?: number
   embedLink?: string
   upload_status: boolean
   uploader: string
}
type UpdateEmbedProp = {
   video_size?: string
   id: Required<number>
   movie_name?: string
   season?: number
   episode?: number
   embedLink?: string
   upload_status: boolean
   original_link: string | undefined
}
export async function uploadEmbedS2Mutation({ ...prop }: EmbedProp) {
   return client.request(uploadEmbed, prop)
}
export async function updateEmbedS2Mutation({ ...prop }: UpdateEmbedProp) {
   return client.request(updateEmbed, prop)
}
