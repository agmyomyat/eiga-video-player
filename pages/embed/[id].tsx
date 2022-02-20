import { NextRouter, useRouter } from 'next/router'
import React, { useState } from 'react'
import { embedSubQuery2 } from '../../src/api/graphql-req/embedSub2'
import DevDectecter from '../../src/share/devDectecter'
import Player from '../../src/components/player'
import { GetStaticProps } from 'next'
import useCheckPremium from '../../src/custom-hooks/checkPremium'
import FacebookCircularProgress from '../../src/components/circularLoading'
export default function Embed(props: any) {
   // console.log('props is ', props)
   const router: NextRouter = useRouter()
   const [loading, setLoading] = useState(true)
   DevDectecter()
   useCheckPremium({ setLoading })
   if (router.isFallback || loading) return <FacebookCircularProgress />
   return (
      <div>
         <Player
            config={props.plyrConfig}
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
export const getStaticProps: GetStaticProps = async ({ params }) => {
   const res = await embedSubQuery2({ embedLink: params!.id as string })
   console.log('apple', res)
   const plyrConfig = {
      type: 'video',
      title: 'RoseStream',
      sources: [
         {
            src: `${process.env.ENG_EMBED_URL as string}/${
               params!.id as string
            }.mp4`,
            type: 'video/mp4',
            size: 1080,
         },
      ],
      tracks: [
         {
            kind: 'captions',
            label: 'English',
            srclang: 'en',
            src: `${process.env.EMBED_URL}/vtt/${res?.embedVideo2s[0]?.eng_sub}.vtt`,
            // src: `${process.env.EMBED_URL}/vtt/Toy.Story.3.2010.BrRip.x264.720p.YIFY.vtt`,
         },
      ],
   }
   return {
      props: { params, plyrConfig: plyrConfig },
   }
}
