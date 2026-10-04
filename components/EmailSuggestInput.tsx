"use client";

import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { getEmailSuggestions, suggestEmailCorrection } from "@/lib/emailSuggestions";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Show the "Did you mean …?" line under the field for likely typos (default true). */
  showTypoHint?: boolean;
  /** Colour of the highlighted suggestion text and the typo-fix link. */
  accentColor?: string;
  /** Extra styles for the typo hint, e.g. a light colour on dark backgrounds. */
  hintStyle?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
};

// Sets the DOM value the way typing would, so React onChange handlers (controlled
// forms), uncontrolled forms and native FormData submits all see the new value.
function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Plain <input type="email"> with common-domain suggestions and typo hints.
 * A drop-in for any existing email input: every normal input prop (name, id,
 * className, value/defaultValue, onChange, required…) is passed straight through,
 * so the site's own styling and form handling stay as they are.
 * Keyboard: ↑/↓ to move, Enter to pick, Esc to close. Click/tap to pick.
 * Suggestions only — custom/business domains are never changed or blocked.
 */
const EmailSuggestInput = forwardRef<HTMLInputElement, Props>(function EmailSuggestInput(
  {
    showTypoHint = true,
    accentColor = "#2563eb",
    hintStyle,
    wrapperClassName,
    wrapperStyle,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    value,
    defaultValue,
    type = "email",
    autoComplete = "off",
    ...rest
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState(String(value ?? defaultValue ?? ""));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();

  // Follow the parent's value when the field is controlled.
  useEffect(() => {
    if (value !== undefined) setText(String(value ?? ""));
  }, [value]);

  // Uncontrolled forms: keep in sync when the form is reset.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => setTimeout(() => setText(inputRef.current?.value ?? ""), 0);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    },
    [ref]
  );

  const suggestions = useMemo(() => getEmailSuggestions(text), [text]);
  const correction = suggestEmailCorrection(text);
  const showList = open && suggestions.length > 0;

  const pick = (next: string) => {
    const el = inputRef.current;
    if (!el) return;
    setNativeValue(el, next);
    setText(next);
    setOpen(false);
    setActive(-1);
    el.focus();
  };

  return (
    <div className={wrapperClassName} style={{ position: "relative", width: "100%", ...wrapperStyle }}>
      <input
        {...rest}
        ref={setRefs}
        type={type}
        inputMode="email"
        autoComplete={autoComplete}
        value={value}
        defaultValue={defaultValue}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(-1);
          onChange?.(e);
        }}
        onFocus={(e) => {
          setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setOpen(false);
          setActive(-1);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          if (showList) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === "Enter" && active >= 0) {
              e.preventDefault(); // pick the highlighted suggestion instead of submitting
              pick(suggestions[active]);
            } else if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
            }
          }
          onKeyDown?.(e);
        }}
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            zIndex: 1000,
            margin: 0,
            padding: 4,
            listStyle: "none",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 12px 28px -8px rgba(15, 23, 42, 0.25)",
            maxHeight: 264,
            overflowY: "auto",
            textAlign: "left",
          }}
        >
          {suggestions.map((s, i) => {
            const at = s.indexOf("@");
            return (
              <li
                key={s}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // Keep focus in the input so blur doesn't close the list before the pick lands.
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                onMouseEnter={() => setActive(i)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontSize: 15,
                  lineHeight: 1.3,
                  color: "#0f172a",
                  background: i === active ? "#eff6ff" : "transparent",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.slice(0, at)}
                <span style={{ color: accentColor, fontWeight: 600 }}>{s.slice(at)}</span>
              </li>
            );
          })}
        </ul>
      )}

      {showTypoHint && correction && !showList && (
        <div role="status" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.4, color: "#475569", textAlign: "left", ...hintStyle }}>
          Did you mean{" "}
          <button
            type="button"
            onClick={() => pick(correction)}
            style={{
              background: "none",
              border: 0,
              padding: 0,
              font: "inherit",
              color: accentColor,
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {correction}
          </button>
          ?
        </div>
      )}
    </div>
  );
});

export default EmailSuggestInput;
