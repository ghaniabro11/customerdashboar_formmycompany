 import logger from "@/lib/logger/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Simulate user lookup (replace with DB query)
    const mockUser = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "123456", // In production, this would be hashed!
    };

    // 3️⃣ Check credentials
    if (email !== mockUser.email || password !== mockUser.password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4️⃣ Generate fake token (replace with real JWT)
    const token = `mock-token-${Date.now()}`;

    // 5️⃣ Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
      token,
    });
  } catch (error) {
    logger.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
