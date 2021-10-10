
import React from 'react';
import { VideoJsPlayer } from 'video.js';
import VideoJS from './videojs';

export default function Player({uuid}:{uuid:string}){
  const playerRef = React.useRef<VideoJsPlayer|null>(null);

  const videoJsOptions = { // lookup the options in the docs for more options
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `https://plyr.eiga.sbs/${uuid}.mp4`,
      type: 'video/mp4'
    }]
  }

  const handlePlayerReady = (player:VideoJsPlayer) => {
    playerRef.current = player;
    

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  };

  // const changePlayerOptions = () => {
  //   // you can update the player through the Video.js player instance
  //   if (!playerRef.current) {
  //     return;
  //   }
  //   // [update player through instance's api]
  //   playerRef.current.src([{src: 'http://ex.com/video.mp4', type: 'video/mp4'}]);
  //   playerRef.current.autoplay(false);
  // };

  return (
    <>

      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

    </>
  );
}