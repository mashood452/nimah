import { addressLine, company, jurisdiction, reach, siteHost } from "./shared";
import type { LegalDoc } from "./types";

export const privacy: LegalDoc = {
  slug: "privacy",
  label: "Privacy",
  title: "Privacy policy",
  metaDescription: `How ${company} collects, uses and protects your personal information when you visit ${siteHost} or contact us.`,
  intro:
    "We respect your privacy. This policy explains what personal information we collect, why we collect it, how we use it and the choices you have.",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        {
          p: `This policy explains how ${company} (“we”, “us” or “our”) collects, uses and protects personal information when you visit ${siteHost}, contact us or buy from us. We are responsible for the personal information described in this policy.${addressLine}`,
        },
        { p: "If you have any questions about this policy, please use the details in the Contact section at the end." },
      ],
    },
    {
      id: "information-we-collect",
      title: "The information we collect",
      body: [
        { h3: "Information you give us" },
        {
          ul: [
            "Your name, email address, phone number and delivery address when you contact us or place an order.",
            "The content of messages and enquiries you send to us.",
            "Fitting, frame or prescription details that you choose to share so that we can help you.",
            "Your marketing preferences, if you tell us you would like to hear from us.",
          ],
        },
        { h3: "Information collected automatically" },
        {
          p: "When you visit our website, we and our service providers collect technical information such as your device and browser type, your approximate location based on your IP address, the pages you view, the links you click and the website you came from. We collect this using cookies and similar technologies, described in our [Cookie policy](/cookies).",
        },
        { h3: "Information stored on your device" },
        {
          p: "Your bag and wishlist are saved in your browser’s local storage, on your own device. We do not receive this information unless you choose to send it to us, for example by copying an order summary into a message.",
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use your information",
      body: [
        { p: "We use personal information to:" },
        {
          ul: [
            "respond to your enquiries and provide customer support;",
            "process and deliver orders, and manage returns and refunds;",
            "keep our website secure, and maintain and improve it;",
            "understand how visitors use our website, so we can make it better;",
            "send you marketing messages, only where you have agreed to receive them;",
            "meet our legal and regulatory obligations, and protect our rights.",
          ],
        },
      ],
    },
    {
      id: "legal-basis",
      title: "Our legal basis for using your information",
      body: [
        { p: "We only use your personal information where the law allows us to. This means that one of the following applies:" },
        {
          ul: [
            "**Consent:** you have agreed to us using your information in a particular way, for example to receive marketing. You can withdraw your consent at any time.",
            "**Contract:** we need the information to provide something you have asked for, such as delivering an order.",
            "**Legal obligation:** we are required by law to keep or share certain information.",
            "**Legitimate interests:** we have a good reason to use your information, such as keeping our website secure, and our interests do not override your rights.",
          ],
        },
      ],
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies and analytics",
      body: [
        {
          p: "We use Google Analytics to measure how our website is used. Google Analytics sets cookies and receives information such as your IP address and the pages you view. We use the results in aggregate to improve the website.",
        },
        { p: "You can read about the cookies we use, and how to control them, in our [Cookie policy](/cookies)." },
      ],
    },
    {
      id: "who-we-share-with",
      title: "Who we share information with",
      body: [
        { p: "We do not sell your personal information. We share it only with:" },
        {
          ul: [
            "service providers who help us run the business, such as website hosting, analytics, email, payment and delivery partners. They may only use your information to provide their service to us;",
            "professional advisers, such as accountants and lawyers, where needed;",
            "government bodies, regulators or law enforcement, where we are required to by law.",
          ],
        },
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      body: [
        {
          p: `Some of our service providers, including Google, may process information outside ${jurisdiction}. Where this happens, we take steps to make sure your information stays protected in line with applicable law.`,
        },
      ],
    },
    {
      id: "retention",
      title: "How long we keep your information",
      body: [
        { p: "We keep personal information only for as long as we need it for the purposes in this policy." },
        {
          table: {
            head: ["Information", "How long we keep it"],
            rows: [
              ["Enquiries and support messages", "For as long as needed to resolve your request, and for a reasonable period afterwards"],
              ["Order, invoice and payment records", "For as long as the law requires us to keep accounting and tax records"],
              ["Marketing preferences", "Until you tell us you no longer want to hear from us"],
              ["Website analytics data", "According to the retention period set in our analytics account"],
            ],
          },
        },
      ],
    },
    {
      id: "security",
      title: "Keeping your information safe",
      body: [
        {
          p: "We use reasonable technical and organisational measures to protect your personal information from loss, misuse and unauthorised access. No method of sending or storing information online is completely secure, so we cannot guarantee absolute security.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        {
          p: `Depending on the law that applies to you, including the personal data protection law of ${jurisdiction}, you may have the right to:`,
        },
        {
          ul: [
            "ask for a copy of the personal information we hold about you;",
            "ask us to correct information that is wrong or incomplete;",
            "ask us to delete your information, or to restrict how we use it;",
            "object to us using your information for certain purposes, including marketing;",
            "ask for your information in a portable format;",
            "withdraw your consent at any time, where we rely on it.",
          ],
        },
        {
          p: `To use any of these rights, ${reach}. We may need to confirm your identity first. You also have the right to complain to the relevant data protection authority.`,
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        {
          p: "Our website is intended for adults. We do not knowingly collect personal information from children without the consent of a parent or guardian. If you believe a child has given us personal information, please contact us and we will delete it.",
        },
      ],
    },
    {
      id: "other-websites",
      title: "Links to other websites",
      body: [
        {
          p: "Our website may link to other websites, such as social media. We are not responsible for the privacy practices or content of those websites, so please read their policies.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        {
          p: "We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page. If we make an important change, we will make that clear on our website.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [{ p: `If you have a question about this policy or how we use your information, ${reach}.` }],
    },
  ],
};
