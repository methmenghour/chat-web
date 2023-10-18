'use client'
import {useState,useRef, useEffect} from "react";
import { CiPlay1 } from "react-icons/ci";
import { BsStopCircle } from "react-icons/bs";
import WaveSurfer from "wavesurfer.js";
const PlaySound = ({ audio }: { audio:any}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const waveformRef = useRef<any>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  useEffect(() => {
    const loadWaveSurfer = async () => {
      if (audio) {
        waveSurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'black',
          progressColor: '#06b6fe',
          barWidth:2,
          height:30,
          cursorWidth:0,
          cursorColor:'transparent',
        });
        waveSurferRef.current.load(audio);
        waveSurferRef.current.on('finish', () => {
          setIsPlaying(true);
        });
      return ()=>{
        waveSurferRef.current?.destroy();
      };
      }

    };
    loadWaveSurfer();
  }, [audio]);
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      
    }
  };
  return (
    <div>
    <div className="flex">
      <div className="ml-4 flex h-10 w-48	 items-center justify-center rounded-full bg-gray-200">
        <div className="gap-8">
          <div onClick={handlePlayPauseClick}>
            {isPlaying ? <CiPlay1  className="ms-2"/> : <BsStopCircle className="ms-2" />}
          </div>
        </div>
        <div ref={waveformRef}
          className="relative ml-4 w-72 items-center"         
        >             
        </div>
      </div>
    </div>
  </div>
  );
}
export default PlaySound