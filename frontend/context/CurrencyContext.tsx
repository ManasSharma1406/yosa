import React, { createContext, useContext, useEffect, useState } from 'react';

type CurrencyCode = 'USD' | 'INR';

interface CurrencyContextType {
    currencyCode: CurrencyCode;
    symbol: string;
    rate: number;
    formatPrice: (usdPrice: number) => string;
    calculatePrice: (usdPrice: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('USD');
    const [symbol, setSymbol] = useState('$');
    // Using user requested rate: 1 USD = 94 INR
    const [rate, setRate] = useState(1);

    useEffect(() => {
        const detectLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (response.ok) {
                    const data = await response.json();
                    if (data.country_code === 'IN') {
                        setCurrencyCode('INR');
                        setSymbol('₹');
                        setRate(94); // User requested rate
                    }
                }
            } catch (error) {
                console.error('Failed to detect location for currency, defaulting to USD', error);
            }
        };

        detectLocation();
    }, []);

    const calculatePrice = (usdPrice: number) => {
        if (currencyCode === 'INR') {
            return Math.round(usdPrice * rate);
        }
        return usdPrice;
    };

    const formatPrice = (usdPrice: number) => {
        const localPrice = calculatePrice(usdPrice);
        return `${symbol}${localPrice}`;
    };

    return (
        <CurrencyContext.Provider value={{ currencyCode, symbol, rate, formatPrice, calculatePrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
