import { gql } from 'graphql-request'
import { client } from './initializeGql'
import { gqlEndpoint } from './endPoint'
const deleteEmbed1 = gql`
   mutation DeleteEmbedVideo($id: ID!) {
      deleteEmbedVideo(input: { where: { id: $id } }) {
         embedVideo {
            id
         }
      }
   }
`
export async function deleteEmbed1Mutate({ ...prop }: { id: string | number }) {
   return client.request(deleteEmbed1, prop)
}
const deleteEmbed2 = gql`
   mutation DeleteEmbedVideo2($id: ID!) {
      deleteEmbedVideo2(input: { where: { id: $id } }) {
         embedVideo2 {
            id
         }
      }
   }
`
export async function deleteEmbed2Mutate({ ...prop }: { id: string | number }) {
   return client.request(deleteEmbed2, prop)
}
