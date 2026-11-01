'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  namaKegiatan?: string;
  tanggal?: string;
  lokasi?: string;
  status?: string;
  [key: string]: any;
}

interface MonthCalendarProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function MonthCalendar({ events, onSelectEvent }: MonthCalendarProps) {
  // Default to October 2026 as per prototype time context
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid cells
  const days = [];
  // Sunday (0) to Saturday (6). Let's use Monday (1) as start of week or Sunday. In Indonesia standard: Senin - Minggu.
  // Let's use Senin - Minggu:
  // Offset: 0 for Monday, ..., 6 for Sunday
  const startOffset = (firstDay + 6) % 7;

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  // Map events to date strings YYYY-MM-DD
  const getEventsForDay = (day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDateStr = `${year}-${monthStr}-${dayStr}`;

    return events.filter((e) => e.tanggal === targetDateStr);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 md:px-6 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#1E3A8A]" />
          <h3 className="text-lg font-bold text-[#0F172A]">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
            className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] min-h-[34px] min-w-[34px] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
            className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] min-h-[34px] min-w-[34px] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container (Scrollable on HP to maintain legibility) */}
      <div className="overflow-x-auto">
        <div className="min-w-[620px] md:min-w-0">
          {/* Weekday Labels (Senin s/d Minggu) */}
          <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F1F5F9] text-center text-xs font-bold text-[#475569] py-2.5">
            <div>Senin</div>
            <div>Selasa</div>
            <div>Rabu</div>
            <div>Kamis</div>
            <div>Jumat</div>
            <div className="text-[#B91C1C]">Sabtu</div>
            <div className="text-[#B91C1C]">Minggu</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E2E8F0]">
            {days.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[90px] sm:min-h-[105px] p-1.5 sm:p-2 bg-[#F8FAFC]/50"
                  />
                );
              }

              const dayEvents = getEventsForDay(day);
              const isToday = day === 16 && month === 9 && year === 2026;

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[90px] sm:min-h-[105px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors hover:bg-[#F8FAFC] ${
                    isToday ? 'bg-[#EFF6FF]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#1E3A8A] bg-[#DBEAFE] px-1.5 py-0.5 rounded-full">
                        {dayEvents.length} Giat
                      </span>
                    )}
                  </div>

                  {/* Event Pills */}
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className="w-full text-left p-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors block text-xs group"
                      >
                        <p className="font-semibold text-[#1E3A8A] line-clamp-1 group-hover:text-[#2563EB]">
                          {evt.namaKegiatan}
                        </p>
                        {evt.lokasi && (
                          <p className="text-[10px] text-[#64748B] line-clamp-1 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{evt.lokasi}</span>
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
