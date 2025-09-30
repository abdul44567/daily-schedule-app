// lib/auth.ts
import connectToDB from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  try {
    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { user: { id: user._id, name: user.name, email: user.email } };
  } catch (err: any) {
    return { error: err.message };
  }
}
