import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton: React.FC = () => {
    const phoneNumber = "919399441405";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-4 right-8 z-[100] cursor-grab active:cursor-grabbing"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
                aria-label="Chat on WhatsApp"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
            >
                {/* Official WhatsApp SVG Icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408.001 12.045a11.811 11.811 0 001.592 5.968l-1.592 5.812 5.946-1.56a11.776 11.776 0 005.658 1.458h.005c6.635 0 12.046-5.409 12.049-12.047a11.823 11.823 0 00-3.411-8.527" />
                </svg>

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-4 py-2 bg-white text-stone-900 text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-stone-100">
                    Chat with us
                </span>

                {/* Pulsing Effect */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
            </a>
        </motion.div>
    );
};

export default WhatsAppButton;
