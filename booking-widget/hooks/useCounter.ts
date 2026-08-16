import { useState } from "react";

export const useCounter = (initialValue: number, min: number, max: number) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    if (count < max) setCount(count + 1);
  };

  const decrement = () => {
    if (count > min) setCount(count - 1);
  };

  const setValue = (value: number) => {
    if (value >= min && value <= max) {
      setCount(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setValue(value);
    }
  };

  return { count, increment, decrement, setValue, handleChange };
};
