import { Slider } from '@radix-ui/react-slider';
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button } from '../ui/button';
import '@radix-ui/themes/styles.css';


const VideoPlayer = ({ width = "100%", height = "100%", url}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed  ] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayAndPause(){
    setPlaying(!playing);
  }

  function handleProgress(state){
    if(!seeking){
      setPlayed(state.played);
    }
  }

  function handleRewind(){
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 5);
  }

  function handleForward(){
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 5);
  }

  function handleToggleMute(){
    setMuted(!muted);
  }

  function hanldeSeekChange(newValue){
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp(){
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }

  function handleVolumeChange(newValue){
    setVolume(newValue[0]);
  }
  return (
    <div ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
       ${isFullScreen ? 'w-screen h-screen' : ''}`}
       style={{width, height}}>
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width={'100%'}
        height={'100%'}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        // controls
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => hanldeSeekChange([value[0]/100])}
            onValueCommit={handleSeekMouseUp}
            className='w-full mb-4 bg-red-800'
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant=""
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  {playing ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button
                variant="ghost"
                onClick={handleRewind}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  <RotateCcw className="h-6 w-6"/>
                </Button>                
                <Button
                variant="ghost"
                onClick={handleForward}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  <RotateCw className="h-6 w-6"/>
                </Button>                 
                <Button
                variant="ghost"
                onClick={handleToggleMute}
                size="icon"
                className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  {
                    muted ? (
                     <VolumeX className="h-6 w-6"/>
                      ) : ( 
                      <Volume2 className="h-6 w-6"/> )
                  }
                </Button> 
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange(value[0]/100)}
                />
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer