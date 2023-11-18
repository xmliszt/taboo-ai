import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isMobile } from 'react-device-detect';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortType } from '@/lib/utils/levelUtils';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
      <div className='flex flex-row gap-4 items-center'>
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
          <SelectContent className='w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)]'>
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
      <div className='mt-4 flex flex-row justify-between items-center'>
        <Badge className='shadow-[0_5px_10px_rgba(0,0,0,0.3)]'>
          {searchTerm && searchTerm.length > 0
            ? `Found ${topicNumber} topics`
            : `Total ${topicNumber} topics`}
        </Badge>
        <div className='flex flex-row gap-2 items-center'>
          <Switch
            id='ranking-mode-switch'
            className={cn(
              isRankingModeOn
                ? 'shadow-[0_5px_10px_rgba(0,0,0,0.3)]'
                : 'shadow-none'
            )}
            checked={isRankingModeOn}
            onCheckedChange={(checked) => {
              setIsRankingModeOn(checked);
              onRankingModeChange && onRankingModeChange(checked);
            }}
          />
          <Label
            htmlFor='ranking-mode-switch'
            className={cn(
              isRankingModeOn
                ? 'text-primary font-bold'
                : 'text-muted-foreground font-light'
            )}
          >
            Ranking Mode
          </Label>
        </div>
      </div>
    </>
  );
}
