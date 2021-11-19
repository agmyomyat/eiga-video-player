import { gql } from 'graphql-request'
import { client } from './initializeGql'
const embedVideos = gql`
query getEmbedVideos{
  embedVideos{
    movieName
    season
    episode
    uploadStatus
    uploader
  }
}
}
`
export async function getEmbedQuery() {
   return client.request(embedVideos)
}
