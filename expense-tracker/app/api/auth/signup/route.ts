import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password || password.length < 6) {
      return Response.json(
        { error: "Username and password (min 6 chars) required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return Response.json({ error: "Username already taken" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const token = generateToken(user.id);
    return Response.json({ token, user: { id: user.id, username: user.username } });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
