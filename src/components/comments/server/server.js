// server.js

// Import necessary modules
import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = fastify();
const prisma = new PrismaClient();

app.register(sensible);
app.register(cors);
app.register(cookie);

// Fetch comments
app.get("/token/:tokenId/comments", async (req, res) => {
    const { tokenId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: {
                tokenId: tokenId
            },
            select: {
                id: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        res.send(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while fetching comments." });
    }
});

// Create comment
app.post("/token/:tokenId/comments", async (req, res) =>{
    const { tokenId } = req.params
    const { userId, message } = req.body;

     if (!userId || !message) {
        return res.status(400).send({ error: "userId and message are required" });
    }

    const newComment = await prisma.comment.create({
        data: {
            message,
            tokenId,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    return res.send(newComment);
});

// Like a comment
app.post("/comments/:commentId/like", async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ error: "userId is required" });
    }

    const like = await prisma.like.create({
        data: {
            userId,
            commentId,
        }
    });

    return res.send(like);
});

app.listen({ port: process.env.PORT || 3000 }, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
