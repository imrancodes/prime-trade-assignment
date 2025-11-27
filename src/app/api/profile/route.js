import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import USER from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await USER.findById(decoded.id).select("-password");

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await USER.findByIdAndUpdate(
      decoded.id,
      { name },
      { new: true }
    ).select("-password");

    return NextResponse.json({ msg: "Profile updated", user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
