"use client";
import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import ImageModal from "./ImageModal";
import PlaySound from "./PlaySound";
interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
  }
const MessageBox:React.FC<MessageBoxProps> = ({
    data,
    isLast
}) => {
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const session=useSession();
    const isOwn = session.data?.user?.email === data?.sender?.email
    const seenList = (data.seen || [])
    .filter((user) =>user.email!==session.data?.user?.email)
    .map((user) => user.name)
    .join(', ');
    const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
    const avatar = clsx(isOwn && 'order-2');
    const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
    const message = clsx(
      'text-sm w-fit overflow-hidden', 
      isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100', 
      data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
    ); 

    
  const fileType = useMemo(() => getFileType( data.image ), [ data.image ]);

    return (
    <div className={container}>
        <div className={avatar}>
            <Avatar user={data.sender}/>
        </div>
        <div className={body}>
            <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">
                    {data.sender.name}
                </div>
                <div className="text-xs text-gray-400">
                    {format(new Date(data.createdAt),'PP')}
                </div>
            </div>
            <div className={message}> 
                <div>{data.body}</div>
          </div>
          <div>
          <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
                {
                   (fileType=="photo")&&
                     <Image     
                     onClick={() => setImageModalOpen(true)} 
                    alt="Image"
                    height="68"
                    width="68"
                    src={data.image!} 
                    className="
                        object-cover 
                        cursor-pointer 
                        hover:scale-110 
                        transition 
                        translate
                    "
            />
                }
                {
                  
                  (fileType=="audio")&&
                   <audio controls>
                      <source src={data.image!} type="audio/mpeg"/>
                      <source src={data.image!} type="audio/ogg"/>
                      <source src={data.image!} type="audio/wav"/>
                  </audio>
                                 
                }
                {
                  
                  (fileType=="video")&&
                  <video width="320" height="240" controls>
                     <source src={data.image!} type="video/mp4"/>
                  </video>                              
                }
                 {
                  
                  (fileType=="voice")&&(
                    <PlaySound audio={data.image}/>

                  )                         
                }
                 {
                  
                  (fileType=="other")&&(
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800  py-2 px-4 rounded inline-flex items-center">
                      <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                      <a href={data.image!} download>Download File</a>
                    </button>
                  )                         
                }
          </div>
            {isLast  && seenList.length > 0 && (
          <div 
            className="
            text-xs 
            font-light 
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
           )}
        </div>
    </div>
  )
}
function getFileType(filename:string| undefined|null) {
  if(filename==(undefined||null)) filename='.';
  const chechData=filename.split('.').pop()?.toLocaleLowerCase();
  if(chechData?.match(/^(jpg|png|gif|svg|ico)$/)){
   return "photo";
  }
  if(chechData?.match(/^(mp4)$/)){
   return "video";
  }
  if(chechData?.match(/^(mp3|ogg|wav)$/)){
   return "audio";
  }
  if(chechData?.match(/^(webm)$/)){
   return "voice";
  }
  if(chechData?.length!>0){
    return "other";
   }
 return ''
}

export default MessageBox