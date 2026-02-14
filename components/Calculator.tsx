import React, { useState, useEffect } from 'react';
import { Delete, History } from 'lucide-react';

interface CalculatorProps {
  pin: string;
  onUnlock: () => void;
  isFirstTime: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({ pin, onUnlock, isFirstTime }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isFirstTime) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setOperator(op);
    setPrevValue(display);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleEqual = () => {
    // SECURITY CHECK: This is the vault trigger
    if (display === pin) {
      onUnlock();
      setDisplay('0');
      return;
    }

    if (!operator || !prevValue) return;

    const current = parseFloat(display);
    const previous = parseFloat(prevValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '×':
        result = previous * current;
        break;
      case '÷':
        result = previous / current;
        break;
    }

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  const handleToggleSign = () => {
    const current = parseFloat(display);
    setDisplay(String(current * -1));
  };

  const Button = ({ 
    label, 
    onClick, 
    className = "", 
    icon = null 
  }: { 
    label?: string; 
    onClick: () => void; 
    className?: string;
    icon?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`h-16 w-16 md:h-20 md:w-20 rounded-full text-3xl flex items-center justify-center transition-all active:scale-95 select-none ${className}`}
    >
      {icon || label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white p-6 justify-end">
      {/* Fake Header for Realism */}
      <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center text-sm text-gray-400 px-6 pt-4">
         <span>12:45</span>
         <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
            <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
         </div>
      </div>

      {showHint && (
        <div className="absolute top-16 left-6 right-6 bg-blue-600/90 text-white p-4 rounded-xl backdrop-blur-md z-50 text-center animate-bounce">
          <p className="font-bold">Welcome!</p>
          <p className="text-sm">Default PIN is <strong>1234</strong>.</p>
          <p className="text-xs mt-1">Enter PIN and press '=' to unlock.</p>
        </div>
      )}

      {/* Display */}
      <div className="flex-1 flex items-end justify-end mb-6">
        <span className="text-6xl md:text-8xl font-light tracking-tight truncate">
          {display}
        </span>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-4 pb-8">
        <Button label="AC" onClick={handleClear} className="bg-gray-400 text-black font-medium" />
        <Button label="+/-" onClick={handleToggleSign} className="bg-gray-400 text-black font-medium" />
        <Button label="%" onClick={handlePercent} className="bg-gray-400 text-black font-medium" />
        <Button label="÷" onClick={() => handleOperator('÷')} className="bg-orange-500 font-medium" />

        <Button label="7" onClick={() => handleNumber('7')} className="bg-gray-800" />
        <Button label="8" onClick={() => handleNumber('8')} className="bg-gray-800" />
        <Button label="9" onClick={() => handleNumber('9')} className="bg-gray-800" />
        <Button label="×" onClick={() => handleOperator('×')} className="bg-orange-500 font-medium" />

        <Button label="4" onClick={() => handleNumber('4')} className="bg-gray-800" />
        <Button label="5" onClick={() => handleNumber('5')} className="bg-gray-800" />
        <Button label="6" onClick={() => handleNumber('6')} className="bg-gray-800" />
        <Button label="-" onClick={() => handleOperator('-')} className="bg-orange-500 font-medium" />

        <Button label="1" onClick={() => handleNumber('1')} className="bg-gray-800" />
        <Button label="2" onClick={() => handleNumber('2')} className="bg-gray-800" />
        <Button label="3" onClick={() => handleNumber('3')} className="bg-gray-800" />
        <Button label="+" onClick={() => handleOperator('+')} className="bg-orange-500 font-medium" />

        <Button label="0" onClick={() => handleNumber('0')} className="bg-gray-800 col-span-2 w-auto rounded-full aspect-auto pl-8 justify-start" />
        <Button label="." onClick={() => handleNumber('.')} className="bg-gray-800" />
        <Button label="=" onClick={handleEqual} className="bg-orange-500 font-medium" />
      </div>
    </div>
  );
};

export default Calculator;