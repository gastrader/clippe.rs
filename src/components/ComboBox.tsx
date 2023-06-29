import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command";
import { cn } from "@/lib/utils";
import { useState } from "react";

const frameworks = [
  {
    value: "drama",
    label: "Drama",
  },
  {
    value: "scary",
    label: "Scary",
  },
  {
    value: "loud",
    label: "Loud",
  },
  {
    value: "spoiler",
    label: "Spoiler",
  },
  {
    value: "extreme",
    label: "Extreme",
  },
  {
    value: "sports",
    label: "Sports",
  },
  {
    value: "nsfw",
    label: "NSFW",
  },
];

export function Combobox({ onChange, value }: any) {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select a tag..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tag..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup className="h-[160px] overflow-y-auto">
            {frameworks.map((framework) => (
              <CommandItem key={framework.value} onSelect={handleSelect}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
