import connectToDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDB();

    const { valid, decoded, message } = verifyToken(req);

    if (!valid) {
      return res.status(401).json({ message });
    }

    const user = await User.findById(decoded.userId).select("-password"); // password hide
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Me Route Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}
