import { company, reach, refundDays, returnDays } from "./shared";
import type { LegalDoc } from "./types";

export const returns: LegalDoc = {
  slug: "returns",
  label: "Returns",
  title: "Returns and exchanges",
  metaDescription: `How to return or exchange an item from ${company}, which items we cannot accept back and how refunds work.`,
  intro:
    "We want you to love your eyewear. If it is not right, this page explains how to return or exchange it and what to expect.",
  sections: [
    {
      id: "our-promise",
      title: "Our promise",
      body: [
        {
          p: "Choosing glasses is personal. If a pair does not feel right when it arrives, tell us and we will help you return or exchange it, as long as it meets the conditions below.",
        },
      ],
    },
    {
      id: "return-window",
      title: "Return window",
      body: [
        {
          p: `You can return eligible items within **${returnDays} days** of the day you receive them. Please contact us within that time to start your return.`,
        },
      ],
    },
    {
      id: "conditions",
      title: "Conditions for a return",
      body: [
        { p: "To be eligible, an item must be:" },
        {
          ul: [
            "unworn and unused, in the same condition you received it;",
            "free from scratches, marks and damage;",
            "returned with its original case, cloth and packaging, and any included accessories;",
            "accompanied by your order number or proof of purchase.",
          ],
        },
      ],
    },
    {
      id: "not-returnable",
      title: "Items we cannot take back",
      body: [
        { p: "For hygiene and practical reasons, we cannot accept returns of:" },
        {
          ul: [
            "made-to-order items, including glasses with lenses cut to your prescription or tinted to order;",
            "contact lenses once the sealed packaging has been opened;",
            "items damaged through misuse, accidents or normal wear;",
            "gift cards, and items clearly marked as final sale.",
          ],
        },
        {
          p: "This does not affect your rights if an item is faulty or not as described. See the section on faulty items below.",
        },
      ],
    },
    {
      id: "how-to-return",
      title: "How to start a return",
      body: [
        {
          ol: [
            `${reach.charAt(0).toUpperCase() + reach.slice(1)} with your order number and the reason for your return.`,
            "We will confirm whether the item is eligible and explain how to send it back.",
            "Pack the item securely with its case and all accessories.",
            "Send it back as we explain. Keep your proof of postage until we confirm we have received it.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      body: [
        {
          p: `Once we have received and checked your return, we will confirm whether it is approved. Approved refunds go to your original payment method within ${refundDays} business days. Your bank or card provider may take a little longer to show the refund.`,
        },
      ],
    },
    {
      id: "exchanges",
      title: "Exchanges",
      body: [
        {
          p: "If you would like a different colour or style, contact us and we will help you swap it, subject to availability. If the new item costs more or less, we will explain the difference before you confirm.",
        },
      ],
    },
    {
      id: "faulty-items",
      title: "Faulty or damaged items",
      body: [
        {
          p: "If an item arrives faulty, damaged or not as described, contact us as soon as you can. We will repair, replace or refund it as appropriate, and we will cover the cost of returning it. Your legal rights under applicable consumer protection law are not affected by this policy.",
        },
      ],
    },
    {
      id: "return-costs",
      title: "Return delivery costs",
      body: [
        {
          p: "If you return an item because you changed your mind, you are responsible for the cost of sending it back. We will cover return delivery if the item is faulty, damaged on arrival or not what you ordered.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [{ p: `If you have a question about a return or exchange, ${reach}.` }],
    },
  ],
};
