import React, { useEffect } from 'react'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import OnPlayerModal from './onPlayerModal'
import axios, { CancelTokenSource } from 'axios'
import fileDownload from 'js-file-download'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { WindowRounded } from '@mui/icons-material'
let cancelAxioToken: CancelTokenSource

export default function Player({
   uuid,
   fileSize,
   config,
}: {
   fileSize: string
   uuid: string
   config: {}
}) {
   const playerRef = React.useRef<VideoJsPlayer | null>(null)
   const [open, setOpen] = React.useState(false)
   const [progress, setProgress] = React.useState(0)
   const [modalMessage, setModalMessage] = React.useState('')
   const [downloading, setDownloading] = React.useState(false)
   const router = useRouter()

   React.useEffect(() => {
      const myVideo = document.querySelector('video')
      if (!myVideo) return
      myVideo.addEventListener('webkitbeginfullscreen', () => {
         document.documentElement.style.setProperty(
            '--webkit-text-track-display',
            'block'
         )
      })
      myVideo.addEventListener('webkitendfullscreen', () => {
         document.documentElement.style.setProperty(
            '--webkit-text-track-display',
            'none'
         )
      })
   }, [])

   function onDownloadProgress(event: ProgressEvent) {
      setProgress(Math.round((99 * event.loaded) / event.total))
   }

   const PlyrFC = () => {
      useEffect(() => {
         const Plyr = require('plyr')
         const css = require('plyr/dist/plyr.css')
         const player = new Plyr('#plyrPlayer', {
            ratio: '16:9',
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
            ],
            fullscreen: { iosNative: true },
            captions: { active: true },
            storage: { enabled: false, key: 'plyrPlayer' },
         })
         player.source = config

         player.once('playing', (e: any) => {
            console.log('top', window.top)
            if (router.query.ct) {
               player.currentTime = JSON.parse(router.query.ct as string)
            }
            setInterval(function () {
               window.top?.postMessage(
                  JSON.stringify(player.currentTime),
                  'https://rosestream.watch'
               )
            }, 10000)
         })
      }, [])

      return (
         <video
            className="plyr__video-embed"
            id="plyrPlayer"
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
            fileDownload(response.data, `${uuid}.mp4`)
            setModalMessage('download completed')
         })
         .catch((e) => {
            setDownloading(false)
            setModalMessage('your request cancelled or network error')
            console.error(e.message)
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
