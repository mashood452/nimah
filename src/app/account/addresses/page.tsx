import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressBook } from "@/components/account/AddressBook";
import { listAddresses } from "@/lib/account/handlers";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Your Addresses",
  description: "Save and manage your delivery addresses at Nimah Opticals.",
  robots: { index: false, follow: true },
};

export default async function AddressesPage() {
  const customer = await requireCustomer();
  const addresses = await listAddresses(customer.id);
  return (
    <AccountShell current="addresses" title="Delivery addresses" intro="Save the places you want your orders delivered to. We deliver across the United Arab Emirates.">
      <AddressBook initial={addresses} name={customer.name} phone={customer.phone} />
    </AccountShell>
  );
}
