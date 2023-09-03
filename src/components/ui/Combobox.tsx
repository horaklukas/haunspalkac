"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/Command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";

const normalizeValue = (value: string) => value.toLowerCase().trim();

interface ComboboxProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export function Combobox({ value, onChange, options, placeholder }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const optionsMapByLabel = React.useMemo(() => {
        const map = new Map<string, string>();

        options.forEach(({ value, label }) => map.set(normalizeValue(label), value));

        return map;
    }, [options]);

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
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search option..." />
                    <CommandEmpty>No team found.</CommandEmpty>
                    <CommandGroup className="max-h-80 overflow-y-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={(selectedLabel) => {
                                    const currentValue = optionsMapByLabel.get(selectedLabel);

                                    onChange(!currentValue || currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
