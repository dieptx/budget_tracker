'use server';

import prisma from '@/lib/prisma';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
  UpdateCategorySchema,
  UpdateCategorySchemaType,
} from '@/schema/categories';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('Bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const result = await prisma.category.create({
    data: parsedBody.data,
  });

  try {
    prisma.categoryHistory.create({
      data: {
        categoryId: result.id,
        categoryName: parsedBody.data.name,
        amount: parsedBody.data.planAmount,
      },
    });
  } catch (error) {
    console.log('🚀 ~ [LOG] Can not create category history ~ error:', error);
  }

  return result;
}

export async function updateCategory(form: UpdateCategorySchemaType) {
  const parsedBody = UpdateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { name, icon, id, planAmount } = parsedBody.data;
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      icon,
      planAmount,
    },
  });
  console.log('🚀 ~ updateCategory ~ parsedBody.data:', parsedBody.data);

  try {
    await prisma.categoryHistory.create({
      data: {
        categoryId: id,
        categoryName: name,
        amount: planAmount,
      },
    });
  } catch (error) {
    console.log('🚀 ~ [LOG] Can not create category history ~ error:', error);
  }
  return result;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return await prisma.category.delete({
    where: {
      name_type: {
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
