import React from 'react'
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

   const videoJsOptions: VideoJsPlayerOptions = {
      // lookup the options in the docs for more options
      autoplay: false,
      controls: true,
      preload: 'metadata',
      responsive: true,
      aspectRatio: '16:9',
      tracks: [
         {
            src: `https://plyr.eiga.sbs/vtt/${textTrack}.vtt`,
            kind: 'captions',
            srclang: 'en',
            label: 'English',
         },
      ],
      sources: [
         {
            src: `https://plyr.eiga.sbs/${uuid}.mp4`,
            type: 'video/mp4',
         },
      ],
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
         <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </Box>
   )
}
