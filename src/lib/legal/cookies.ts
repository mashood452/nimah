import { company, reach, siteHost } from "./shared";
import type { LegalDoc } from "./types";

export const cookies: LegalDoc = {
  slug: "cookies",
  label: "Cookies",
  title: "Cookie policy",
  metaDescription: `The cookies and similar technologies ${siteHost} uses, why we use them and how you can control them.`,
  intro:
    "This policy explains which cookies and similar technologies our website uses, what they are for and how you can control them.",
  sections: [
    {
      id: "what-are-cookies",
      title: "What cookies are",
      body: [
        {
          p: "Cookies are small text files that a website stores on your device when you visit. They help a website remember information about your visit and understand how it is used. Similar technologies, such as your browser’s local storage, do a comparable job.",
        },
      ],
    },
    {
      id: "how-we-use-cookies",
      title: "How we use them",
      body: [
        { p: `${company} uses a small number of cookies and similar technologies for two purposes:` },
        {
          ul: [
            "**Analytics:** to understand how visitors use our website, such as which pages are viewed most, so that we can improve it. We use Google Analytics for this.",
            "**Remembering your choices:** to keep your bag and wishlist on your device between visits.",
          ],
        },
        { p: "We do not use cookies to show you third-party advertising." },
      ],
    },
    {
      id: "cookies-we-use",
      title: "Cookies we use",
      body: [
        {
          table: {
            head: ["Name", "Provider", "Purpose", "Duration"],
            rows: [
              ["_ga", "Google Analytics", "Tells returning visitors apart so we can count visits accurately", "Up to 2 years"],
              ["_ga_ followed by an ID", "Google Analytics", "Keeps track of the current visit and session", "Up to 2 years"],
            ],
          },
        },
        {
          p: "Google Analytics collects information such as the pages you visit and your approximate location, and sends it to Google. You can read how Google handles this data in [Google’s privacy policy](https://policies.google.com/privacy).",
        },
      ],
    },
    {
      id: "browser-storage",
      title: "Browser storage",
      body: [
        {
          p: "We also use your browser’s local storage to remember your bag and wishlist. This information stays on your device and is not sent to us.",
        },
        {
          table: {
            head: ["Key", "Purpose"],
            rows: [
              ["nimah.cart.v1", "Remembers the items in your bag"],
              ["nimah.wishlist.v1", "Remembers the items you have saved to your wishlist"],
            ],
          },
        },
      ],
    },
    {
      id: "your-choices",
      title: "Your choices",
      body: [
        {
          p: "You can control cookies in your browser settings. Most browsers let you block or delete cookies, and tell you when a cookie is being set. If you block cookies, parts of our website may work differently.",
        },
        {
          p: "To stop Google Analytics from collecting data about your visits across all websites, you can install the [Google Analytics opt-out browser add-on](https://tools.google.com/dlpage/gaoptout).",
        },
        {
          p: "You can clear your bag and wishlist at any time from the Bag page, or by clearing your browser’s site data.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        {
          p: "We may update this policy if we change the cookies we use. We will change the “Last updated” date above when we do. For more about how we use personal information, see our [Privacy policy](/privacy).",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [{ p: `If you have a question about our use of cookies, ${reach}.` }],
    },
  ],
};
