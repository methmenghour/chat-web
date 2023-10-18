'use client';
import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useState } from "react";
interface UserListProps {
  items: User[];
}
const UserList: React.FC<UserListProps> = ({ 
  items, 
}) => {
  const [query, setQuery] = useState('');
  const findUser = ( items|| []).filter((user) =>user.name?.toLowerCase().includes(query))
  const handleChange = (e:any) => {
    setQuery(e.target.value)
    }
  return ( 
    <aside 
      className="
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200
        block w-full left-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div 
            className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            "
          >
            People
          </div>
          <div>
          <input     
            placeholder="Search"
            className="
              text-black-700
              font-light
              py-2
              px-4
              bg-neutral-200 
              w-full 
              rounded-md
              focus:outline-none
            "   
            onChange={handleChange}
          />      
          </div>
        </div>
        {findUser.map((item) => (
          <UserBox
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}
export default UserList;