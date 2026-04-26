export type StatusType = "success" | "error" | "info";

export function getStatusStyles() {
  return {
    success: {
      background: "#ecfdf5",
      border: "1px solid #a7f3d0",
      color: "#065f46",
    },
    error: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#991b1b",
    },
    info: {
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      color: "#1d4ed8",
    },
  } as const;
}