import type { NextPage } from 'next'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {ChangeEvent, useEffect,  useRef, useState} from 'react'
import uploadVideo from '../src/http';
import LinearWithValueLabel from '../src/components/progressBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
    width: '100%',
  },
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }),
);

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [video, setVideo] = useState<string|Blob>('')
  const [source, setSource] = useState<string>()
   const classes = useStyles();
   const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
     if (!inputRef.current||!event.target){
       throw Error('ref is not assigned') 
     }
     if(event.target.files?.length !== 0){
       const file = event.target.files![0]
       setVideo(event.target.files&&event.target.files[0]||'')
       const url = URL.createObjectURL(file);
       setSource(url);
       console.log("ref",inputRef.current.value)
    }
  
  };
  function onUploadProgress(event:any){
    setProgress(Math.round((100 * event.loaded) / event.total),)
  }
  const handleUpload = ()=>{
    uploadVideo(video,onUploadProgress,"amm")
    if(inputRef.current){
      inputRef.current.value=""
      setSource('')
    }else{
    throw Error("inputRef value not found(its not supposed to be empty)")
    }
  }
  useEffect(()=>{
    console.log(source)
  },[source])
  const handleChoose = () => {
    if(!inputRef.current){
      throw Error('ref is not assigned')
    }
    inputRef.current.click();
  };
  const clearFile =()=>{
    if (inputRef.current){
      inputRef.current.value=''
      setSource('')
    return console.log(inputRef.current)

    }else{
      alert("choose a video first")
    }
  }
  return (
    <div className={classes.root}>
      <input
        ref={inputRef}
        className={classes.input}
        onChange={handleFileChange}
        id="contained-button-file"
        type="file"
        accept= ".mp4"
      />
        {!source&&
        <Button  onClick={handleChoose} variant="contained" color="primary" component="span">
          Upload
        </Button>
        }
      {source && (
        <div>
        <video
          className="VideoInput_video"
          height='400'
          width= '400'
          controls
          src={source}
        />
        <Button onClick={handleUpload} variant="contained" color="primary" >upload Video</Button>
        <Button onClick={clearFile} variant="contained" color="secondary" >Remove Video</Button>
        </div>
      )}
      {progress>0&&
      <LinearWithValueLabel value={progress}/>
      }
      </div>
  )
}

export default Home
