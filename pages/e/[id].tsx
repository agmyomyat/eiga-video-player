import { CircularProgressProps, circularProgressClasses, CircularProgress, Box, Button } from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkPremiumQuery } from "../../src/api/graphql-req/checkPremium";
import { embedSubQuery } from "../../src/api/graphql-req/embedSub";
import Player from "../../src/components/player";
import JsFileDownloader from 'js-file-downloader';
export default function Embed(props:any) {
  const router:NextRouter = useRouter()
  const [loading,setLoading] = useState(true)
  const [subtitle, setSubtitle] = useState('')
  const [subLoading,setSubLoading] = useState(true)
  useEffect(() => {
    if(!router.isReady||router.isFallback)return 
    console.log("router readey",router.isReady)
    if (router.isReady&& !router.query.token) {
      console.log("props", router.query)
      console.log("it fucking")
      // router.replace('/404')
      setLoading(false)
    }
    embedSubQuery({ eigaLink: (router.query.id as string) }).then((res) => {
      setSubtitle(res.embedVideos[0].eng_sub)
      console.log("asdflsadfl",res)
      setSubLoading(false)
    }).catch(e => {
      console.log(e.message)
      setSubLoading(false)
    })
    checkPremiumQuery(router.query.token as string).then((res) => {
      console.log("result",res)
      if (res.getUserData.premium) {
      return setLoading(false)
      } else {
      setLoading(false)
      // router.replace('/404')
      return

    }
    }).catch((e) => {
      console.log(e.message)
      // router.replace('/404')
    })

  },[router])

  async function download() {
  //  new JsFileDownloader({ url: "https://plyr.eiga.sbs/vtt/%5BSubtitleTools.com%5D%20theboys-s1-e2.vtt" })
   new JsFileDownloader({ url: "https://plyr.eiga.sbs/vtt/%5BSubtitleTools.com%5D%20theboys-s1-e2.vtt",contentType:'application/octet-stream' })

  }
  if (router.isFallback||loading||subLoading) return <FacebookCircularProgress/>
	return (
		<div>
      <Player textTrack={subtitle} uuid={props.params.id}/>
      <Button onClick={download}>HIII</Button>
		</div>
	)
}
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true 
  };
}
export async function getStaticProps({ params  }:any) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  // Pass post data to the page via props
  return { props: { params} }
}
function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh">
      <CircularProgress
        variant="indeterminate"
        sx={{
          position: 'absolute',
          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
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
  );
}