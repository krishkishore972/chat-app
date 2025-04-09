

import React, { useEffect } from "react";
import { useUserStore } from "@/app/zustand/useUserStore";
import { useChatReceiverStore } from "@/app/zustand/useChatReceiverStore";
import { useChatMsgsStore } from "@/app/zustand/useChatMsgsStore";
import axios from "axios";
import { useAuthStore } from "@/app/zustand/useAuthStore";



function ChatUsers() {
  const { users } = useUserStore();
  const { chatReceiver,setChatReceiver } = useChatReceiverStore();
  const {authName} = useAuthStore();
  const{updateChatMsgs} = useChatMsgsStore();

  type User = {
    id: number;
    username: string;
    password: string;
    createdAt: string;
  };
  const updateChatReceiver = (user:User) => {
    setChatReceiver(user.username);
  };

  useEffect(() => {
    const getMsgs = async () => {
      const res = await axios.get("http://localhost:8080/msgs", {
        params: {
          'sender': authName,
          'receiver': chatReceiver,
        },
        withCredentials: true,
      });
      if (res.data.length != 0) {
        updateChatMsgs((prev) => [...prev, ...res.data]); 
      } else {
        updateChatMsgs(() => []); // clear messages
      }
    }
    if(chatReceiver){
      getMsgs();
    }
  },[chatReceiver,authName]);

  return (
    <div>
      {users.map((user, index) => (
        <div
          onClick={() => updateChatReceiver(user)}
          className="rounded-xl m-3 p-5 cursor-pointer hover:bg-blue-500 hover:text-white font-semibold text-lg hover:rounded-lg duration-300"
          key={index}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}

export default ChatUsers;
