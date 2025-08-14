import { Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

const COLORS = [
  { id: 'blue', bg: 'bg-blue-500' },
  { id: 'green', bg: 'bg-green-500' },
  { id: 'red', bg: 'bg-red-500' },
  { id: 'yellow', bg: 'bg-yellow-500' },
  { id: 'purple', bg: 'bg-purple-500' },
  { id: 'orange', bg: 'bg-orange-500' },
  { id: 'pink', bg: 'bg-pink-500' },
  { id: 'gray', bg: 'bg-gray-500' },
  { id: 'indigo', bg: 'bg-indigo-500' },
  { id: 'teal', bg: 'bg-teal-500' },
  { id: 'cyan', bg: 'bg-cyan-500' },
  { id: 'lime', bg: 'bg-lime-500' },
  { id: 'amber', bg: 'bg-amber-500' },
  { id: 'emerald', bg: 'bg-emerald-500' },
  { id: 'violet', bg: 'bg-violet-500' },
  { id: 'rose', bg: 'bg-rose-500' },
  { id: 'slate', bg: 'bg-slate-500' },
  { id: 'zinc', bg: 'bg-zinc-500' },
  { id: 'neutral', bg: 'bg-neutral-500' },
  { id: 'stone', bg: 'bg-stone-500' },
  { id: 'sky', bg: 'bg-sky-500' },
  { id: 'fuchsia', bg: 'bg-fuchsia-500' }
];

export const ColorPicker = ({ color, onColorChange }: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tag className="h-4 w-4" />
      <Select onValueChange={onColorChange} value={color}>
        <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
          <SelectValue placeholder="Color">
            {color && (
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${COLORS.find(c => c.id === color)?.bg || 'bg-gray-500'}`} />
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-border bg-popover dark:bg-neutral-900">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2">Select Color</div>
            <div className="grid grid-cols-9 gap-2">
              {COLORS.map((colorOption) => (
                <div
                  key={colorOption.id}
                  className="flex items-center justify-center"
                  onClick={() => onColorChange(colorOption.id)}
                >
                  <div
                    className={`h-5 w-5 rounded-full cursor-pointer transition-all duration-150 hover:scale-110 ${colorOption.bg} ${
                      color === colorOption.id 
                        ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-neutral-950' 
                        : 'ring-1 ring-neutral-300 dark:ring-neutral-600 hover:ring-neutral-400 dark:hover:ring-white/60'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
