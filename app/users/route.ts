import { prisma } from "../../lib/db";

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

export async function POST(request: Request) {
  const { name, age, status } = await request.json();

  const user = await prisma.user.create({
    data: { name, age, status },
  });

  return Response.json(user, { status: 201 });
}
