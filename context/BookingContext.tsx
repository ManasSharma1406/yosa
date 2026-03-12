import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface BookingContextType {
    isScheduleModalOpen: boolean;
    openBookingModal: () => void;
    closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const openBookingModal = () => {
        if (!user) {
            navigate('/sign-in');
        } else {
            setIsScheduleModalOpen(true);
        }
    };

    const closeBookingModal = () => {
        setIsScheduleModalOpen(false);
    };

    return (
        <BookingContext.Provider value={{ isScheduleModalOpen, openBookingModal, closeBookingModal }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
