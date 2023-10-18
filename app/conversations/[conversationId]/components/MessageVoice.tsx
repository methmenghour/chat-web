
'use client'
import useConversation from "@/app/hooks/useConversation";
import Loading from "@/app/users/components/loading";
import axios from "axios";
import React, {useState,useRef, useEffect, FormEvent} from "react";
import toast from "react-hot-toast";
import { FaMicrophone, FaPauseCircle, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
interface MessageVoiceProps{
    ChangeAudioRecorder:(prevState:boolean) => void
  }
const MessageVoice:React.FC<MessageVoiceProps>= ({ChangeAudioRecorder}) => {
  const { conversationId } = useConversation();
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const mrRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audio, setAudio] = useState('');
  const [recordingDuration,setRecordingDuration]=useState<number>(0);
  const [isRecording, setIsRecording] =useState<boolean>(false);
  const dataType = "video/webm";
  const [file, setFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false)
  useEffect(()=>{
    let interval: any
    if(isRecording){
        interval=setInterval(()=>{
        setRecordingDuration((prevDuration)=>{
            return prevDuration+1;
        })
        },1000)
    }
    return ()=>{
        clearInterval(interval);
    }
},[isRecording])
useEffect(()=>{
  if(isRecording&&recordingDuration==60){
    stopRecording();
  }
},[isRecording,recordingDuration])
  const startRecording = async () => {
    setIsRecording(true);
        mrRef.current = null
        audioChunksRef.current = []
        setRecordingStatus("recording");
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(audioStream!, {
            mimeType: dataType,
            audioBitsPerSecond: 16*44100
        });
        mrRef.current = mediaRecorder;
        let localAudioChunks = [];//[Blob];
        mediaRecorder.start()
        mediaRecorder.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
            audioChunksRef.current.push(event.data);
            setFile(event.data);
        };
    };
    const stopRecording = () => {
        setIsRecording(false);
        setRecordingDuration(0);
        setRecordingStatus("inactive");
        if (!mrRef.current) 
        return
        mrRef.current?.stop();
        mrRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current,
                 {
                    type: dataType});      
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);  
            if (audio) {
              URL.revokeObjectURL(audio);
          }        
        };
    };
    const handleUploadAudio = async () =>  {
     setIsLoading(true);
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset','lva3x35y');
    try {
      const CLOUD_NAME=process.env.CLOUD_NAME;
      const URL=`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
      const response =await axios.post(
        URL,
        formData
      ).then((response) =>
       //console.log(response.data)
       handleUpload(response.data.secure_url)     
       ).catch(() => toast.error('Something went wrong!'))
       .finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
    }
    }
    const handleUpload = (imageUrl:string) => {
      axios.post('/api/messages', {
        image:imageUrl,
        conversationId: conversationId
      })
    }  
  const formatTime=(time:number)=>{
    if(isNaN(time)) return "00:00";
     const minute=Math.floor(time/60);
     const second=Math.floor(time%60);
     return `${minute.toString().padStart(2,"0")}:${second.toString().padStart(2,"0")}`
   }
  return (
    <>
      <button>
            <FaTrash size={20}
              onClick={() => ChangeAudioRecorder(false)}
             className="text-panel-icon"/>
        </button> 
        <audio src={audio} id="audio-player" className="h-10" controls />
        {isRecording &&(
            <span className="mr-2 text-red-500">{formatTime(recordingDuration)}</span>)   
        }
     
        { recordingStatus === "inactive" ?
            (
          <button>
             <FaMicrophone size={25} className="text-red-500 cursor-pointer"
                  onClick={startRecording}
                  />
          </button>       
          ): (
           <button>
            <FaPauseCircle size={30} className="text-red-500 cursor-pointer"
                onClick={stopRecording}
                />
          </button>       
         )}
           {(file!==null) &&
         (<button>
          <MdSend size={25}
            className="text-panel-header-icon cursor-pointer mr-4"
            title="send"
            onClick={handleUploadAudio}
          />       
       </button>)}
           {isLoading &&(
                      <Loading />
            )   
        }
  </>
  );
};
export default MessageVoice;