import { prisma } from "../../prisma";
import { requireAuth } from "../utils/authGuard";

export default {
  Mutation: {
    createPost: async (_: any, { content, media }: any, ctx: any) => {
      requireAuth(ctx);
      const authorId = ctx.currentUser.id;

      const post = await prisma.post.create({
        data: {
          content,
          media,
          authorId,
        },
      });

      return post;
    },

    updatePost: async (_: any, { id, content, media }: any, ctx: any) => {
      requireAuth(ctx);
      const userId = ctx.currentUser.id;

      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) throw new Error("Post not found");
      if (post.authorId !== userId)
        throw new Error("You can update only your own posts");

      const updated = await prisma.post.update({
        where: { id },
        data: {
          content: content ?? post.content,
          media: media ?? post.media,
        },
      });

      return updated;
    },

    deletePost: async (_: any, { id }: any, ctx: any) => {
      requireAuth(ctx);
      const userId = ctx.currentUser.id;

      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) throw new Error("Post not found");
      if (post.authorId !== userId)
        throw new Error("Cannot delete another user's post");

      await prisma.post.delete({ where: { id } });
      return true;
    },
  },

  Query: {
    postsByUser: async (_: any, { userId, limit = 20, cursor }: any) => {
      return prisma.post.findMany({
        where: { authorId: userId },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { id: "desc" },
        take: limit,
      });
    },

    feed: async (_: any, { limit = 20, cursor }: any, ctx: any) => {
      requireAuth(ctx);
      const userId = ctx.currentUser.id;

      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);
      followingIds.push(userId);

      return prisma.post.findMany({
        where: {
          authorId: { in: followingIds },
        },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { id: "desc" },
        take: limit,
      });
    },
  },

  Post: {
    author: async (parent: any) => {
      return prisma.user.findUnique({ where: { id: parent.authorId } });
    },
  },
};
