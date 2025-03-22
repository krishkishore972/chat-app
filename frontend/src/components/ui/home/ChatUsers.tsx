import React from "react";
import { useUserStore } from "@/app/zustand/useUserStore";
import { useChatReceiverStore } from "@/app/zustand/useChatReceiverStore";
import { useChatMsgsStore } from "@/app/zustand/useChatMsgsStore";
import axios from "axios";

function ChatUsers() {
  const { users } = useUserStore();
  const { setChatReceiver } = useChatReceiverStore();
  const updateChatReceiver = (username: string) => {
    setChatReceiver(username);
  };

  return (
    <div>
      {users.map((user, index) => (
        <div
        onClick={() => updateChatReceiver(user.username)}
        className="bg-slate-400 rounded-xl m-3 p-5 cursor-pointer"
         key={index}>
          {user.username}
        </div>
      ))}
    </div>
  );
}

export default ChatUsers;
