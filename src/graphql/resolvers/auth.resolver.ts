import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPrisma } from "../../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";
const prisma = getPrisma();

export default {
  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already registered");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      return { token, user };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });

      return { token, user };
    },
  },
};
