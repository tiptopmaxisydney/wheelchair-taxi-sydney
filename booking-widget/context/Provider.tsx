"use client";

// Minimal equivalent of tiptopnextjs's src/context/Provider.tsx, scoped to exactly what
// the booking wizard consumes: Toast (error/success/warning) + AntD theme. The full
// GlobalContext in tiptopnextjs also carries cookie-based auth/session/login state that
// has no equivalent here — this is a public marketing site, the booking flow is guest
// checkout (no login), so that plumbing is intentionally left out rather than ported.
import React, { createContext, ReactNode, useContext } from "react";
import { message } from "antd";
import AntConfig from "@/booking-widget/lib/AntConfig";

type ToastFunction = (msg: any) => void;

interface BookingContextType {
  Toast: {
    error: ToastFunction;
    success: ToastFunction;
    warning: ToastFunction;
  };
}

export const GlobalContext = createContext<BookingContextType>({} as BookingContextType);

export function useBookingContext() {
  return useContext(GlobalContext);
}

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();

  const error = (err: any): void => {
    const msg = err?.response?.body?.error_description;
    messageApi.open({
      key: "1",
      type: "error",
      content: typeof err === "string" ? err : typeof msg === "string" ? msg : msg ? JSON.stringify(msg) : JSON.stringify(err),
    });
  };

  const success = (msg: any): void => {
    messageApi.open({ key: "1", type: "success", content: msg });
  };

  const warning = (msg: any): void => {
    messageApi.open({ key: "1", type: "warning", content: msg });
  };

  const Toast = { success, warning, error };

  return (
    <GlobalContext.Provider value={{ Toast }}>
      <AntConfig>{children}</AntConfig>
      {contextHolder}
    </GlobalContext.Provider>
  );
}
