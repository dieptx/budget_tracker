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
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import React, { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategory } from '@/app/(dashboard)/_actions/categories';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: ReactNode;
}

function CreateCategoryDialog({ type, successCallback, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      planAmount: 0,
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: '',
        icon: '',
        planAmount: 0,
        type,
      });

      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: 'create-category',
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: 'create-category',
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading('Creating category...', {
        id: 'create-category',
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
            className='flex border-separate items-center justify-start roudned-none border-b px-3 py-3 text-muted-foreground'
          >
            <PlusSquare className='mr-2 h-4 w-4' />
            Tạo mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tạo danh mục{' '}
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {type === 'income' ? 'thu nhập' : 'chi chí'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Các danh mục được sử dụng để nhóm các giao dịch
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
                    <Input placeholder='Tên danh mục' {...field} />
                  </FormControl>
                  <FormDescription>
                    Đây là cách danh mục của bạn sẽ xuất hiện trong ứng dụng
                    (bắt buộc)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='planAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền dự kiến</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={0}
                      type='number'
                      {...field}
                      value={+field.value}
                    />
                  </FormControl>
                  <FormDescription>Số tiền dự kiến (bắt buộc)</FormDescription>
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
                                Nhấp để thay đổi
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center gap-2'>
                              <CircleOff className='h-[48px] w-[48px]' />
                              <p className='text-xs text-muted-foreground'>
                                Nhấp để chọn
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
                    Đây là cách danh mục của bạn sẽ hiển thị trong ứng dụng(bắt
                    buộc)
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
            {!isPending && 'Tạo'}
            {isPending && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;
