"use client";
import React, { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "../zustand/useAuthStore";
import { useUserStore } from "../zustand/useUserStore";
import axios from "axios";
import ChatUsers from "@/components/ui/home/ChatUsers";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";

function Chat() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{ text: string; sentByCurrUser: boolean }[]>(
    []
  );
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const { authName } = useAuthStore();
  const { setUsers } = useUserStore();
  const { chatReceiver } = useChatReceiverStore();

  const getUserData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/users", {
        withCredentials: true,
      });
      console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [setUsers]);

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io("http://localhost:5000", {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);

    // Listen for incoming msgs
    newSocket.on("chat msg", (msgrecv: string) => {
      console.log("received msg on client " + msgrecv);
      setMsgs((prevMsgs) => [
        ...prevMsgs,
        { text: msgrecv, sentByCurrUser: false },
      ]);
    });
    getUserData();
    // Cleanup function to close the connection
    return () => {
      newSocket.off("chat msg");
      newSocket.close();
    };
  }, [authName, getUserData, setUsers]);

  type Msg = {
    text: string;
    sender: string;
    receiver: string;
  };

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msgToBeSent: Msg = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };

    if (socket) {
      socket.emit("chat message", msgToBeSent);
      setMsgs((prevMsgs) => [...prevMsgs, { text: msg, sentByCurrUser: true }]);
      setMsg("");
    } else {
      console.error("Socket is not connected");
    }
  };

  return (
    <div className="h-screen divide-x-4 flex">
      <div className="w-1/4 ">
        <ChatUsers />
      </div>
      <div className=" w-4/5 flex flex-col">
        <div className="h-1/5 flex items-center justify-center">
          <h1 className="text-2xl font-bold">{authName} Chat with {chatReceiver}</h1>
        </div>
        <div className="msgs-container h-3/5 overflow-y-auto p-4">
          {msgs.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sentByCurrUser ? "justify-end" : "justify-start"
              } m-2`}
            >
              <span
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  msg.sentByCurrUser
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1/5 flex items-center justify-center">
          <form onSubmit={sendMsg} className="w-1/2">
            <div className=" relative">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your text here"
                required
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
