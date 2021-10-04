import { CircularProgressProps, circularProgressClasses, CircularProgress, Box } from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import Player from "../../src/components/player";

export default function Embed(props:any) {
  const router:NextRouter = useRouter()
  console.log("props", props)
  if (router.isFallback) return <FacebookCircularProgress/>
	return (
		<div>
      <Player uuid={props.params.id}/>
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