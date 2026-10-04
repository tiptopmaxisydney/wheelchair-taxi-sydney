"use client";

import React, { useMemo } from "react";
import { AutoComplete, Input } from "antd";
import { getEmailSuggestions, suggestEmailCorrection } from "@/booking-widget/utils/emailSuggestions";

interface EmailTypoHintProps {
  value?: string;
  onPick: (corrected: string) => void;
  className?: string;
}

// "Did you mean …?" line for a likely-mistyped domain. Never changes the value by
// itself — the corrected address is only applied when it's clicked.
export const EmailTypoHint: React.FC<EmailTypoHintProps> = ({ value, onPick, className = "" }) => {
  const correction = suggestEmailCorrection(value);
  if (!correction) return null;
  return (
    <div className={`mt-1 text-xs text-slate-600 ${className}`} role="status">
      Did you mean{" "}
      <button
        type="button"
        onClick={() => onPick(correction)}
        className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-blue-600 underline underline-offset-2"
      >
        {correction}
      </button>
      ?
    </div>
  );
};

interface EmailAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  size?: "large" | "middle" | "small";
  id?: string;
  className?: string;
  prefix?: React.ReactNode;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  variant?: "outlined" | "borderless" | "filled";
  type?: string;
  // Off when the caller renders <EmailTypoHint> somewhere else (e.g. outside a
  // fixed-height input row).
  showTypoHint?: boolean;
}

// Drop-in replacement for an antd <Input> email field (works directly as a
// Form.Item child): common-domain suggestions as soon as the part before "@" is
// typed, ↑/↓ + Enter or click/tap to pick, closes on blur, and a typo hint.
// Client-side only; custom/business domains are never blocked or flagged.
const EmailAutocomplete: React.FC<EmailAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  size = "large",
  id,
  className,
  prefix,
  maxLength,
  disabled,
  autoFocus,
  variant,
  type = "text",
  showTypoHint = true,
}) => {
  const options = useMemo(() => getEmailSuggestions(value).map((v) => ({ value: v })), [value]);

  return (
    <div className="w-full">
      <AutoComplete
        id={id}
        value={value}
        options={options}
        onChange={(v) => onChange?.(v)}
        defaultActiveFirstOption={false}
        disabled={disabled}
        className="w-full"
        popupMatchSelectWidth
      >
        <Input
          type={type}
          inputMode="email"
          size={size}
          prefix={prefix}
          maxLength={maxLength}
          placeholder={placeholder}
          autoFocus={autoFocus}
          variant={variant}
          className={className}
          autoComplete="off"
          aria-label={placeholder || "Email address"}
          onBlur={onBlur}
        />
      </AutoComplete>
      {showTypoHint && <EmailTypoHint value={value} onPick={(v) => onChange?.(v)} />}
    </div>
  );
};

export default EmailAutocomplete;
