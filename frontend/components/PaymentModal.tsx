import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        name: string;
        price: number;
        currency: string;
        billingCycle: string;
    };
}

const ADDONS = [
    { id: 'meditation', name: 'Guided Body Scan Meditation', price: 12 },
    { id: 'breathwork', name: 'Breathwork & Nervous System Reset', price: 18 }
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    const addonsTotal = ADDONS
        .filter(addon => selectedAddons.includes(addon.id))
        .reduce((sum, addon) => sum + addon.price, 0);

    const totalToPay = plan.price + addonsTotal;

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handlePayment = async () => {
        setLoading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            // Get Firebase ID token
            const user = auth.currentUser;
            if (!user) {
                throw new Error('Please sign in to make a payment');
            }

            const idToken = await user.getIdToken();

            // 1. Create Order on Backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: totalToPay,
                    planName: plan.name + (selectedAddons.length > 0 ? ` + Add-ons` : ''),
                    currency: plan.currency === '$' ? 'USD' : 'INR',
                    userId: user.uid // Send Firebase UID
                })
            });

            const order = await response.json();

            if (!response.ok) throw new Error(order.message || 'Failed to create order');

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Environment Variable
                amount: order.amount,
                currency: order.currency,
                name: "FlowNest Studio",
                description: `Purchase for ${plan.name} and ${selectedAddons.length} add-ons`,
                image: "/red.png",
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const user = auth.currentUser;
                        const idToken = user ? await user.getIdToken() : '';

                        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${idToken}`
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (verifyRes.ok) {
                            setStatus('success');
                        } else {
                            setStatus('failed');
                            setErrorMessage('Verification failed. Please contact support.');
                        }
                    } catch (err) {
                        setStatus('failed');
                        setErrorMessage('Something went wrong during verification.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "", // Will be filled from auth context if needed
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#1c1917" // stone-900
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = (window as any).Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error('Payment Error:', error);
            setStatus('failed');
            setErrorMessage(error.message || 'Failed to initialize payment.');
            setLoading(false);
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
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden text-stone-900 font-sans"
                        >
                            {/* Success State */}
                            {status === 'success' ? (
                                <div className="p-12 text-center space-y-6">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-serif italic">Payment Successful</h3>
                                        <p className="text-stone-500">Welcome to your {plan.name}. Your journey begins now.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 bg-stone-900 text-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition-all"
                                    >
                                        Go to Sanctuary
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="relative p-8 border-b border-stone-100">
                                        <button
                                            onClick={onClose}
                                            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs uppercase tracking-[0.2em] text-stone-400">Secure Checkout</span>
                                            <h2 className="text-3xl font-poppins text-stone-900 leading-tight">{plan.name}</h2>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-8 space-y-8 h-[600px] overflow-y-auto custom-scrollbar">
                                        {/* Plan Details Card */}
                                        <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-stone-500">Plan Amount</span>
                                                <span className="text-xl font-light">{plan.currency}{plan.price}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-stone-400">
                                                <span>Billing Cycle</span>
                                                <span className="uppercase tracking-widest">{plan.billingCycle}</span>
                                            </div>

                                            {/* Add-ons List */}
                                            {selectedAddons.length > 0 && (
                                                <div className="pt-4 border-t border-stone-100 space-y-2">
                                                    {ADDONS.filter(a => selectedAddons.includes(a.id)).map(addon => (
                                                        <div key={addon.id} className="flex justify-between items-center text-stone-500 text-sm italic">
                                                            <span>{addon.name}</span>
                                                            <span>+{plan.currency}{addon.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="pt-4 border-t border-stone-200 flex justify-between items-center font-bold">
                                                <span>Total to Pay</span>
                                                <span className="text-2xl">{plan.currency}{totalToPay}</span>
                                            </div>
                                        </div>

                                        {/* Add-ons Selection */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm uppercase tracking-widest text-stone-400 font-poppins mb-4">Enhance Your Journey</h3>
                                            {ADDONS.map((addon) => (
                                                <label
                                                    key={addon.id}
                                                    className={`
                                                        flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer
                                                        ${selectedAddons.includes(addon.id)
                                                            ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
                                                            : 'bg-white text-stone-600 border-stone-100 hover:border-stone-300'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                            ${selectedAddons.includes(addon.id) ? 'bg-white border-white' : 'bg-transparent border-stone-300'}
                                                        `}>
                                                            {selectedAddons.includes(addon.id) && <CheckCircle className="w-3.5 h-3.5 text-stone-900" />}
                                                        </div>
                                                        <span className="text-sm font-medium">{addon.name}</span>
                                                    </div>
                                                    <span className={`text-sm ${selectedAddons.includes(addon.id) ? 'text-stone-300' : 'text-stone-400'}`}>
                                                        +{plan.currency}{addon.price}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={selectedAddons.includes(addon.id)}
                                                        onChange={() => toggleAddon(addon.id)}
                                                    />
                                                </label>
                                            ))}
                                        </div>

                                        {/* Features List (Subtle) */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-stone-500 text-sm">
                                                <Shield className="w-4 h-4 text-stone-300" />
                                                <span>Secure PCI-compliant transaction</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-stone-500 text-sm">
                                                <CreditCard className="w-4 h-4 text-stone-300" />
                                                <span>UPI, Card, and PayPal supported</span>
                                            </div>
                                        </div>

                                        {status === 'failed' && (
                                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 text-red-600 text-sm italic">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full py-5 bg-stone-900 text-white rounded-full font-bold uppercase text-xs tracking-[0.2em] hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                `Pay ${plan.currency}${totalToPay} Now`
                                            )}
                                        </button>

                                        <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                                            By clicking pay, you agree to FlowNest Studio's <br />
                                            <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Refund Policy</a>.
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
