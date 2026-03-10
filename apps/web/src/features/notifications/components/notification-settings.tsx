"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/card";

type NotificationPreferences = {
  overdueReminders: boolean;
  dueTodayAlerts: boolean;
  dueSoonAlerts: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
};

const defaultPreferences: NotificationPreferences = {
  overdueReminders: true,
  dueTodayAlerts: true,
  dueSoonAlerts: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
};

const STORAGE_KEY = "homebase-notification-preferences";

function loadPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return defaultPreferences;
}

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(defaultPreferences);

  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  function updatePref<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which notifications you receive.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.overdueReminders}
              onChange={(e) =>
                updatePref("overdueReminders", e.target.checked)
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Overdue reminders
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified when tasks are past due
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.dueTodayAlerts}
              onChange={(e) =>
                updatePref("dueTodayAlerts", e.target.checked)
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Due today alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified about tasks due today
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.dueSoonAlerts}
              onChange={(e) =>
                updatePref("dueSoonAlerts", e.target.checked)
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Due soon alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified about tasks due in the next 3 days
              </p>
            </div>
          </label>

          <div className="border-t border-border pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.quietHoursEnabled}
                onChange={(e) =>
                  updatePref("quietHoursEnabled", e.target.checked)
                }
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Quiet hours
                </p>
                <p className="text-xs text-muted-foreground">
                  Mute notifications during certain hours
                </p>
              </div>
            </label>
            {prefs.quietHoursEnabled && (
              <div className="mt-3 flex items-center gap-2 pl-7">
                <input
                  type="time"
                  value={prefs.quietHoursStart}
                  onChange={(e) =>
                    updatePref("quietHoursStart", e.target.value)
                  }
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="time"
                  value={prefs.quietHoursEnd}
                  onChange={(e) =>
                    updatePref("quietHoursEnd", e.target.value)
                  }
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
