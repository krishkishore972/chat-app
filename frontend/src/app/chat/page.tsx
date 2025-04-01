"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../zustand/useAuthStore";
import { useUserStore } from "../zustand/useUserStore";
import axios from "axios";
import ChatUsers from "@/components/ui/home/ChatUsers";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { Msg } from "@/lib/types";
function Chat() {
  const [msg, setMsg] = useState("");
  // const [msgs, setMsgs] = useState<{ text: string; sentByCurrUser: boolean }[]>(
  //   []
  // );
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const { authName } = useAuthStore();
  const { setUsers } = useUserStore();
  const { chatReceiver } = useChatReceiverStore();
  const { chatMsgs,updateChatMsgs } = useChatMsgsStore();

  const getUserData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io("http://localhost:8080", {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);



    // Listen for incoming msgs
    newSocket.on("chat msg", (msgrecv: Msg) => {
      console.log("received msg on client " + msgrecv);
      updateChatMsgs([...chatMsgs, msgrecv]);
      // setMsgs((prevMsgs) => [
      //   ...prevMsgs,
      //   { text: msgrecv, sentByCurrUser: false },
      // ]);

    });
    getUserData();
    // Cleanup function to close the connection
    return () => {
      newSocket.off("chat msg");
      newSocket.close();
    };
  }, [setUsers, authName, chatReceiver, chatMsgs, updateChatMsgs]);


  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msgToBeSent: Msg = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };

    if (socket) {
      socket.emit("chat message", msgToBeSent);
      updateChatMsgs([...chatMsgs,msgToBeSent ]);
      // setMsgs((prevMsgs) => [...prevMsgs, { text: msg, sentByCurrUser: true }]);
      setMsg("");
    } else {
      console.error("Socket is not connected");
    }
  };

  return (
    // <div className="h-screen divide-x-4 flex">
    //   <div className="w-1/4 bg-gray-200 h-full flex flex-col">
    //   <div className="flex items-center justify-center">
    //     <h1 className="text-2xl font-bold mt-2 p-3">Chat-app</h1>
    //   </div>
    //     <ChatUsers />
    //   </div>
    //   <div className=" w-4/5 flex flex-col">
    //     <div className="h-1/5 flex items-center justify-center ">
    //       <h1 className="text-2xl font-bold">
    //         {authName} Chat with {chatReceiver}
    //       </h1>
    //     </div>
    //     {/* Messages container */}
    //     <div className="msgs-container h-3/5 overflow-y-auto p-4">
    //       {msgs.map((msg, index) => (
    //         <div
    //           key={index}
    //           className={`flex ${
    //             msg.sentByCurrUser ? "justify-end" : "justify-start"
    //           } m-2`}
    //         >
    //           <span
    //             className={`px-4 py-2 rounded-lg max-w-xs break-words ${
    //               msg.sentByCurrUser
    //                 ? "bg-blue-500 text-white"
    //                 : "bg-green-500 text-white"
    //             }`}
    //           >
    //             {msg.text}
    //           </span>
    //         </div>
    //       ))}
    //     </div>

    //     <div className="h-1/5 flex items-center justify-center">
    //       <form onSubmit={sendMsg} className="w-1/2">
    //         <div className=" relative">
    //           <input
    //             type="text"
    //             value={msg}
    //             onChange={(e) => setMsg(e.target.value)}
    //             placeholder="Type your text here"
    //             required
    //             className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //           />
    //           <button
    //             type="submit"
    //             className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //           >
    //             Send
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">WHATS APP</h1>
        </div>
        <ChatUsers />
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        <div className="bg-white border-b p-4 shadow-sm flex items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {authName} chatting with{" "}
            <span className="text-blue-500">{chatReceiver}</span>
          </h2>
        </div>

        {/* Message container */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-4">
          {chatMsgs.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === authName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs break-words shadow-md ${
                  msg.sender == authName
                    ? "bg-blue-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input and Send Button */}
        <div className="bg-white border-t p-4">
          <form onSubmit={sendMsg} className="flex items-center space-x-4">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your message..."
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
