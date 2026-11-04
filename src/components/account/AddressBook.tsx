"use client";

import { useState } from "react";
import { postJson } from "@/lib/api-client";
import { addressLine, formatPhone, MAX_ADDRESSES, type AddressRecord } from "@/lib/account/validation";
import { AddressForm } from "./AddressForm";
import account from "./Account.module.css";
import area from "./AccountArea.module.css";

/** The customer's saved delivery addresses: add, edit, remove and choose the default. */
export function AddressBook({ initial, name, phone }: { initial: AddressRecord[]; name: string; phone: string | null }) {
  const [addresses, setAddresses] = useState(initial);
  const [editing, setEditing] = useState<string | "new" | null>(initial.length === 0 ? "new" : null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function act(action: "default" | "delete", id: string) {
    setBusy(id); setError(""); setNotice("");
    const { ok, data } = await postJson<{ addresses?: AddressRecord[] }>("/api/account/addresses", { action, id });
    setBusy(null); setRemoving(null);
    if (!ok || !data.addresses) { setError(data.message ?? "That did not work. Please try again."); return; }
    setAddresses(data.addresses);
    setNotice(data.message ?? "");
  }

  const saved = (list: AddressRecord[]) => {
    setAddresses(list); setEditing(null); setError(""); setNotice("Your address is saved.");
  };

  return (
    <div className={area.stack}>
      <div aria-live="polite">
        {notice && <p className={account.success} role="status">{notice}</p>}
        {error && <p className={account.error} role="alert">{error}</p>}
      </div>

      {addresses.length > 0 && (
        <ul className={area.addressGrid}>
          {addresses.map((a) => (
            <li key={a.id} className={area.addressCard} data-default={a.isDefault}>
              {editing === a.id ? (
                <AddressForm initial={a} submitLabel="Save changes" onSaved={saved} onCancel={() => setEditing(null)} />
              ) : (
                <>
                  <div className={area.addressTop}>
                    <strong>{a.label || "Address"}</strong>
                    {a.isDefault && <span className={area.badge}>Default</span>}
                  </div>
                  <p className={area.addressText}>
                    {a.recipient}<br />{addressLine(a)}<br />{formatPhone(a.phone)}
                  </p>
                  <div className={area.cardActions}>
                    <button type="button" className={area.linkBtn} onClick={() => { setEditing(a.id); setNotice(""); }}>Edit</button>
                    {!a.isDefault && <button type="button" className={area.linkBtn} disabled={busy === a.id} onClick={() => act("default", a.id)}>Make default</button>}
                    {removing === a.id ? (
                      <span className={area.confirm}>
                        Remove this address?
                        <button type="button" className={area.linkBtnDanger} disabled={busy === a.id} onClick={() => act("delete", a.id)}>Yes, remove</button>
                        <button type="button" className={area.linkBtn} onClick={() => setRemoving(null)}>Keep</button>
                      </span>
                    ) : (
                      <button type="button" className={area.linkBtn} onClick={() => setRemoving(a.id)}>Remove</button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing === "new" ? (
        <section className={area.panel} aria-label="Add an address">
          <h2 className={area.panelTitle}>{addresses.length ? "Add another address" : "Add your first delivery address"}</h2>
          <AddressForm
            defaultRecipient={name}
            defaultPhone={phone ?? ""}
            forceDefault={addresses.length === 0}
            onSaved={saved}
            onCancel={addresses.length ? () => setEditing(null) : undefined}
          />
        </section>
      ) : addresses.length < MAX_ADDRESSES ? (
        <button type="button" className={area.addBtn} onClick={() => { setEditing("new"); setNotice(""); }}>+ Add a new address</button>
      ) : (
        <p className={account.hint}>You have saved the maximum of {MAX_ADDRESSES} addresses. Remove one to add another.</p>
      )}
    </div>
  );
}
