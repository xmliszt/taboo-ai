import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SortType } from '@/lib/utils/levelUtils';

type SortItem = {
  value: SortType;
  label: string;
};

const sorters: SortItem[] = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'create-old', label: 'Oldest First' },
  { value: 'create-new', label: 'Newest First' },
  { value: 'most-popular', label: 'Most Popular First' },
  { value: 'least-popular', label: 'Least Popular First' },
  { value: 'easy-first', label: 'Easiest First' },
  { value: 'hard-first', label: 'Hardest First' },
];

export default function LevelsSearchBar({
  topicNumber,
  setFilterKeyword,
  onSorterChange,
  onRankingModeChange,
}: {
  topicNumber: number;
  setFilterKeyword: React.Dispatch<React.SetStateAction<string>>;
  onSorterChange?: (sorter: SortType) => void;
  onRankingModeChange?: (isRankingModeOn: boolean) => void;
}) {
  const [isRankingModeOn, setIsRankingModeOn] = useState(false);
  const [selectedSorter, setSelectedSorter] = useState<SortType>('create-new');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const clearSearch = () => {
    setSearchTerm('');
    setFilterKeyword('');
  };

  return (
    <>
      <div className='flex flex-row items-center gap-4'>
        <Select
          value={selectedSorter}
          onValueChange={(value) => {
            setSelectedSorter(value as SortType);
            onSorterChange && onSorterChange(value as SortType);
          }}
        >
          <SelectTrigger className='w-[250px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]'>
            <SelectGroup>
              <SelectLabel>Sort Topics</SelectLabel>
              {sorters.map((sorter) => (
                <SelectItem key={sorter.value} value={sorter.value}>
                  {sorter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className='w-full !text-sm'
          placeholder='Search by name/author'
          value={searchTerm}
          type='text'
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilterKeyword(e.target.value);
          }}
        />
        {!isMobile && searchTerm.length > 0 && (
          <Button className='animate-fade-in' onClick={clearSearch}>
            Clear
          </Button>
        )}
      </div>
      <div className='mt-4 flex flex-row items-center justify-between'>
        <Badge className='shadow-[0_5px_10px_rgba(0,0,0,0.3)]'>
          {searchTerm && searchTerm.length > 0
            ? `Found ${topicNumber} topics`
            : `Total ${topicNumber} topics`}
        </Badge>
        <div className='flex flex-row items-center gap-2'>
          <Switch
            id='ranking-mode-switch'
            className={cn(isRankingModeOn ? 'shadow-[0_5px_10px_rgba(0,0,0,0.3)]' : 'shadow-none')}
            checked={isRankingModeOn}
            onCheckedChange={(checked) => {
              setIsRankingModeOn(checked);
              onRankingModeChange && onRankingModeChange(checked);
            }}
          />
          <Label
            htmlFor='ranking-mode-switch'
            className={cn(
              isRankingModeOn ? 'font-bold text-primary' : 'font-light text-muted-foreground'
            )}
          >
            Ranking Mode
          </Label>
        </div>
      </div>
    </>
  );
}
