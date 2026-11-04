import area from "./AccountArea.module.css";

const LABELS: Record<string, string> = {
  pending: "Received",
  confirmed: "Confirmed",
  processing: "Preparing",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/** A small coloured pill for an order's status. */
export function OrderStatus({ status }: { status: string }) {
  return <span className={area.status} data-status={status}>{LABELS[status] ?? status}</span>;
}

export const statusLabel = (status: string) => LABELS[status] ?? status;
