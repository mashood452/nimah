import { company, deliversTo, reach, returnDays } from "./shared";
import type { LegalDoc } from "./types";

export const shipping: LegalDoc = {
  slug: "shipping",
  label: "Shipping",
  title: "Shipping policy",
  metaDescription: `Where ${company} delivers, how long orders take and what to do if something goes wrong with your delivery.`,
  intro:
    "Everything you need to know about how we prepare and deliver your order, from processing to the moment it arrives.",
  sections: [
    {
      id: "where-we-deliver",
      title: "Where we deliver",
      body: [
        {
          p: `We currently deliver to ${deliversTo}. If you are outside this area, please contact us before you order and we will tell you whether we can arrange delivery to you.`,
        },
      ],
    },
    {
      id: "processing",
      title: "Order processing",
      body: [
        {
          p: "We begin preparing your order once your payment and any details we need are confirmed. You will receive a confirmation when your order is accepted.",
        },
        {
          note: {
            title: "Made-to-order items",
            text: "Prescription glasses, tinted lenses and other made-to-order items take longer than ready-to-ship frames, because the lenses are cut and fitted to your frame. We will tell you the expected timing when you order.",
          },
        },
      ],
    },
    {
      id: "delivery-times",
      title: "Delivery times",
      body: [
        {
          p: "Estimated delivery times depend on your location and on the items in your order. We confirm the estimate when you place your order. These are estimates rather than guarantees, and busy periods or events outside our control can cause delays.",
        },
      ],
    },
    {
      id: "delivery-charges",
      title: "Delivery charges",
      body: [
        {
          p: "Any delivery charge is confirmed before you pay, so there are no surprises at the door. If we run a delivery promotion, its conditions will be shown with the offer.",
        },
      ],
    },
    {
      id: "tracking",
      title: "Tracking and updates",
      body: [
        {
          p: "When your order is on its way, we will share the details you need to follow it. If your delivery partner cannot reach you, they will try to contact you to arrange another attempt.",
        },
      ],
    },
    {
      id: "receiving",
      title: "Receiving your order",
      body: [
        { p: "Please make sure someone is available to receive your delivery at the address you gave us. When it arrives:" },
        {
          ol: [
            "Check that the packaging is not damaged before you sign for it.",
            "Open the parcel and check that the items match your order.",
            "Tell us promptly if anything is missing, damaged or incorrect.",
          ],
        },
      ],
    },
    {
      id: "problems",
      title: "Damaged, lost or incorrect orders",
      body: [
        {
          p: `If your order arrives damaged, is not what you ordered, or does not arrive within the estimated time, ${reach} as soon as possible with your order number. We will investigate with our delivery partner and repair, replace or refund as appropriate.`,
        },
        {
          p: `If you simply change your mind, you can return most unworn items within ${returnDays} days. See our [Returns policy](/returns).`,
        },
      ],
    },
    {
      id: "international",
      title: "International orders and customs",
      body: [
        {
          p: "If we agree to deliver outside our usual area, import duties, taxes and customs charges may apply. These are set by the destination country, are not controlled by us, and are the responsibility of the person receiving the order unless we tell you otherwise.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [{ p: `If you have a question about delivery, ${reach}.` }],
    },
  ],
};
