import React, { useState } from 'react';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    currencySymbol: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, currencySymbol }) => {
    const [inputValue, setInputValue] = useState<string>(value.toString());

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        const numericValue = parseFloat(newValue.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(numericValue)) {
            onChange(numericValue);
        }
    };

    return (
        <div className="currency-input">
            <span>{currencySymbol}</span>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="0.00"
            />
        </div>
    );
};

export default CurrencyInput;