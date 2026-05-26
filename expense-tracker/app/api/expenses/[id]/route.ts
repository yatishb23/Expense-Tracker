import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(_request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense || expense.userId !== userId) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id } });
  return Response.json({ message: "Deleted" });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(data.description && { description: data.description }),
        ...(data.amount && { amount: Number(data.amount) }),
        ...(data.category && { category: data.category }),
        ...(data.date && { date: new Date(data.date) }),
      },
    });

    return Response.json({ expense });
  } catch {
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }
}
