'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionType } from '@/lib/types';
import { ReactNode, useCallback, useState } from 'react';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import FundPicker from './FundPicker';
import { Fund } from '@prisma/client';
import {
  DistributeIncomeSchema,
  DistributeIncomeSchemaType,
} from '@/schema/income';
import { distributeIncome } from '../_actions/income';

interface Props {
  trigger: ReactNode;
}

function DistributeIncomeDialog({ trigger }: Props) {
  const form = useForm<DistributeIncomeSchemaType>({
    resolver: zodResolver(DistributeIncomeSchema),
    defaultValues: {
      fund: {},
    },
  });
  const [open, setOpen] = useState(false);

  const handleFundChange = useCallback(
    (value?: Fund) => {
      if (value) {
        form.setValue('fund', value);
      } else {
        console.log('Please select fund');
      }
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: distributeIncome,
    onSuccess: () => {
      toast.success(
        `Đã phân bổ thành công ${form.getValues('amount')} vào ${form.getValues(
          'fund.name'
        )} 🎉`,
        {
          id: 'distributed-income',
        }
      );

      form.reset();

      // After creating a transaction, we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ['overview'],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: DistributeIncomeSchemaType) => {
      toast.loading('Distributing income...', { id: 'distribute-income' });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân bổ thu nhập</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col'>
              <FormField
                control={form.control}
                name='fund'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quỹ</FormLabel>
                    <FormControl>
                      <FundPicker onChange={handleFundChange} />
                    </FormControl>
                    <FormDescription>Chọn một quỹ cần phân bổ</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền</FormLabel>
                    <FormControl>
                      <Input defaultValue={0} type='number' {...field} />
                    </FormControl>
                    <FormDescription>
                      Số tiền phân bổ (required)
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
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
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && 'Phân bổ'}
            {isPending && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DistributeIncomeDialog;
