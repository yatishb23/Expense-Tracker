import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return Response.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user.id);
    return Response.json({ token, user: { id: user.id, username: user.username } });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
