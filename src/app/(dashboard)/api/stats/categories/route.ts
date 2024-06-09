import prisma from '@/lib/prisma';
import { OverviewQuerySchema } from '@/schema/overview';
import { currentUser } from '@clerk/nextjs';
import { Return } from '@prisma/client/runtime/library';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const categoryNames = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
  const stats = await prisma.transaction.groupBy({
    by: ['type', 'categoryId'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  const result = stats.map((stat) => ({
    type: stat.type,
    categoryName:
      categoryNames.find((c) => c.id === stat.categoryId)?.name || null,
    categoryIcon:
      categoryNames.find((c) => c.id === stat.categoryId)?.icon || null,
    sum: stat?._sum?.amount || 0,
  }));

  return result;
}
