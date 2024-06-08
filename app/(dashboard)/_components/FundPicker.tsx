'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Fund } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  onChange: (value?: Fund) => void;
}

function FundPicker({ onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Fund | undefined>();

  useEffect(() => {
    if (!value) return;
    // when the value changes, call onChange callback
    onChange(value);
  }, [onChange, value]);

  const fundsQuery = useQuery({
    queryKey: ['funds'],
    queryFn: () => fetch(`/api/funds`).then((res) => res.json()),
  });

  const selectedFund =
    fundsQuery.data?.find((fund: Fund) => fund.id === value?.id) ||
    fundsQuery.data?.[0];

  useEffect(() => {
    // when the value changes, call onChange callback
    if (fundsQuery.data?.length) {
      setValue(fundsQuery.data[0]);
    }
  }, [fundsQuery.data]);

  const successCallback = useCallback(
    (fund?: Fund) => {
      setValue(fund);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {selectedFund ? <FundRow fund={selectedFund} /> : 'Chọn quỹ'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder='Tìm kiếm quỹ...' />
          <CommandEmpty>
            <p>Không tìm thấy quỹ</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {fundsQuery.data &&
                fundsQuery.data.map((fund: Fund) => (
                  <CommandItem
                    key={fund.id}
                    className='flex justify-between'
                    onSelect={() => {
                      setValue(fund);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <FundRow fund={fund} />
                    <Check
                      className={cn(
                        'mr-2 w-4 h-4 opacity-0',
                        value?.id === fund.id && 'opacity-100'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FundPicker;

function FundRow({ fund }: { fund: Fund }) {
  return (
    <div className='flex items-center gap-2'>
      <span>{fund.name}</span>
    </div>
  );
}
