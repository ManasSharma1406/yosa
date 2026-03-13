import React, { useState } from 'react';
import { User, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BookingDetails {
    sessionType: string;
    focusArea: string;
    intensity: string;
}

interface BookingFormProps {
    selectedDate: Date;
    selectedTime: string;
    onBack: () => void;
    onSuccess: (details: BookingDetails) => void;
    initialSessionType?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, selectedTime, onBack, onSuccess, initialSessionType }) => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [error, setError] = useState('');

    // New Fields
    const [sessionType] = useState(initialSessionType || '1:1 Coaching');
    const [focusArea, setFocusArea] = useState('Mindfulness');
    const [intensity, setIntensity] = useState('Medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim()) {
            setError('Please fill in your name and email.');
            return;
        }

        // Simply hand off details to parent — no API calls here
        onSuccess({ sessionType, focusArea, intensity });
    };

    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-semibold text-slate-800 font-poppins not-italic">Booking Details</h3>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-600 hover:text-black font-semibold transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calendar
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-6 text-center border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Date & Time Pills */}
                <div className="space-y-4 font-poppins">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest ml-1">Date and time</label>
                    <div className="flex flex-wrap gap-3">
                        <div className="px-6 py-3 bg-stone-50/50 border border-stone-100 rounded-xl text-stone-900 text-sm font-semibold">
                            {selectedDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                        <div className="px-6 py-3 bg-stone-50/50 border border-stone-100 rounded-xl text-stone-900 text-sm font-semibold">
                            {selectedTime}
                        </div>
                    </div>
                </div>

                {/* Session Type / Selected Plan */}
                <div className="space-y-4 font-poppins">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest ml-1">
                        {initialSessionType ? 'Selected Plan' : 'Session Type'}
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="px-8 py-3 rounded-xl text-sm font-semibold bg-black text-white border border-black shadow-lg shadow-stone-200">
                            {sessionType}
                        </div>
                    </div>
                </div>

                {/* Focus Area */}
                <div className="space-y-4 font-poppins">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-widest ml-1">Focus Area</label>
                    <div className="flex flex-wrap gap-3">
                        {['Flexibility', 'Strength', 'Mindfulness', 'Breathwork'].map((area) => (
                            <button
                                key={area}
                                type="button"
                                onClick={() => setFocusArea(area)}
                                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${focusArea === area
                                    ? 'bg-black text-white border-black shadow-lg shadow-stone-200'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-black'
                                    }`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intensity Selection */}
                <div className="space-y-6 font-poppins">
                    <div className="flex justify-between items-end">
                        <label className="text-stone-500 text-xs font-semibold uppercase tracking-widest ml-1">Intensity</label>
                        <span className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-900 text-xs font-semibold bg-white shadow-sm uppercase tracking-wider">{intensity}</span>
                    </div>

                    <div className="relative px-2">
                        {/* Slider Track */}
                        <div className="relative h-1 w-full bg-stone-200 rounded-full">
                            {/* Discrete Points */}
                            <div className="absolute inset-0 flex justify-between items-center">
                                {[0, 1, 2].map((point) => (
                                    <div
                                        key={point}
                                        className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${(intensity === 'Low' && point === 0) ||
                                            (intensity === 'Medium' && point === 1) ||
                                            (intensity === 'High' && point === 2)
                                            ? 'bg-black border-black'
                                            : 'bg-slate-300 border-white shadow-sm'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Active Fill */}
                            <div
                                className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: intensity === 'Low' ? '0%' : intensity === 'Medium' ? '50%' : '100%'
                                }}
                            />
                        </div>

                        {/* Invisible Input Range */}
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="1"
                            value={intensity === 'Low' ? 0 : intensity === 'Medium' ? 1 : 2}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const labels = ['Low', 'Medium', 'High'];
                                setIntensity(labels[val]);
                            }}
                            className="absolute -top-2 left-0 w-full h-5 opacity-0 cursor-pointer z-10"
                        />
                    </div>

                    <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] px-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200 font-poppins">
                    <div className="space-y-1.5">
                        <label className="text-stone-500 text-xs uppercase tracking-widest ml-1">Full Name</label>
                        <div className="bg-transparent border border-stone-300 rounded-2xl p-3 flex items-center gap-2 focus-within:border-stone-500 transition-all">
                            <User className="w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="bg-transparent outline-none text-stone-900 placeholder-stone-400 flex-1 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-stone-500 text-xs uppercase tracking-widest ml-1">Email</label>
                        <div className="bg-transparent border border-stone-300 rounded-2xl p-3 flex items-center gap-2 focus-within:border-stone-500 transition-all">
                            <Mail className="w-4 h-4 text-stone-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="bg-transparent outline-none text-stone-900 placeholder-stone-400 flex-1 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-2xl py-5 font-bold text-lg hover:bg-stone-900 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 shadow-xl shadow-stone-200 font-poppins"
                    >
                        <span>Proceed to Checkout</span>
                        <CheckCircle className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
