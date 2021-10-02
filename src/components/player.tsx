import { useEffect } from "react";
const config = {
	"title": "Example Title",
	"debug": true,
	"controls": [
    'play-large', // The large play button in the center
    'restart', // Restart playback
    'play', // Play/pause playback
    'progress', // The progress bar and scrubber for playback and buffering
    'current-time', // The current time of playback
    'duration', // The full duration of the media
    'mute', // Toggle mute
    'volume', // Volume control
    'captions', // Toggle captions
    'settings', // Settings menu
    'pip', // Picture-in-picture (currently Safari only)
    'airplay', // Airplay (currently Safari only)
    'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
    'fullscreen', // Toggle fullscreen
]
}
const videoCf = JSON.stringify(config)
export default function Player() {
	
	useEffect(() => {
		const Plyr =require("plyr");
		const styles =require('plyr/dist/plyr.css');
		const player = new Plyr('#embed_player');
		player.source = {
			type: 'video',
			title: 'Example title',
			sources: [
				{
					src: 'https://plyr.eiga.sbs/9f797fab-8dab-472a-86ef-d9b8ec5db9f6.mp4',
					type: 'video/mp4',
					size: 720,
				}]}
	} ,[])
	return (
		<div className="plyr__video-embed" style={{width:"100%", height:"100%"}} >
			<video id="embed_player" controls data-plyr-config={videoCf}></video>
			
		</div>
	)
}
