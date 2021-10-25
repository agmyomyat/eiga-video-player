
import React from 'react';
import { VideoJsPlayer,VideoJsPlayerOptions } from 'video.js';
import VideoJS from './videojs';

export default function Player({uuid,textTrack}:{uuid:string,textTrack:string}){
  const playerRef = React.useRef<VideoJsPlayer|null>(null);
  
  const videoJsOptions:VideoJsPlayerOptions = { // lookup the options in the docs for more options
    autoplay: false,
    controls: true,
    preload:'metadata',
    responsive: true,
    fluid: true,
    tracks:[{src:`https://plyr.eiga.sbs/vtt/${textTrack}.vtt`, kind:'captions', srclang: 'en', label: 'English'}],
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