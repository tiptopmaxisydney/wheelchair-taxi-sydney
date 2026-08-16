"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { faqColumns as defaultFaqColumns, type Faq as FaqItem } from "@/lib/homeData";

type FaqProps = {
  columns?: FaqItem[][];
  title?: string;
  eyebrow?: string;
};

export default function Faq({ columns = defaultFaqColumns, title = "Frequently Asked Questions", eyebrow = "Questions" }: FaqProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className="wt-section on-light" id="faq">
      <div className="container">
        <span className="wt-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <div className="wt-faq-grid">
          {columns.map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((faq, i) => {
                const key = `${colIndex}-${i}`;
                const isOpen = openKey === key;
                return (
                  <div className={`wt-faq-item${isOpen ? " active" : ""}`} key={key}>
                    <button
                      type="button"
                      className="wt-faq-question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenKey(isOpen ? null : key)}
                    >
                      {faq.question}
                      {isOpen ? <FaMinus aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                    </button>
                    <div className="wt-faq-answer">{faq.answer}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
