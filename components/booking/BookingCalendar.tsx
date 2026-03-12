import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface BookingCalendarProps {
    onSelectSlot: (date: Date, time: string) => void;
    selectedDate: Date | null;
    selectedTime: string | null;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onSelectSlot, selectedDate, selectedTime }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const [duration, setDuration] = useState('60'); // Default to 60 min

    useEffect(() => {
        const days = [];
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        for (let i = 0; i < startOfMonth.getDay(); i++) {
            const day = new Date(startOfMonth);
            day.setDate(startOfMonth.getDate() - (startOfMonth.getDay() - i));
            days.push(day);
        }

        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        setCalendarDays(days);
    }, [currentDate]);

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getTimeSlots = (date: Date) => {
        let baseISTTimes: string[] = [];
        if (duration === '30') {
            baseISTTimes = [
                "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
            ];
        } else if (duration === '90') {
            baseISTTimes = [
                "09:00 AM", "10:30 AM", "12:00 PM",
                "02:00 PM", "03:30 PM", "05:00 PM"
            ];
        } else {
            // Default 60 min
            baseISTTimes = [
                "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
            ];
        }

        const slots = [];
        for (const offset of [-1, 0, 1]) {
            const d = new Date(date);
            d.setDate(d.getDate() + offset);

            for (const timeStr of baseISTTimes) {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                let h = parseInt(hours, 10);
                if (modifier === 'PM' && h < 12) h += 12;
                if (modifier === 'AM' && h === 12) h = 0;

                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const dt = String(d.getDate()).padStart(2, '0');
                const hh = String(h).padStart(2, '0');
                const mm = minutes.padStart(2, '0');

                const isoString = `${y}-${m}-${dt}T${hh}:${mm}:00+05:30`;
                const absoluteDate = new Date(isoString);

                if (
                    absoluteDate.getDate() === date.getDate() &&
                    absoluteDate.getMonth() === date.getMonth() &&
                    absoluteDate.getFullYear() === date.getFullYear()
                ) {
                    slots.push({
                        formatted: absoluteDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        absoluteDate
                    });
                }
            }
        }

        return slots.sort((a, b) => a.absoluteDate.getTime() - b.absoluteDate.getTime()).map(s => s.formatted);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 font-poppins h-full">
            {/* Calendar Grid */}
            <div className="flex-1">
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6 font-poppins">Select Date</h3>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-stone-100">
                        <h4 className="text-lg font-semibold text-slate-700">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-2 rounded-full hover:bg-black/5 text-stone-500 hover:text-stone-900 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-2 rounded-full hover:bg-black/5 text-stone-500 hover:text-stone-900 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-stone-400 uppercase tracking-widest py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            const isSelected = selectedDate && isSameDay(date, selectedDate);
                            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                            const isPast = isPastDate(date);
                            const isDisabled = !isCurrentMonth || isPast;

                            return (
                                <button
                                    key={index}
                                    onClick={() => onSelectSlot(date, '')}
                                    disabled={isDisabled}
                                    className={`
                                        relative h-12 w-12 mx-auto rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                        ${isDisabled ? 'text-slate-200 pointer-events-none' : ''}
                                        ${!isDisabled && !isSelected ? 'text-slate-700 hover:bg-stone-50' : ''}
                                        ${isSelected ? 'bg-black text-white shadow-xl shadow-stone-200' : ''}
                                        ${isToday(date) && !isSelected ? 'text-black font-bold underline decoration-2 underline-offset-4' : ''}
                                    `}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-96 flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-slate-800 font-poppins not-italic">Select Time</h4>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-lg outline-none focus:border-black transition-colors cursor-pointer"
                    >
                        <option value="30">30 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 mb-6">
                    {selectedDate ? (
                        getTimeSlots(selectedDate).map((time, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectSlot(selectedDate, time)}
                                className={`
                                    h-14 rounded-xl flex items-center justify-center text-sm font-medium transition-all border
                                    ${selectedTime === time
                                        ? 'bg-black text-white border-black shadow-lg shadow-stone-200'
                                        : 'bg-stone-50/30 border-stone-100 text-slate-600 hover:border-stone-300'}
                                `}
                            >
                                {time}
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                            <Clock className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs text-center">Select a date to view available slots</p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-auto bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold ml-[-1px]">!</span>
                    </div>
                    <p className="text-xs text-orange-800 font-medium">
                        All times are shown in your local time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingCalendar;
