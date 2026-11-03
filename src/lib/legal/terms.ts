import { addressLine, company, jurisdiction, reach, returnDays, siteHost } from "./shared";
import type { LegalDoc } from "./types";

export const terms: LegalDoc = {
  slug: "terms",
  label: "Terms",
  title: "Terms of service",
  metaDescription: `The terms that apply when you use ${siteHost} and buy from ${company}.`,
  intro:
    "These terms set out the rules for using our website and buying from us. Please read them before you place an order.",
  sections: [
    {
      id: "about",
      title: "About these terms",
      body: [
        {
          p: `These terms apply to your use of ${siteHost} and to any order you place with ${company} (“we”, “us” or “our”). By using our website or placing an order, you agree to these terms.${addressLine}`,
        },
        { p: "If you do not agree to these terms, please do not use our website." },
      ],
    },
    {
      id: "using-the-website",
      title: "Using our website",
      body: [
        { p: "You agree to use our website lawfully and in a way that does not harm it or other users. You must not:" },
        {
          ul: [
            "try to gain unauthorised access to our website, servers or systems;",
            "introduce viruses or other harmful code;",
            "copy, scrape or resell our content without our written permission;",
            "use our website to send spam or misleading information.",
          ],
        },
      ],
    },
    {
      id: "products",
      title: "Products and information",
      body: [
        {
          p: "We take care to describe and photograph our products accurately. Colours on screen can differ slightly from the real product, and frame sizes and finishes may vary a little between batches.",
        },
        {
          note: {
            title: "Not medical advice",
            text: "Information on our website, including our guides and FAQs, is general. It is not medical advice and does not replace an eye test or advice from a qualified eye care professional.",
          },
        },
        {
          p: "Prescription glasses and lenses need a valid, up-to-date prescription. You are responsible for giving us accurate prescription and measurement details.",
        },
      ],
    },
    {
      id: "prices-and-payment",
      title: "Prices and payment",
      body: [
        {
          p: "Prices are shown in the currency displayed on the website and include any taxes that apply, unless we say otherwise. Delivery charges, if any, are confirmed before you pay.",
        },
        {
          p: "We take care to keep prices correct, but errors can happen. If a product is listed at the wrong price, we may cancel the order and refund any payment you have made, or contact you to ask whether you would still like to buy at the correct price.",
        },
      ],
    },
    {
      id: "orders",
      title: "Placing an order",
      body: [
        {
          p: "When you place an order, we will confirm that we have received it. A contract between us is formed when we confirm that your order has been accepted and, where relevant, shipped.",
        },
        {
          p: "We may decline or cancel an order, for example if an item is unavailable, if we cannot verify your details or if we suspect misuse. If we cancel an order after you have paid, we will refund you in full.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery",
      body: [
        {
          p: "Delivery times, areas and charges are explained in our [Shipping policy](/shipping). Delivery dates are estimates, and delays can happen. We will keep you informed if your order is affected.",
        },
      ],
    },
    {
      id: "returns",
      title: "Returns and refunds",
      body: [
        {
          p: `You can return most unworn items within ${returnDays} days of delivery. Full details, including items we cannot accept back and how refunds work, are in our [Returns policy](/returns).`,
        },
        {
          p: "Nothing in these terms or our policies limits any rights you have under applicable consumer protection law, including your rights if an item is faulty or not as described.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        {
          p: `The content of this website, including text, images, graphics, logos and design, belongs to ${company} or its licensors and is protected by intellectual property law. You may view and print pages for your own personal use, but you may not copy or reuse them commercially without our written permission.`,
        },
      ],
    },
    {
      id: "third-party-brands",
      title: "Third-party brands",
      body: [
        {
          p: "Brand names and logos shown on this website belong to their respective owners. They are shown to identify the products and brands we sell. Their appearance does not mean that those brands endorse us or this website.",
        },
      ],
    },
    {
      id: "liability",
      title: "Our responsibility to you",
      body: [
        {
          p: "We are responsible for losses you suffer that are a foreseeable result of us breaking these terms or failing to use reasonable care and skill. We are not responsible for losses that were not foreseeable, or for business losses.",
        },
        {
          p: "Nothing in these terms excludes or limits our responsibility where it would be unlawful to do so, including responsibility for fraud or for death or personal injury caused by our negligence.",
        },
      ],
    },
    {
      id: "links",
      title: "Links and third-party services",
      body: [
        {
          p: "Our website may contain links to other websites and use third-party services such as analytics. We do not control these and are not responsible for them.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy and cookies",
      body: [
        {
          p: "How we handle your personal information is explained in our [Privacy policy](/privacy), and how we use cookies is explained in our [Cookie policy](/cookies).",
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [
        {
          p: `These terms are governed by the laws of ${jurisdiction}. If we cannot resolve a dispute informally, the courts of ${jurisdiction} will have jurisdiction, although this does not limit any rights you have under mandatory consumer protection law.`,
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        {
          p: "We may update these terms from time to time. The terms that apply to an order are the ones in force when you place it. We will change the “Last updated” date above whenever we make changes.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [{ p: `If you have any questions about these terms, ${reach}.` }],
    },
  ],
};
