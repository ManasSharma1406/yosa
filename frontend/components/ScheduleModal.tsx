import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Check, ArrowLeft, User, Users, Home, ChevronRight,
    Shield, CreditCard, AlertCircle, Loader2, CheckCircle, XCircle, Calendar
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPlan?: string;
}

// Price map — keyed by plan name string
const PLAN_PRICE_MAP: Record<string, number> = {
    'Drop-In (1:1 Private)': 25,
    '4-Week Journey (1:1 Private)': 190,
    'Deep Foundation (1:1 Private)': 270,
    'Transformation (1:1 Private)': 340,
    'Total Immersion (1:1 Private)': 400,
    'Group Drop-In (Group)': 10,
    '10 Class Pack (Group)': 85,
    '20 Class Pack (Group)': 150,
    'Premium Small Drop-In (Group)': 18,
    'Premium 8-Session Pack (Group)': 135,
    'Premium 12-Session Pack (Group)': 180,
    'Family of 2 Wellness Package': 650,
    'Family of 3 Wellness Package': 850,
    'Family of 4 Wellness Package': 1050,
};

const ADDONS = [
    { id: 'meditation', name: 'Guided Body Scan Meditation', price: 12 },
    { id: 'breathwork', name: 'Breathwork & Nervous System Reset', price: 18 },
];

type Step = 'offering' | 'plan' | 'checkout' | 'success' | 'payment_failed';

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, initialPlan }) => {
    const [step, setStep] = useState<Step>('offering');
    const [selectedOffering, setSelectedOffering] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [payLoading, setPayLoading] = useState(false);
    const [failedReason, setFailedReason] = useState('');

    const navigate = useNavigate();
    const { getIdToken } = useAuth();

    const planPrice = selectedPlan ? (PLAN_PRICE_MAP[selectedPlan] ?? 0) : 0;
    const addonsTotal = ADDONS.filter(a => selectedAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
    const totalToPay = planPrice + addonsTotal;

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            if (initialPlan) {
                setSelectedPlan(initialPlan);
                setStep('checkout');
            } else {
                setStep('offering');
                setSelectedPlan(null);
            }
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, initialPlan]);

    const handleOfferingSelect = (offering: string) => {
        setSelectedOffering(offering);
        setStep('plan');
    };

    const handlePlanSelect = (plan: string) => {
        setSelectedPlan(plan);
        setStep('checkout');
    };

    const handleBack = () => {
        if (step === 'plan') setStep('offering');
        else if (step === 'checkout') {
            if (initialPlan) resetAndClose();
            else setStep('plan');
        }
        else if (step === 'payment_failed') setStep('checkout');
    };

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handlePay = async () => {
        setPayLoading(true);
        setFailedReason('');

        try {
            const user = auth.currentUser;
            const idToken = user ? await getIdToken() : '';

            // Create order on backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    amount: totalToPay,
                    planName: selectedPlan,
                    currency: 'USD',
                    userId: user?.uid || 'guest',
                }),
            });

            const order = await response.json();
            if (!response.ok) throw new Error(order.message || 'Failed to create order');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Yog-Samskara',
                description: selectedPlan || 'Yoga Plan',
                image: '/red.png',
                order_id: order.id,
                handler: async function (rzpResponse: any) {
                    try {
                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: rzpResponse.razorpay_order_id,
                                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                                razorpay_signature: rzpResponse.razorpay_signature,
                            }),
                        });

                        if (verifyRes.ok) {
                            setStep('success');
                        } else {
                            setFailedReason('Payment verification failed. Please contact support.');
                            setStep('payment_failed');
                        }
                    } catch {
                        setFailedReason('Something went wrong during verification.');
                        setStep('payment_failed');
                    } finally {
                        setPayLoading(false);
                    }
                },
                prefill: {
                    name: user?.displayName || '',
                    email: user?.email || '',
                },
                theme: { color: '#1c1917' },
                modal: {
                    ondismiss: () => {
                        setPayLoading(false);
                        setFailedReason('Payment was cancelled. You can try again.');
                        setStep('payment_failed');
                    },
                },
            };

            const rzp = (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            setPayLoading(false);
            setFailedReason(error.message || 'Failed to initialize payment. Please try again.');
            setStep('payment_failed');
        }
    };

    const resetAndClose = () => {
        setStep('offering');
        setSelectedOffering(null);
        setSelectedPlan(null);
        setSelectedAddons([]);
        setPayLoading(false);
        setFailedReason('');
        onClose();
    };

    const handleGoToDashboard = () => {
        resetAndClose();
        navigate('/dashboard');
    };

    const getHeaderTitle = () => {
        switch (step) {
            case 'success': return 'Plan Confirmed';
            case 'checkout': return 'Secure Checkout';
            case 'payment_failed': return 'Payment Failed';
            default: return 'Select a Plan';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto z-[9998]"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none z-[9999]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col font-poppins border border-stone-100"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-10 py-8 border-b border-stone-100">
                                <h2 className="text-2xl font-semibold text-[#1e293b] tracking-tight font-poppins not-italic">
                                    {getHeaderTitle()}
                                </h2>
                                <button
                                    onClick={resetAndClose}
                                    className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div
                                className="p-6 md:p-12 overflow-y-auto custom-scrollbar-black flex-1 flex flex-col items-center"
                                data-lenis-prevent
                            >
                                <div className="w-full max-w-6xl pb-12">

                                    {/* ── STEP: Offering ── */}
                                    {step === 'offering' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
                                        >
                                            <button
                                                onClick={() => handleOfferingSelect('private')}
                                                className="group bg-white border-2 border-stone-100 p-8 rounded-[2rem] hover:border-black hover:shadow-2xl transition-all duration-500 text-left flex flex-col h-full font-poppins"
                                            >
                                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 text-black">
                                                    <User className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins not-italic">1:1 Private Session</h3>
                                                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1 font-poppins not-italic">Personalized guidance tailored to your unique body, goals, and healing journey.</p>
                                                <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest mt-auto font-poppins not-italic">
                                                    Starting from $25 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleOfferingSelect('group')}
                                                className="group bg-white border-2 border-stone-100 p-8 rounded-[2rem] hover:border-black hover:shadow-2xl transition-all duration-500 text-left flex flex-col h-full font-poppins"
                                            >
                                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 text-black">
                                                    <Users className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins not-italic">Group Plans</h3>
                                                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1 font-poppins not-italic">Connect and grow with others in our intimate regular or premium small group sessions.</p>
                                                <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest mt-auto font-poppins not-italic">
                                                    Starting from $10 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleOfferingSelect('family')}
                                                className="group bg-white border-2 border-stone-100 p-8 rounded-[2rem] hover:border-black hover:shadow-2xl transition-all duration-500 text-left flex flex-col h-full font-poppins"
                                            >
                                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 text-black">
                                                    <Home className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins not-italic">Family Plan</h3>
                                                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1 font-poppins not-italic">Wellness for the whole household. Shared sessions with a dedicated teacher.</p>
                                                <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest mt-auto font-poppins not-italic">
                                                    Starting from $650 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* ── STEP: Plan ── */}
                                    {step === 'plan' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="w-full max-w-5xl"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <button onClick={handleBack} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                                                    <ArrowLeft className="w-5 h-5 text-stone-900" />
                                                </button>
                                                <h3 className="text-xl font-bold text-slate-900 capitalize font-poppins not-italic">
                                                    {selectedOffering === 'private' ? '1:1 Private Plans' : selectedOffering === 'group' ? 'Group Offerings' : 'Family Wellness Packages'}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-poppins">
                                                {selectedOffering === 'private' && [
                                                    { name: 'Drop-In', details: '1 Session', price: '$25' },
                                                    { name: '4-Week Journey', details: '8 Sessions · 4 Weeks', price: '$190' },
                                                    { name: 'Deep Foundation', details: '12 Sessions · 4 Weeks', price: '$270' },
                                                    { name: 'Transformation', details: '16 Sessions · 4 Weeks', price: '$340' },
                                                    { name: 'Total Immersion', details: '20 Sessions · 4 Weeks', price: '$400' }
                                                ].map((p) => (
                                                    <button
                                                        key={p.name}
                                                        onClick={() => handlePlanSelect(`${p.name} (1:1 Private)`)}
                                                        className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-black hover:bg-white hover:shadow-xl transition-all duration-300 text-left"
                                                    >
                                                        <h4 className="font-bold text-slate-900 mb-1 font-poppins not-italic">{p.name}</h4>
                                                        <p className="text-stone-500 text-xs mb-4 font-poppins not-italic">{p.details}</p>
                                                        <div className="text-2xl font-light text-black font-poppins not-italic">{p.price}</div>
                                                    </button>
                                                ))}

                                                {selectedOffering === 'group' && [
                                                    { name: 'Group Drop-In', details: 'Single session', price: '$10' },
                                                    { name: '10 Class Pack', details: '10 sessions · Valid 1 mo', price: '$85' },
                                                    { name: '20 Class Pack', details: '20 sessions · Max savings', price: '$150' },
                                                    { name: 'Premium Small Drop-In', details: 'Max 5 members', price: '$18' },
                                                    { name: 'Premium 8-Session Pack', details: 'Intimate setting', price: '$135' },
                                                    { name: 'Premium 12-Session Pack', details: 'Priority booking', price: '$180' }
                                                ].map((p) => (
                                                    <button
                                                        key={p.name}
                                                        onClick={() => handlePlanSelect(`${p.name} (Group)`)}
                                                        className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-black hover:bg-white hover:shadow-xl transition-all duration-300 text-left"
                                                    >
                                                        <h4 className="font-bold text-slate-900 mb-1 font-poppins not-italic">{p.name}</h4>
                                                        <p className="text-stone-500 text-xs mb-4 font-poppins not-italic">{p.details}</p>
                                                        <div className="text-2xl font-light text-black font-poppins not-italic">{p.price}</div>
                                                    </button>
                                                ))}

                                                {selectedOffering === 'family' && [
                                                    { name: 'Family of 2', details: '2 Members · 2-mo validity', price: '$650' },
                                                    { name: 'Family of 3', details: '3 Members · 2-mo validity', price: '$850' },
                                                    { name: 'Family of 4', details: '4 Members · 2-mo validity', price: '$1,050' }
                                                ].map((p) => (
                                                    <button
                                                        key={p.name}
                                                        onClick={() => handlePlanSelect(`${p.name} Wellness Package`)}
                                                        className="bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-black hover:bg-white hover:shadow-xl transition-all duration-300 text-left"
                                                    >
                                                        <h4 className="font-bold text-slate-900 mb-1 font-poppins not-italic">{p.name}</h4>
                                                        <p className="text-stone-500 text-xs mb-4 font-poppins not-italic">{p.details}</p>
                                                        <div className="text-2xl font-light text-black font-poppins not-italic">{p.price}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── STEP: Checkout ── */}
                                    {step === 'checkout' && selectedPlan && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -16 }}
                                            className="w-full max-w-2xl mx-auto"
                                        >
                                            {/* Back */}
                                            <button
                                                onClick={handleBack}
                                                className="flex items-center gap-2 text-stone-500 hover:text-black text-sm font-semibold mb-8 transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                Back
                                            </button>

                                            <div className="space-y-6">
                                                {/* Order Summary Card */}
                                                <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 space-y-5">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Order Summary</p>

                                                    {/* Plan row */}
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">{selectedPlan}</p>
                                                            <p className="text-stone-400 text-xs mt-0.5">
                                                                Plan Subscription
                                                            </p>
                                                        </div>
                                                        <span className="text-lg font-light text-slate-900">
                                                            ${planPrice}
                                                        </span>
                                                    </div>

                                                    {/* Add-on rows */}
                                                    {selectedAddons.length > 0 && (
                                                        <div className="pt-3 border-t border-stone-200 space-y-2">
                                                            {ADDONS.filter(a => selectedAddons.includes(a.id)).map(addon => (
                                                                <div key={addon.id} className="flex justify-between text-stone-500 text-sm">
                                                                    <span className="italic">{addon.name}</span>
                                                                    <span>+${addon.price}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Total */}
                                                    <div className="flex justify-between items-center pt-4 border-t border-stone-200 font-bold">
                                                        <span className="text-slate-900">Total to Pay</span>
                                                        <span className="text-2xl text-slate-900">
                                                            ${totalToPay}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Add-on toggles */}
                                                <div className="space-y-3">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Enhance Your Journey</p>
                                                    {ADDONS.map(addon => (
                                                        <label
                                                            key={addon.id}
                                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedAddons.includes(addon.id)
                                                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
                                                                : 'bg-white text-stone-600 border-stone-100 hover:border-stone-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAddons.includes(addon.id) ? 'bg-white border-white' : 'bg-transparent border-stone-300'
                                                                    }`}>
                                                                    {selectedAddons.includes(addon.id) && <CheckCircle className="w-3.5 h-3.5 text-stone-900" />}
                                                                </div>
                                                                <span className="text-sm font-medium">{addon.name}</span>
                                                            </div>
                                                            <span className={`text-sm ${selectedAddons.includes(addon.id) ? 'text-stone-300' : 'text-stone-400'}`}>
                                                                +${addon.price}
                                                            </span>
                                                            <input type="checkbox" className="hidden" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* Trust badges */}
                                                <div className="flex gap-6 text-stone-400 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-4 h-4 text-stone-300" />
                                                        <span>Secure PCI-compliant</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-stone-300" />
                                                        <span>UPI, Card & PayPal</span>
                                                    </div>
                                                </div>

                                                {/* Pay/Confirm Button */}
                                                <button
                                                    onClick={handlePay}
                                                    disabled={payLoading}
                                                    className="w-full py-5 bg-black text-white rounded-2xl font-bold text-base tracking-wide hover:bg-stone-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-stone-200"
                                                >
                                                    {payLoading ? (
                                                        <><Loader2 className="w-5 h-5 animate-spin" /> Initiating Payment...</>
                                                    ) : (
                                                        `Pay $${totalToPay} Now`
                                                    )}
                                                </button>

                                                <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                                                    By paying, you agree to FlowNest Studio's{' '}
                                                    <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Refund Policy</a>.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── STEP: Payment Failed ── */}
                                    {step === 'payment_failed' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-12 max-w-lg mx-auto text-center"
                                        >
                                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                                <XCircle className="w-10 h-10 text-red-500" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-slate-900 mb-3 font-poppins">Payment Unsuccessful</h3>
                                            <p className="text-stone-500 text-sm mb-2 max-w-xs leading-relaxed">
                                                {failedReason || 'Your payment could not be processed. No charges were made.'}
                                            </p>

                                            {failedReason && (
                                                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-red-600 text-sm text-left mb-8 w-full">
                                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                    <p>{failedReason}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                                                <button
                                                    onClick={() => {
                                                        setFailedReason('');
                                                        setStep('checkout');
                                                    }}
                                                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-stone-900 transition-all shadow-xl shadow-stone-200"
                                                >
                                                    Try Again
                                                </button>
                                                <button
                                                    onClick={resetAndClose}
                                                    className="flex-1 py-4 bg-stone-100 text-stone-700 rounded-2xl font-bold hover:bg-stone-200 transition-all"
                                                >
                                                    Cancel Payment
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── STEP: Success ── */}
                                    {step === 'success' && selectedPlan && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="relative flex flex-col items-center justify-center py-6"
                                        >
                                            <div className="w-full max-w-2xl bg-white border-4 border-black rounded-[2rem] p-10 relative overflow-hidden">
                                                <div className="text-center mb-10">
                                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Check className="w-8 h-8 text-green-500" />
                                                    </div>
                                                    <h3 className="text-3xl font-semibold text-slate-900 mb-4 font-poppins not-italic">Plan Purchased Successfully!</h3>
                                                    <p className="text-slate-500 text-sm">Your payment for <strong>{selectedPlan}</strong> was successful.</p>
                                                </div>

                                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 text-center">
                                                    <p className="text-slate-700 font-medium mb-2 font-poppins text-lg">
                                                        Ready to schedule your classes?
                                                    </p>
                                                    <p className="text-slate-500 text-sm">
                                                        Head over to your Dashboard to pick the dates and times that work best for you.
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={handleGoToDashboard}
                                                    className="w-full bg-black text-white rounded-2xl py-4 font-bold text-lg hover:bg-stone-900 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
                                                >
                                                    <Calendar className="w-5 h-5" /> Go to Dashboard
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ScheduleModal;
