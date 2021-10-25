// Lazy load the YouTube player
import React from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'
export const VideoJS = (props: { options: any; onReady: any }) => {
   const videoRef = React.useRef<HTMLVideoElement | null>(null)
   const playerRef = React.useRef<VideoJsPlayer | null>(null)
   const { options, onReady } = props

   React.useEffect(() => {
      // make sure Video.js player is only initialized once
      if (!playerRef.current) {
         const videoElement = videoRef.current
         if (!videoElement) return

         const player = (playerRef.current = videojs(
            videoElement,
            options,
            () => {
               console.log('player is ready')
               onReady && onReady(player)
            }
         ))
         console.log('texttrack is', playerRef.current.textTracks())
      } else {
         // you can update player here [update player through props]
         // const player = playerRef.current;
         // player.autoplay(options.autoplay);
         // player.src(options.sources);
      }
   }, [onReady, options])

   // Dispose the Video.js player when the functional component unmounts
   React.useEffect(() => {
      return () => {
         if (playerRef.current) {
            playerRef.current.dispose()
            playerRef.current = null
         }
      }
   }, [])

   return (
      <div data-vjs-player>
         <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
         ></video>
      </div>
   )
}

export default VideoJS
