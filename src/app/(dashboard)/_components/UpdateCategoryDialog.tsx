'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  UpdateCategorySchema,
  UpdateCategorySchemaType,
} from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, Loader2, PencilLine } from 'lucide-react';
import React, { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '@/app/(dashboard)/_actions/categories';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Decimal } from '@prisma/client/runtime/library';

interface Props {
  category: Category;
  successCallback: (category: Category) => void;
  trigger?: ReactNode;
}

function UpdateCategoryDialog({ category, successCallback, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateCategorySchemaType & { planAmount: Decimal }>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: category,
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (data: Category) => {
      console.log('🚀 ~ onSuccess: ~ data:', data);
      form.reset();

      toast.success(`Cập nhật danh mục ${data.name} thành công 🎉`, {
        id: 'update-category',
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra', {
        id: 'update-category',
      });
    },
  });

  const onSubmit = useCallback(
    (values: UpdateCategorySchemaType) => {
      console.log('🚀 ~ UpdateCategoryDialog ~ values:', values);
      toast.loading('Đang cập nhật danh mục...', {
        id: 'update-category',
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={'ghost'}
            className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
          >
            <PencilLine />
            Sửa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Sửa danh mục
            <span
              className={cn(
                'm-1',
                category.type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {category.type === 'income' ? 'thu nhập' : 'chi phí'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Danh mục dùng để nhóm các giao dịch
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên danh mục' {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên danh mục hiển thị trên app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='planAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngân sách dự kiến</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type='number' {...field} />
                  </FormControl>
                  <FormDescription>Nhập ngân sách dự kiến</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className='h-[100px] w-full'
                        >
                          {form.watch('icon') ? (
                            <div className='flex flex-col items-center gap-2'>
                              <span className='text-5xl' role='img'>
                                {field.value}
                              </span>
                              <p className='text-xs text-muted-foreground'>
                                Click để thay đổi
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center gap-2'>
                              <CircleOff className='h-[48px] w-[48px]' />
                              <p className='text-xs text-muted-foreground'>
                                Click để chọn
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-full'>
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Icon đại diện cho danh mục hiển thị trên app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant={'secondary'}
              onClick={() => {
                form.reset();
              }}
            >
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && 'Lưu'}
            {isPending && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCategoryDialog;
