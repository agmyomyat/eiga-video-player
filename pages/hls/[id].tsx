import { NextRouter, useRouter } from 'next/router'
import React, { useState } from 'react'
import DevDectecter from '../../src/share/devDectecter'
import Player from '../../src/components/player'
import { GetStaticProps } from 'next'
import useCheckPremium from '../../src/custom-hooks/checkPremium'
import FacebookCircularProgress from '../../src/components/circularLoading'
export default function Hls(props: any) {
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
   const plyrConfig = {
      type: 'video',
      title: 'RoseStream',
      sources: [
         {
            src: `${process.env.HLS_URL as string}/${
               params!.id as string
            }/playlist.m3u8`,
         },
      ],
      tracks: [
         {
            kind: 'captions',
            label: 'English',
            srclang: 'en',
            src: `${process.env.HLS_URL}/${params!.id}/captions/EN.vtt`,
            // src: `${process.env.EMBED_URL}/vtt/Toy.Story.3.2010.BrRip.x264.720p.YIFY.vtt`,
         },
      ],
   }
   return {
      props: { params, plyrConfig },
      revalidate: 5,
   }
}
