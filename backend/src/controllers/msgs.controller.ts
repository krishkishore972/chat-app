import prisma from "../prismaClient";
import { Request, Response } from "express";
type Participants = string[];
type Message = {
  text: string;
  sender: string;
  receiver?: string;
};
export const addMsgToConversation = async (
  participants: Participants,
  msg: Message
) => {
  try {
    // Find existing conversation with these participants
    let conversation = await prisma.conversation.findFirst({
      where: {
        users: {
          hasEvery: participants,
        },
      },
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          users: participants,
        },
      });
    }

    // Add message to the conversation
    const newMessage = await prisma.message.create({
      data: {
        text: msg.text,
        sender: msg.sender,
        receiver: msg.receiver,
        conversationId: conversation.id,
      },
    });

    return { conversation, message: newMessage };
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    throw error;
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { sender, receiver } = req.query;
    console.log(sender, receiver);
    const participants: Participants = [sender as string, receiver as string];
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { has: sender as string } },
          { users: { has: receiver as string } },
        ],
      },
      include: {
        messages: true,
      },
    });
    if (!conversation) {
      console.log("Conversation not found");
      res.status(200).send();
      return;
    }
    res.json(conversation.messages);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
