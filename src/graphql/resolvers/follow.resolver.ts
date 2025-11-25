import { getPrisma } from "../../prisma";
import { requireAuth } from "../utils/authGuard";

const prisma = getPrisma();

export default {
  Mutation: {
    followUser: async (_: any, { userId }: any, ctx: any) => {
      requireAuth(ctx);

      const followerId = ctx.currentUser.id;

      if (followerId === userId) {
        throw new Error("You cannot follow yourself");
      }

      await prisma.follow.create({
        data: {
          followerId,
          followingId: userId,
        },
      });

      return true;
    },

    unfollowUser: async (_: any, { userId }: any, ctx: any) => {
      requireAuth(ctx);

      const followerId = ctx.currentUser.id;

      await prisma.follow.deleteMany({
        where: {
          followerId,
          followingId: userId,
        },
      });

      return true;
    },
  },

  Query: {
    followers: async (_: any, { userId }: any) => {
      const rows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: true },
      });

      return rows.map((r) => r.follower);
    },

    following: async (_: any, { userId }: any) => {
      const rows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: true },
      });

      return rows.map((r) => r.following);
    },
  },
};
