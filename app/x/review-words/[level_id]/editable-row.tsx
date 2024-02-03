'use client';

import { HTMLInputTypeAttribute, useId, useState } from 'react';
import { Edit, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type EditableRowProps = {
  title: string;
  value: string;
  onSubmit: (formData: FormData) => void;
  type?: HTMLInputTypeAttribute;
  onDelete?: (value: string) => void;
  disabled?: boolean;
};

export function EditableRow(props: EditableRowProps) {
  const id = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(props.value);
  if (isEditing) {
    return (
      <form
        action={(formData) => {
          setIsEditing(false);
          props.onSubmit(formData);
        }}
        className={'flex flex-row items-center justify-between hover:bg-secondary'}
      >
        <Label htmlFor={id}>{props.title}</Label>
        <div className={'flex flex-row items-center gap-2'}>
          <Input
            autoFocus
            className={'h-4 flex-grow rounded-none !text-[12px]'}
            id={id}
            name={'value'}
            type={props.type ?? 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={props.disabled}
            size={'sm'}
            variant={'outline'}
            className={'h-6 rounded-none'}
            type={'submit'}
          >
            <Save size={15} />
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className={'flex flex-row items-center justify-between hover:bg-secondary'}>
      {props.title}
      <div className={'flex flex-row items-center gap-2'}>
        {props.value}
        <Button
          disabled={props.disabled}
          size={'sm'}
          variant={'outline'}
          className={'h-6 rounded-none'}
          onClick={() => setIsEditing(true)}
        >
          <Edit size={15} />
        </Button>
        {props.onDelete && (
          <Button
            disabled={props.disabled}
            size={'sm'}
            variant={'destructive'}
            className={'h-6 rounded-none'}
            onClick={() => props.onDelete!(value)}
          >
            <Trash2 size={15} />
          </Button>
        )}
      </div>
    </div>
  );
}
