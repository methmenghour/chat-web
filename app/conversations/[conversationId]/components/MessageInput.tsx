"use client"
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { 
    FieldErrors, 
    FieldValues, 
    UseFormRegister
  } from "react-hook-form";
import { BsEmojiSmile } from "react-icons/bs";
  
  interface MessageInputProps {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors
  }
const MessageInput:React.FC<MessageInputProps> = ({
    placeholder, 
    id, 
    type, 
    required, 
    register, 
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
     {/* {showEmoji && (
          <div className="absolute bottom-24">
            <EmojiPicker  
              width={300}
              onEmojiClick={(e) => setMessage(message + e.emoji)}
            />
          </div>
        )}
        <BsEmojiSmile 
          rel="preload" href="style.css" as="style"
          onClick={() => setShowEmoji((pre) => !pre)}
          fontSize={25}
          className="icon cursor-pointer text-sky-500"
        />
       <div  className="relative w-full">
       <input
            id={id}
            type={type}
            autoComplete={id}
            {...register(id, { required })}
            placeholder={placeholder}
            className="
              text-black
              font-light
              py-2
              px-4
              bg-neutral-100 
              w-full 
              rounded-full
              focus:outline-none
            "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
       />      
   </div> */}
    </>  
  )
}
export default MessageInput

