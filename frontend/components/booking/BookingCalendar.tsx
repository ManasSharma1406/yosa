import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Trash2 } from 'lucide-react';

export interface SelectedSlot {
    date: Date;
    time: string;
}

interface BookingCalendarProps {
    selectedSlots: SelectedSlot[];
    onSelectSlot: (slots: SelectedSlot[]) => void;
    maxSelections?: number;
    darkMode?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedSlots = [], onSelectSlot, maxSelections = 1, darkMode = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const [activeDate, setActiveDate] = useState<Date | null>(selectedSlots.length > 0 ? selectedSlots[0].date : new Date());

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

    const isFriday = (date: Date) => {
        return date.getDay() === 5;
    };

    const hasSelectedSlotOnDate = (date: Date) => {
        return selectedSlots.some(slot => isSameDay(slot.date, date));
    };

    const handleDateClick = (date: Date) => {
        setActiveDate(date);
    };

    const handleTimeSlotClick = (time: string) => {
        if (!activeDate) return;

        const isAlreadySelected = selectedSlots.some(
            slot => isSameDay(slot.date, activeDate) && slot.time === time
        );

        if (isAlreadySelected) {
            onSelectSlot(selectedSlots.filter(
                slot => !(isSameDay(slot.date, activeDate) && slot.time === time)
            ));
        } else {
            if (selectedSlots.length < maxSelections) {
                onSelectSlot([...selectedSlots, { date: activeDate, time }]);
            } else {
                alert(`You can only select up to ${maxSelections} sessions based on your current plan.`);
            }
        }
    };

    const removeSlot = (slotToRemove: SelectedSlot) => {
        onSelectSlot(selectedSlots.filter(
            slot => !(isSameDay(slot.date, slotToRemove.date) && slot.time === slotToRemove.time)
        ));
    };

    const getTimeSlots = (date: Date) => {
        // Generate slots every 30 minutes from 6:00 AM to 8:30 PM
        const baseISTTimes: string[] = [];
        for (let h = 6; h <= 20; h++) {
            for (let m = 0; m <= 30; m += 30) {
                if (h === 20 && m > 30) continue; // Stops at 8:30 PM
                const ampm = h >= 12 ? 'PM' : 'AM';
                const displayH = h > 12 ? h - 12 : h;
                const displayM = m === 0 ? '00' : '30';
                baseISTTimes.push(`${String(displayH).padStart(2, '0')}:${displayM} ${ampm}`);
            }
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

    if (darkMode) {
        // ── DARK MODE (Dashboard & Popup) ──────────────────────────────────────
        return (
            <div className="flex flex-col xl:flex-row gap-8 font-poppins h-full">
                {/* Calendar Grid – Dark */}
                <div className="flex-1 max-w-lg mx-auto xl:mx-0 w-full">
                    <div className="mb-6">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-semibold text-white/80">
                                {maxSelections > 1 && (
                                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full mr-3">
                                        {selectedSlots.length} / {maxSelections} Selected
                                    </span>
                                )}
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Day labels */}
                        <div className="grid grid-cols-7 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-[11px] font-semibold text-white/30 uppercase tracking-widest py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date, index) => {
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const isPast = isPastDate(date);
                                const isFridayLocked = isFriday(date);
                                const isDisabled = !isCurrentMonth || isPast || isFridayLocked;
                                const isActive = activeDate && isSameDay(date, activeDate);
                                const hasSelection = hasSelectedSlotOnDate(date);
                                const todayDate = isToday(date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isDisabled && handleDateClick(date)}
                                        disabled={isDisabled}
                                        className={`
                                            relative h-10 w-10 mx-auto rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                            ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                                            ${isCurrentMonth && isPast && !isFridayLocked ? 'text-white/20 pointer-events-none' : ''}
                                            ${isFridayLocked && isCurrentMonth
                                                ? 'pointer-events-none'
                                                : ''}
                                            ${!isDisabled && !isActive && !hasSelection ? 'text-white/70 hover:bg-white/10 hover:text-white' : ''}
                                            ${isActive && !hasSelection ? 'bg-white/15 text-white border border-white/30' : ''}
                                            ${hasSelection ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : ''}
                                            ${todayDate && !isActive && !hasSelection ? 'text-indigo-400 font-bold' : ''}
                                        `}
                                        style={isFridayLocked && isCurrentMonth ? {
                                            background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 6px)',
                                            color: 'rgba(255,255,255,0.2)'
                                        } : {}}
                                    >
                                        {isCurrentMonth ? date.getDate() : ''}
                                        {hasSelection && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-black/40" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-3 text-[11px] text-white/30 text-center">* Fridays are unavailable for booking.</p>
                    </div>
                </div>

                {/* Time Slots – Dark */}
                <div className="w-full xl:flex-1 flex flex-col gap-5">
                    <div>
                        <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-widest">
                            Select Time
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                            {activeDate ? (
                                getTimeSlots(activeDate).map((time, index) => {
                                    const isSelected = selectedSlots.some(
                                        slot => isSameDay(slot.date, activeDate) && slot.time === time
                                    );
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleTimeSlotClick(time)}
                                            className={`
                                                h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-all border relative overflow-hidden group
                                                ${isSelected
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white'}
                                            `}
                                        >
                                            <span className={`relative z-10 ${isSelected ? 'group-hover:hidden' : ''}`}>{time}</span>
                                            {isSelected && (
                                                <span className="absolute inset-0 bg-red-600 text-white flex items-center justify-center font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Remove
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-white/30">
                                    <Clock className="w-6 h-6 mb-2 opacity-30" />
                                    <p className="text-xs text-center">Select a date to view slots</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Slots List */}
                    {selectedSlots.length > 0 && (
                        <div className="flex-1 flex flex-col bg-white/5 rounded-2xl p-4 border border-white/10">
                            <h4 className="font-semibold text-white/60 text-xs tracking-widest uppercase mb-3">Selected Sessions</h4>
                            <div className="flex-1 overflow-y-auto max-h-40 space-y-2 pr-1">
                                {selectedSlots.map((slot, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white/80 text-xs">
                                                    {slot.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-[11px] text-white/40">{slot.time}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeSlot(slot)}
                                            className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!selectedSlots.length && (
                        <div className="mt-auto bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 flex items-center gap-3">
                            <div className="w-7 h-7 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-400 font-bold text-xs">!</span>
                            </div>
                            <p className="text-xs text-indigo-200/70 font-medium leading-relaxed">
                                Times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── LIGHT MODE (default, used in modals etc.) ──────────────────────────────
    return (
        <div className="flex flex-col xl:flex-row gap-8 font-poppins h-full">
            {/* Calendar Grid */}
            <div className="flex-1 max-w-lg mx-auto xl:mx-0 w-full">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-slate-800 font-poppins">Select Date(s)</h3>
                        {maxSelections > 1 && (
                            <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full shadow-md">
                                {selectedSlots.length} / {maxSelections} Selected
                            </span>
                        )}
                    </div>

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
                            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                            const isPast = isPastDate(date);
                            const isFridayLocked = isFriday(date);
                            const isDisabled = !isCurrentMonth || isPast || isFridayLocked;
                            const isActive = activeDate && isSameDay(date, activeDate);
                            const hasSelection = hasSelectedSlotOnDate(date);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(date)}
                                    disabled={isDisabled}
                                    className={`
                                        relative h-12 w-12 mx-auto rounded-xl flex items-center justify-center text-sm font-medium transition-all
                                        ${isDisabled ? 'text-slate-200 pointer-events-none' : ''}
                                        ${!isDisabled && !isActive && !hasSelection ? 'text-slate-700 hover:bg-stone-50' : ''}
                                        ${isActive && !hasSelection ? 'bg-stone-100 text-black border-2 border-black' : ''}
                                        ${hasSelection ? 'bg-black text-white shadow-xl shadow-stone-200' : ''}
                                        ${isToday(date) && !isActive && !hasSelection ? 'text-black font-bold underline decoration-2 underline-offset-4' : ''}
                                        ${isFridayLocked && isCurrentMonth ? 'line-through text-stone-300' : ''}
                                    `}
                                >
                                    {date.getDate()}
                                    {hasSelection && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-4 text-xs text-stone-500 text-center font-medium opacity-80">* Fridays are unavailable for booking.</p>
                </div>
            </div>

            {/* Time Selection & Slots Overview */}
            <div className="w-full xl:flex-1 flex flex-col gap-6">
                <div>
                    <div className="mb-4">
                        <h4 className="text-xl font-semibold text-slate-800 font-poppins not-italic">
                            Select Time
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {activeDate ? (
                            getTimeSlots(activeDate).map((time, index) => {
                                const isSelected = selectedSlots.some(
                                    slot => isSameDay(slot.date, activeDate) && slot.time === time
                                );
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleTimeSlotClick(time)}
                                        className={`
                                            h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all border relative overflow-hidden group
                                            ${isSelected
                                                ? 'bg-black text-white border-black shadow-lg shadow-stone-200'
                                                : 'bg-stone-50/30 border-stone-100 text-slate-600 hover:border-black hover:bg-stone-50'}
                                        `}
                                    >
                                        <span className={`relative z-10 ${isSelected ? 'group-hover:hidden' : ''}`}>{time}</span>
                                        {isSelected && (
                                            <span className="absolute inset-0 bg-red-500 text-white flex items-center justify-center font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                Remove
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                <Clock className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xs text-center">Select a date to view available slots</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Slots List */}
                {selectedSlots.length > 0 && (
                    <div className="flex-1 flex flex-col bg-stone-50 rounded-2xl p-5 border border-stone-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-slate-800 text-sm tracking-wide">Selected Sessions</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-48 space-y-2 pr-2 custom-scrollbar-black">
                            {selectedSlots.map((slot, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-100 shadow-sm hover:border-stone-300 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 text-xs font-bold border border-stone-100">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">
                                                {slot.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-stone-500">{slot.time}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSlot(slot)}
                                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove Session"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!selectedSlots.length && (
                    <div className="mt-auto bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 font-bold ml-[-1px]">!</span>
                        </div>
                        <p className="text-xs text-orange-800 font-medium leading-relaxed">
                            All times are shown in your local time <br />({Intl.DateTimeFormat().resolvedOptions().timeZone})
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;
