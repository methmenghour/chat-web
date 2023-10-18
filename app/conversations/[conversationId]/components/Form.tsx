"use client"
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues,SubmitHandler,useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import{FaMicrophone} from 'react-icons/fa'
import { CldUploadButton } from "next-cloudinary";
import { useEffect, useState } from "react";
import MessageVoice from "./MessageVoice";
import { FiPaperclip } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import { BsEmojiSmile } from "react-icons/bs";
import Loading from "@/app/users/components/loading";
import clsx from "clsx";
const Form = () => {
  const { conversationId } = useConversation();
  const [showAudioRecorder,setShowAudioRecorder]=useState(false);
  const [message, setMessage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    setValue
  } = useForm<FieldValues>({
    defaultValues: {
      message:""
    }
  });
  useEffect(()=>{
    setValue('message',message, { shouldValidate: true }); 
  },[message]) 
  const onSubmit: SubmitHandler<FieldValues> = (data) =>  {
    setIsLoading(true)
    axios.post('/api/messages', {
      ...data,
      conversationId: conversationId
    }).then()
      .catch(() => toast.error('Something went wrong!'))
      .finally(() =>{setMessage(""),setIsLoading(false)});
    };
  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId
    })
  }
  const FormContainer = clsx('flex items-center  gap-2 lg:gap-3 w-full',showAudioRecorder&&"hidden sm:flex"); 
  const IconStyle=clsx('text-panel-header-icon cursor-pointer text-sky-500',showAudioRecorder&&"hidden sm:block"); 
  return (
    <div
    className="
    py-4 
    px-4 
    bg-white 
    border-t 
    flex  
    items-center 
    gap-3 
    lg:gap-3 
    w-full
  "
    >
      <CldUploadButton 
        options={{ maxFiles: 1 }} 
        onUpload={handleUpload} 
        uploadPreset="lva3x35y"
      >
      <FiPaperclip size={25} className={IconStyle} />
      </CldUploadButton>
      {showEmoji && (
          <div className="absolute bottom-24">
            <EmojiPicker  
              width={300}
              onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              />
          </div>
        )}
        <button className=" focus:outline-none">
        <BsEmojiSmile 
          rel="preload" href="style.css" as="style"
          fontSize={25}
          className={IconStyle}
          onClick={() => setShowEmoji((prev) => !prev)}

        />
        </button>
        <form  onSubmit={handleSubmit(onSubmit)}
          className={FormContainer}
        >
          <input
            {...register("message", { required: true })}
            placeholder="Write a message"
            name="message"
            type="text"
            className="
            form-control
            text-black
            font-light
            py-2
            px-4
            bg-neutral-100 
            w-full 
            rounded-md
            focus:outline-sky-500
          "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
          <button 
          className=" focus:outline-none"
          type="submit"
        >
          <HiPaperAirplane
            size={25}
            className="text-panel-header-icon cursor-pointer text-sky-500"
          />
        </button>  
        </form>  
        <button>
            <FaMicrophone   size={25} 
            onClick={() => setShowAudioRecorder(true)} 
            className="text-panel-header-icon cursor-pointer text-sky-500 " hidden={showAudioRecorder} />
        </button> 
        {showAudioRecorder &&
         (<MessageVoice ChangeAudioRecorder={function (prevState: boolean): void {
          setShowAudioRecorder(prevState)
      } }/>)}
      {isLoading &&(
            <Loading />
       )}
  </div>
  )
}
export default Form