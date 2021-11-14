import React, { useEffect } from 'react'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import OnPlayerModal from './onPlayerModal'
import VideoJS from './videojs'
import axios, { CancelTokenSource } from 'axios'
import fileDownload from 'js-file-download'
import { Box } from '@mui/material'
let cancelAxioToken: CancelTokenSource
export default function Player({
   uuid,
   textTrack,
   videoId,
   fileSize,
}: {
   fileSize: string
   uuid: string
   textTrack: string
   videoId: string
}) {
   const playerRef = React.useRef<VideoJsPlayer | null>(null)
   const [open, setOpen] = React.useState(false)
   const [progress, setProgress] = React.useState(0)
   const [modalMessage, setModalMessage] = React.useState('')
   const [downloading, setDownloading] = React.useState(false)

   React.useEffect(() => {
      console.log('message is ', modalMessage)
   }, [modalMessage])

   function onDownloadProgress(event: ProgressEvent) {
      setProgress(Math.round((99 * event.loaded) / event.total))
   }

   const PlyrFC = () => {
      useEffect(() => {
         const Plyr = require('plyr')
         const css = require('plyr/dist/plyr.css')
         const player = new Plyr('#player', {
            controls: [
               'play-large', // The large play button in the center
               'rewind', // Rewind by the seek time (default 10 seconds)
               'play', // Play/pause playback
               'fast-forward', // Fast forward by the seek time (default 10 seconds)
               'progress', // The progress bar and scrubber for playback and buffering
               'current-time', // The current time of playback
               'duration', // The full duration of the media
               'volume', // Volume control
               'captions', // Toggle captions
               'settings', // Settings menu
               'airplay', // Airplay (currently Safari only)
               'fullscreen', // Toggle fullscreen
               'download',
            ],
         })
         // player.on('pause', (e: any) => {
         //    console.log(' player pause', e)
         //    setOpen(true)
         // })
         // player.on('seeking', (e: any) => {
         //    console.log(' player seeking', e)
         //    setOpen(false)
         // })
         // player.on('playing', (e: any) => {
         //    console.log(' player playing', e)
         //    setOpen(false)
         // })

         player.on('error', (e: any) => {
            console.log('player occuring error', e)
         })
         player.source = {
            type: 'video',
            title: 'Example title',
            sources: [
               {
                  src: `https://fcdn.rosestream.watch/${uuid}.mp4`,
                  type: 'video/mp4',
                  size: 1080,
               },
            ],
            tracks: [
               {
                  kind: 'captions',
                  label: 'English',
                  srclang: 'en',
                  src: `https://fcdn.rosestream.watch/vtt/${textTrack}.vtt`,
                  default: true,
               },
            ],
         }
      }, [])

      return (
         <video
            className="plyr__video-embed"
            id="player"
            crossOrigin=""
            controls
            data-plyr-config='{ "title": "Example Title" }'
         ></video>
      )
   }

   function cancelDownload() {
      if (cancelAxioToken) cancelAxioToken.cancel()
   }
   async function download() {
      if (cancelAxioToken) {
         cancelAxioToken.cancel()
      }
      cancelAxioToken = axios.CancelToken.source()
      setDownloading(true)
      axios({
         url: `${process.env.EMBED_URL}/${uuid}.mp4`,
         // url: `${process.env.EMBED_URL}/${router.query.id}`,
         method: 'GET',
         cancelToken: cancelAxioToken.token,
         responseType: 'blob', // Important
         onDownloadProgress,
      })
         .then((response) => {
            setDownloading(false)
            fileDownload(response.data, `${videoId}.mp4`)
            setModalMessage('download completed')
         })
         .catch((e) => {
            setDownloading(false)
            setModalMessage('your request cancelled or network error')
            console.error(e.message)
         })
   }

   const handlePlayerReady = (player: VideoJsPlayer) => {
      playerRef.current = player
      setOpen(true)
      // you can handle player events here
      player.on('waiting', () => {
         console.log('player is waiting')
         setOpen(false)
      })
      player.on('playing', () => {
         console.log('playing')
         setOpen(false)
      })
      player.on('seeking', () => {
         setOpen(false)
      })
      player.on('dispose', () => {
         console.log('player will dispose')
      })
      player.on('pause', () => {
         console.log('pause')
         setOpen(true)
      })
   }

   return (
      <Box position="relative">
         <OnPlayerModal
            play={() => playerRef.current?.play()}
            fileSize={fileSize}
            downloading={downloading}
            cancelDownload={cancelDownload}
            download={download}
            setMessage={setModalMessage}
            message={modalMessage}
            progress={progress}
            open={open}
            setOpen={setOpen}
         />
         {/* <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> */}
         <PlyrFC />
      </Box>
   )
}
