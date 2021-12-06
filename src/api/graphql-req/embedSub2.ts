import { gql } from 'graphql-request'
import { client } from './initializeGql'
const embedSub = gql`
   query EmbedVideo2s($embedLink: String!) {
      embedVideo2s(where: { embedLink: $embedLink }) {
         eng_sub
         video_size
         mm_sub
      }
   }
`
type Prop = {
   embedLink: string
}
export async function embedSubQuery2({ ...prop }: Prop) {
   return client.request(embedSub, prop)
}
