import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { db } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await db.collection("user").findOne(
    {
      $or: [
        ...(ObjectId.isValid(id) ? [{ _id: new ObjectId(id) }] : []),
        { _id: id as never },
        { id },
      ],
    },
    // Only public fields. Never email or phone.
    { projection: { name: 1, image: 1, bio: 1, location: 1, createdAt: 1 } }
  )

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Host not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      id,
      name: user.name ?? "",
      image: user.image ?? "",
      bio: user.bio ?? "",
      location: user.location ?? "",
      memberSince: user.createdAt ?? null,
    },
  })
}