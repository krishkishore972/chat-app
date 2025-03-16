"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

function Chat() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{ text: string; sentByCurrUser: boolean }[]>(
    []
  );
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io("http://localhost:8080", {
      query: {
        username: "kishore",
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

    // Cleanup function to close the connection
    return () => {
      newSocket.off("chat msg");
      newSocket.close();
    };
  }, []);

  type Msg = {
    text: string;
    sender: string;
    receiver: string;
  };

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msgToBeSent: Msg = {
      text: msg,
      sender: "amit",
      receiver: "keerti",
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
    <div className="h-screen flex flex-col">
      <div className="msgs-container h-4/5 overflow-y-auto p-4">
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
  );
}

export default Chat;
