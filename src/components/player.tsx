import { useEffect, useState } from "react";
const config = {
	"title": "Example Title",
	"debug": true,
	"blankVideo":"https://cdn.plyr.io/static/blank.mp4",
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
export default function Player({ uuid }:{uuid:string}) {
	const [error, setError] = useState(false)
	const Eplayer = typeof window !=="undefined"&& document.querySelector('#embed_player');
	
	useEffect(() => {
		Eplayer&&Eplayer.addEventListener('error', event => console.error('Doh!', (Eplayer as any).error, event), false);
		const Plyr =require("plyr");
		const styles =require('plyr/dist/plyr.css');
		const player = new Plyr('#embed_player');
		player.on('error', (event:any) => {
			console.log("error is happening")
			console.log("event happens" ,event.detail.plyr.error)
			setError(true)
		});
		player.on('ready',(event:any)=> {
			console.log("ready is happening")
			setError(false)
		})
		player.source = {
			type: 'video',
			title: 'Example title',
			sources: [
				{
					src: `https://plyr.eiga.sbs/${uuid}.mp4`,
					type: 'video/mp4',
					size: 720,
				}]}
	} ,[Eplayer, uuid])
	return (
		<>
			{
				error ?
					<h1>error occured</h1>:
		<div className="plyr__video-embed" style={{width:"100%", height:"100%"}} >
			<video id="embed_player" controls data-plyr-config={videoCf}></video>
			
			
		</div>
		}
</>
	)
}
