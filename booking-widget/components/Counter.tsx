"use client";

import { useCounter } from "@/booking-widget/hooks/useCounter";
import { Form, Input } from "antd";
import React, { useEffect } from "react";

interface CounterProps {
  name: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  initialValue: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  name,
  label,
  description,
  icon,
  initialValue,
  min,
  max,
  onChange,
}) => {
  const { count, increment, decrement, handleChange } = useCounter(
    initialValue,
    min,
    max
  );

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex gap-3 items-center">
        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0d1b2e]/5 flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4">
          {icon}
        </span>
        <div>
          <div className="text-sm text-[#0d1b2e] font-semibold">{label}</div>
          <div className="text-xs text-gray-500 whitespace-pre-line">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-slate-300 text-[#0d1b2e] font-semibold flex items-center justify-center hover:border-[#0d1b2e] disabled:opacity-30 disabled:hover:border-slate-300 transition-colors"
          onClick={decrement}
          disabled={count <= min}
        >
          −
        </button>
        <Form.Item name={name} className="hidden">
          <Input type="number" value={count} onChange={handleChange} min={min} max={max} />
        </Form.Item>
        <span className="w-5 text-center font-semibold text-[#0d1b2e]">{count}</span>
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-slate-300 text-[#0d1b2e] font-semibold flex items-center justify-center hover:border-[#0d1b2e] disabled:opacity-30 disabled:hover:border-slate-300 transition-colors"
          onClick={increment}
          disabled={count >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
