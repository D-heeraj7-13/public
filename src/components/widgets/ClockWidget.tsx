"use client";

import { useEffect, useState } from "react";

interface ClockWidgetProps {
  timezone?: string; // e.g., 'UTC', 'Asia/Kolkata'
  format?: Intl.DateTimeFormatOptions;
}

export default function ClockWidget({ timezone = "UTC", format }: ClockWidgetProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone,
    ...format,
  };

  return (
    <div className="flex items-center justify-center h-32 text-3xl text-slate-100">
      {new Intl.DateTimeFormat(undefined, options).format(now)}
    </div>
  );
}
