import { NextRouter, useRouter } from "next/router";
import Player from "../../src/components/player";

export default function Embed(props:any) {
  const router:NextRouter = useRouter()
  console.log("props", props)
  if (router.isFallback)return <h1>loading...</h1>
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
