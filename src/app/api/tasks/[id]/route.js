import { connectDB } from "@/app/lib/db";
import { getCurrentUserId } from "@/app/lib/getCurrentUserId";
import TASK from "@/models/task";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { title, description, status } = await req.json();

    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = {};
    if (typeof body.title === "string") update.title = title;
    if (typeof body.description === "string") update.description = description;
    if (typeof body.status === "boolean") update.status = status;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const task = await TASK.findByIdAndUpdate({ _id: id, userId }, update, {
      new: true,
    });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const { id } = params;

    const deleted = await TASK.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
