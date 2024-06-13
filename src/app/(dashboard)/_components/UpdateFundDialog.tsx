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
import { cn } from '@/lib/utils';
import { UpdateFundSchema, UpdateFundSchemaType } from '@/schema/funds';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleOff, Loader2, PencilLine } from 'lucide-react';
import React, { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFund } from '@/app/(dashboard)/_actions/funds';
import { Fund } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Decimal } from '@prisma/client/runtime/library';

interface Props {
  fund: Fund;
  successCallback: (fund: Fund) => void;
  trigger?: ReactNode;
}

function UpdateFundDialog({ fund, successCallback, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateFundSchemaType & { budget: Decimal }>({
    resolver: zodResolver(UpdateFundSchema),
    defaultValues: fund,
  });

  const queryClient = useQueryClient();
  const theme = useTheme();
  console.log('🚀 ~ onSuccess: ~ form:', form.formState.errors);

  const { mutate, isPending } = useMutation({
    mutationFn: updateFund,
    onSuccess: async (data: Fund) => {
      console.log('🚀 ~ onSuccess: ~ data:', data);
      form.reset();

      toast.success(`Cập nhật quỹ ${data.name} thành công 🎉`, {
        id: 'update-fund',
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ['funds'],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra', {
        id: 'update-fund',
      });
    },
  });

  const onSubmit = useCallback(
    (values: UpdateFundSchemaType) => {
      console.log('🚀 ~ UpdateFundDialog ~ values:', values);
      toast.loading('Đang cập nhật quỹ...', {
        id: 'update-fund',
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
          <DialogTitle>Sửa {fund.name}</DialogTitle>
          <DialogDescription>
            Quỹ dùng để quản lý tài chính của bạn
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
                    <Input placeholder='Nhập tên quỹ' {...field} />
                  </FormControl>
                  <FormDescription>Tên quỹ hiển thị trên app</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='targetAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền mục tiêu</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={0}
                      type='number'
                      {...field}
                      value={+field.value}
                    />
                  </FormControl>
                  <FormDescription>Nhập ngân sách của quỹ</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='currentAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền hiện tại</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={0}
                      type='number'
                      {...field}
                      value={+field.value}
                    />
                  </FormControl>
                  <FormDescription>Nhập ngân sách của quỹ</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập mô tả quỹ' {...field} />
                  </FormControl>
                  <FormDescription>Mô tả quỹ hiển thị trên app</FormDescription>
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

export default UpdateFundDialog;
