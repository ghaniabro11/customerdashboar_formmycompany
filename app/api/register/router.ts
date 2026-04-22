 import logger from "@/lib/logger/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Here you’d normally check if user already exists, hash password, and save
    const newUser = {
      id: "456",
      name: "New User",
      email,
    };

    const token = `mock-token-${Date.now()}`;

    return NextResponse.json({
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    logger.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
