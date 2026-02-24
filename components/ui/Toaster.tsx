"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-surface-2)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-blue)",
            secondary: "white",
          },
          style: {
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            border: "1px solid var(--color-blue)",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(61, 108, 244, 0.15)",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "white",
          },
          style: {
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            border: "1px solid #ef4444",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
          },
        },
        loading: {
          style: {
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
    />
  );
}
