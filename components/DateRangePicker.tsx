"use client";

import { useState, useEffect } from "react";

interface DateRangePickerProps {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
    minDate?: Date;
    blockedIntervals?: Array<{ start: Date; end: Date }>;
}

export default function DateRangePicker({ onDateChange, minDate, blockedIntervals = [] }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("09:00");
    const [endTime, setEndTime] = useState<string>("17:00");

    // Format date to YYYY-MM-DD for input
    const formatDateForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get minimum date (today or provided minDate)
    const getMinDate = (): string => {
        const min = minDate || new Date();
        return formatDateForInput(min);
    };

    useEffect(() => {
        if (!startDate || !endDate) {
            onDateChange(null, null);
            return;
        }

        // Combine date and time
        const start = new Date(`${startDate}T${startTime}:00`);
        const end = new Date(`${endDate}T${endTime}:00`);

        // Validate end is after start
        if (end <= start) {
            onDateChange(null, null);
            return;
        }

        onDateChange(start, end);
    }, [startDate, endDate, startTime, endTime]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // If end date is before new start date, clear it
        if (endDate && newStartDate > endDate) {
            setEndDate("");
        }
    };

    return (
        <div className="space-y-4">
            {/* Start Date & Time */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date & Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        min={getMinDate()}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
            </div>

            {/* End Date & Time */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    End Date & Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || getMinDate()}
                        disabled={!startDate}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    />
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={!startDate}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    />
                </div>
            </div>

            {/* Validation Message */}
            {startDate && endDate && startTime && endTime && (
                new Date(`${endDate}T${endTime}:00`) <= new Date(`${startDate}T${startTime}:00`)
            ) && (
                    <div className="text-red-400 text-sm">
                        End date/time must be after start date/time
                    </div>
                )}

            {/* Blocked Times Display */}
            {startDate && (() => {
                const selectedDate = new Date(startDate);
                // Adjust for timezone offset to compare dates correctly
                // actually startDate string is YYYY-MM-DD, so new Date(startDate) is UTC 00:00
                // but we want to compare with local date string

                const relevantBlocked = blockedIntervals.filter(interval => {
                    const start = interval.start;
                    const end = interval.end;

                    // Check if the interval overlaps with the selected day
                    // Simple check: does the interval start or end on this day?
                    // Or does it span across this day?

                    const dayStart = new Date(`${startDate}T00:00:00`);
                    const dayEnd = new Date(`${startDate}T23:59:59`);

                    return (start < dayEnd && end > dayStart);
                });

                if (relevantBlocked.length === 0) return null;

                return (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm font-medium mb-1">Unavailable Times on {startDate}:</p>
                        <ul className="text-xs text-red-300 space-y-1">
                            {relevantBlocked.map((interval, idx) => (
                                <li key={idx}>
                                    {interval.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {interval.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })()}
        </div>
    );
}
