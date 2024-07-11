import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();
  await prisma.token.deleteMany();

  console.log("Deleted existing data");

  const kyle = await prisma.user.create({
    data: {
      id: "0xKyleWalletAddress", // Example wallet address
    }
  });
  console.log("Created user Kyle");

  const sally = await prisma.user.create({
    data: {
      id: "0xSallyWalletAddress", // Example wallet address
    }
  });
  console.log("Created user Sally");

  const token = await prisma.
  
   token.create({
    data: {
      id: "0x29673f4beb3082bce8cd5f3cba9a86c893f880e2"
    }
  });
  console.log("Created token");

  const comment1 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: kyle.id,
      tokenId: token.id
    }
  });
  console.log("Created comment1");

  const comment2 = await prisma.comment.create({
    data: {
      parentId: comment1.id,
      message: "I am a nested comment",
      userId: sally.id,
      tokenId: token.id
    }
  });
  console.log("Created comment2");

  const comment3 = await prisma.comment.create({
    data: {
      message: "I am another root comment",
      userId: sally.id,
      tokenId: token.id
    }
  });
  console.log("Created comment3");

  console.log("Seeding completed!");
}

seed()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
