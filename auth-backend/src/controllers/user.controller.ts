import prisma from "../db/prismaClient"
import { Request,Response } from "express"




export const userController = async (req:Request,res:Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error:any) {
        console.log(error.message);
        res.status(500).json({message:"server error"});
    }
}