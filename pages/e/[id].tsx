import { NextRouter, useRouter } from 'next/router'
import React, { useState } from 'react'
import FacebookCircularProgress from '../../src/components/circularLoading'
import Player from '../../src/components/player'
import useCheckPremium from '../../src/custom-hooks/checkPremium'
import DevDectecter from '../../src/share/devDectecter'
export default function Embed(props: any) {
   const router: NextRouter = useRouter()
   const [loading, setLoading] = useState(true)
   DevDectecter()
   const plyrConfig = {
      type: 'video',
      title: 'Example title',
      sources: [
         {
            src: `${process.env.EMBED_URL as string}/${
               router.query.id as string
            }.mp4`,
            type: 'video/mp4',
            size: 1080,
         },
      ],
   }
   useCheckPremium({ setLoading })
   if (router.isFallback || loading) return <FacebookCircularProgress />
   return (
      <div>
         <Player
            config={plyrConfig}
            fileSize="none"
            uuid={router.query.id as string}
         />
         {/* <Button onClick={download}>download</Button>
      <Button onClick={cancelDownload}>Cancel</Button> */}
      </div>
   )
}
export async function getStaticPaths() {
   return {
      paths: [],
      fallback: true,
   }
}
export async function getStaticProps({ params }: any) {
   // params contains the post `id`.
   // If the route is like /posts/1, then params.id is 1

   // Pass post data to the page via props
   return {
      props: { params },
      revalidate: 10, // In seconds
   }
}
