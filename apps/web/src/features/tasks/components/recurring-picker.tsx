"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Input } from "@repo/ui/input";
import type { RecurringPattern } from "@/types/task";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type RecurringPickerProps = {
  value: RecurringPattern | undefined;
  onChange: (value: RecurringPattern | undefined) => void;
};

export function RecurringPicker({ value, onChange }: RecurringPickerProps) {
  const frequency = value?.frequency ?? "none";

  function handleFrequencyChange(freq: string) {
    if (freq === "none") {
      onChange(undefined);
      return;
    }

    const pattern: RecurringPattern = {
      frequency: freq as RecurringPattern["frequency"],
    };

    if (freq === "weekly") {
      pattern.daysOfWeek = value?.daysOfWeek ?? [];
    }

    if (freq === "custom") {
      pattern.interval = value?.interval ?? 1;
    }

    onChange(pattern);
  }

  function handleToggleDay(day: number) {
    if (!value) return;
    const current = value.daysOfWeek ?? [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort();
    onChange({ ...value, daysOfWeek: next });
  }

  function handleIntervalChange(interval: number) {
    if (!value) return;
    onChange({ ...value, interval: Math.max(1, interval) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="label text-foreground">Recurring</label>
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Biweekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "weekly" && (
        <div className="flex flex-col gap-1.5">
          <label className="label text-muted-foreground">Repeat on</label>
          <div className="flex gap-1">
            {DAY_LABELS.map((label, index) => {
              const selected = value?.daysOfWeek?.includes(index) ?? false;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleToggleDay(index)}
                  className={
                    selected
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
                      : "flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
                  }
                >
                  {label.charAt(0)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {frequency === "custom" && (
        <div className="flex items-center gap-2">
          <span className="label text-muted-foreground">Every</span>
          <Input
            id="recurring-interval"
            type="number"
            min={1}
            value={value?.interval ?? 1}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="label text-muted-foreground">days</span>
        </div>
      )}
    </div>
  );
}
