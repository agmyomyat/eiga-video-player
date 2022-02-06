import {
   CircularProgressProps,
   circularProgressClasses,
   CircularProgress,
   Box,
} from '@mui/material'
import { NextRouter, useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import { checkPremiumQuery } from '../../src/api/graphql-req/checkPremium'
import { embedSubQuery2 } from '../../src/api/graphql-req/embedSub2'
import DevDectecter from '../../src/share/devDectecter'
import Player from '../../src/components/player'
export default function Embed(props: any) {
   console.log('props is ', props)
   const router: NextRouter = useRouter()
   const [loading, setLoading] = useState(true)
   DevDectecter()
   useEffect(() => {
      if (!router.isReady || router.isFallback) return
      console.log('router readey', router.isReady)
      if (router.isReady && !router.query.token) {
         router.replace('/404')
         // setLoading(false)
      }
      checkPremiumQuery(router.query.token as string)
         .then((res) => {
            console.log('result', res)
            if (res.getUserData.premium) {
               return setLoading(false)
            } else {
               // setLoading(false)
               router.replace('/404')
               return
            }
         })
         .catch((e) => {
            console.log(e.message)
            router.replace('/404')
         })
   }, [router])

   if (router.isFallback || loading) return <FacebookCircularProgress />
   return (
      <div>
         <Player
            config={props.plyrConfig}
            fileSize={props.videoData?.embedVideo2s[0]?.video_size}
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
   const res = await embedSubQuery2({ embedLink: params.id })
   const plyrConfig = {
      type: 'video',
      title: 'Example title',
      sources: [
         {
            src: `${process.env.ENG_EMBED_URL as string}/${
               params.id as string
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
      props: { params, videoData: res, plyrConfig: plyrConfig },
      revalidate: 10, // In seconds
   }
}
function FacebookCircularProgress(props: CircularProgressProps) {
   return (
      <Box
         display="flex"
         justifyContent="center"
         alignItems="center"
         minHeight="100vh"
      >
         <CircularProgress
            variant="indeterminate"
            sx={{
               position: 'absolute',
               color: (theme) =>
                  theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
               animationDuration: '550ms',
               [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
               },
            }}
            size={100}
            thickness={3}
            {...props}
         />
      </Box>
   )
}
