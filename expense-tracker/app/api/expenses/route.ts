import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const where: any = { userId };

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return Response.json({ expenses });
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { description, amount, category, date } = await request.json();
    if (!description || !amount) {
      return Response.json({ error: "Description and amount required" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        description,
        amount: Number(amount),
        category: category || "Other",
        date: new Date(date || Date.now()),
      },
    });

    return Response.json({ expense }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
