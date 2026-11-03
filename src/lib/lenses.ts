import type { DocSection } from "./legal/types";

export type LensGuide = {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  intro: string;
  /** quick facts shown in a card beside the guide */
  glance: { label: string; value: string }[];
  sections: DocSection[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const lensGuides: LensGuide[] = [
  {
    slug: "blue-cut",
    label: "Blue-Cut",
    title: "Blue-cut lenses",
    metaDescription:
      "What blue-cut lenses are, how they work, who they suit and what the research says, explained in plain language.",
    intro:
      "Blue-cut lenses filter part of the blue light that comes from screens, LED lighting and the sun. Here is how they work, who they suit and what to expect.",
    glance: [
      { label: "Best for", value: "Long hours on screens" },
      { label: "Works with", value: "Single vision and progressive lenses, with or without a prescription" },
      { label: "Looks like", value: "Clear, sometimes with a faint tint" },
      { label: "Pairs well with", value: "An anti-glare coating" },
    ],
    sections: [
      {
        id: "what-they-are",
        title: "What blue-cut lenses are",
        body: [
          {
            p: "Blue light is a part of the visible light spectrum with short wavelengths and relatively high energy. The sun is by far our biggest source, but LED lighting and digital screens give off it too. Blue-cut lenses, also called blue-light filtering lenses, are designed to absorb or reflect a portion of it before it reaches your eyes.",
          },
        ],
      },
      {
        id: "how-they-work",
        title: "How they work",
        body: [
          {
            p: "The filter is either a coating on the lens surface or built into the lens material. Some lenses look completely clear and show a faint blue or purple reflection when you tilt them. Others carry a light yellow tint that filters more light, which can slightly warm the colours you see.",
          },
        ],
      },
      {
        id: "who-they-suit",
        title: "Who they suit",
        body: [
          {
            ul: [
              "People who spend many hours at a laptop, phone or console and want to feel more comfortable.",
              "People who are sensitive to bright, cool-toned light.",
              "Anyone who likes the idea of an extra filter and enjoys how the lenses look and feel.",
            ],
          },
        ],
      },
      {
        id: "what-the-research-says",
        title: "What the research says",
        body: [
          {
            note: {
              title: "An honest note",
              text: "Studies have not clearly shown that blue-light filtering lenses prevent eye strain or protect your eyes from damage. Most screen-related eye strain comes from how we use screens: blinking less, working for long stretches at one distance and dealing with glare.",
            },
          },
          {
            p: "Think of blue-cut lenses as a comfort option. Good habits matter more: take regular breaks, blink often, keep your screen at a comfortable distance and use good lighting. Our [guide to blue light](/blog/what-is-blue-light) explains this in more detail.",
          },
        ],
      },
      {
        id: "getting-them",
        title: "Getting blue-cut lenses",
        body: [
          {
            p: "Blue-cut lenses can be added to many frames, with or without a prescription. Speak to our team about the options, or browse our [blue-cut glasses](/blue-light-glasses).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Will blue-cut lenses change the colours I see?",
        a: "Clear versions change colours very little or not at all. Lenses with a light tint can make colours look slightly warmer, which matters if you do colour-critical work.",
      },
      {
        q: "Do I need a prescription to get them?",
        a: "No. Blue-cut lenses are available without a prescription as well as with one, so you can add them to a fashion frame or to glasses you need for vision.",
      },
      {
        q: "Do blue-cut lenses also protect against UV?",
        a: "They are separate features. Many lenses include UV protection, but you should always check that your lenses are listed as UV protective.",
      },
    ],
    related: ["anti-glare", "prescription-blue-cut", "single-vision"],
  },
  {
    slug: "anti-glare",
    label: "Anti-Glare",
    title: "Anti-glare coating",
    metaDescription:
      "How an anti-glare (anti-reflective) coating works, what it improves and how to look after your lenses.",
    intro:
      "An anti-glare coating, also called an anti-reflective or AR coating, reduces reflections on your lenses so you see more clearly and others can see your eyes.",
    glance: [
      { label: "Best for", value: "Night driving, screens and photographs" },
      { label: "Benefit", value: "Less reflection and a clearer look" },
      { label: "Works with", value: "Most clear lenses" },
      { label: "Care", value: "Clean gently with a microfibre cloth" },
    ],
    sections: [
      {
        id: "what-it-is",
        title: "What it is",
        body: [
          {
            p: "An anti-glare coating is a stack of very thin layers applied to the lens. Together, they reduce the amount of light that bounces off the front and back surfaces, so more light passes through to your eyes.",
          },
        ],
      },
      {
        id: "how-it-helps",
        title: "How it helps",
        body: [
          {
            p: "Uncoated lenses reflect a noticeable share of the light that hits them. That shows up as distracting reflections and halos around lights at night. With a good coating, reflections are much weaker, which can make vision feel sharper and more comfortable.",
          },
          {
            ul: [
              "Clearer vision when driving at night, with less glare from headlights and street lamps.",
              "Fewer reflections from screens and overhead lighting.",
              "A better look in photographs and on video calls, because people see your eyes rather than reflections.",
            ],
          },
        ],
      },
      {
        id: "things-to-know",
        title: "Things to know",
        body: [
          {
            p: "Many coatings also include a top layer that repels water, oil and dust, which makes lenses easier to keep clean. Coatings can show smudges more clearly than uncoated lenses, so a microfibre cloth is useful. A coating cannot repair scratches, so store your glasses in their case.",
          },
        ],
      },
      {
        id: "looking-after-lenses",
        title: "Looking after coated lenses",
        body: [
          {
            ol: [
              "Rinse with lukewarm water to remove dust and grit.",
              "Clean with a microfibre cloth and a lens-safe cleaner.",
              "Avoid wiping dry lenses with clothing or paper towels.",
              "Keep your glasses away from heat, such as a hot car dashboard.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is an anti-glare coating the same as blue-cut?",
        a: "No. Anti-glare reduces reflections, while blue-cut filters part of the blue light. They can be combined on the same lens.",
      },
      {
        q: "Does it make my lenses invisible?",
        a: "It reduces reflections a lot, so lenses look much clearer, but it does not make them disappear.",
      },
      {
        q: "Do sunglasses need an anti-glare coating?",
        a: "A coating on the back surface of sunglasses can reduce reflections from the light that comes from behind you, which many people find more comfortable.",
      },
    ],
    related: ["blue-cut", "single-vision", "progressive"],
  },
  {
    slug: "prescription-blue-cut",
    label: "Prescription Blue-Cut",
    title: "Prescription blue-cut lenses",
    metaDescription:
      "How prescription blue-cut lenses combine your vision correction with a blue-light filter, and what you need to order them.",
    intro:
      "Prescription blue-cut lenses combine your vision correction with a blue-light filter in a single pair, so one set of glasses can handle your screens and your day.",
    glance: [
      { label: "You need", value: "A current prescription from an eye test" },
      { label: "Lens types", value: "Single vision or progressive" },
      { label: "Options", value: "Thinner lenses and coatings" },
      { label: "Made", value: "To order, fitted to your frame" },
    ],
    sections: [
      {
        id: "how-they-work",
        title: "How they work",
        body: [
          {
            p: "Your prescription is built into the lens, and a blue-light filter is added as a coating or within the lens material. The result is one pair of glasses that corrects your vision and adds the filter you want.",
          },
        ],
      },
      {
        id: "what-you-need",
        title: "What you need",
        body: [
          {
            ul: [
              "A recent, valid prescription from an eye test. If yours is old, an eye test is the best first step.",
              "Your pupillary distance (PD), which we can measure for you.",
              "A frame you like. Not every frame suits every prescription, so we will check the fit.",
            ],
          },
        ],
      },
      {
        id: "choosing-lenses",
        title: "Choosing your lenses",
        body: [
          {
            p: "If you need one distance of correction, such as for the computer or for distance, a [single vision lens](/lenses/single-vision) is the usual choice. If you need clear vision at several distances in one pair, [progressive lenses](/lenses/progressive) are an option.",
          },
          {
            p: "Stronger prescriptions can make lenses thick and heavy. High-index materials make lenses thinner and lighter, and an [anti-glare coating](/lenses/anti-glare) is a popular addition.",
          },
        ],
      },
      {
        id: "how-to-order",
        title: "How ordering works",
        body: [
          {
            ol: [
              "Book an eye test, or share your current prescription with our team.",
              "Choose a frame that suits you and fits your prescription.",
              "Talk through lens options with our team, including blue-cut, coatings and thickness.",
              "We make the lenses and fit them to your frame, then you collect or receive your glasses.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Can I use an old prescription?",
        a: "Prescriptions change over time, so we recommend an up-to-date one. An eye test also checks your eye health, which a prescription alone does not.",
      },
      {
        q: "Can blue-cut be added to progressive lenses?",
        a: "Yes. Blue-cut filtering is commonly offered on both single vision and progressive lenses. Our team can confirm the options for your prescription.",
      },
      {
        q: "How long do prescription lenses take to make?",
        a: "Made-to-order lenses take longer than ready-made frames. We will confirm the timing when you order.",
      },
    ],
    related: ["single-vision", "progressive", "anti-glare"],
  },
  {
    slug: "single-vision",
    label: "Single Vision",
    title: "Single vision lenses",
    metaDescription:
      "What single vision lenses correct, who they suit and how to choose the right material and coatings.",
    intro:
      "Single vision lenses correct one field of vision, near, intermediate or distance, with the same power across the whole lens. They are the most common type of prescription lens.",
    glance: [
      { label: "Best for", value: "Short-sightedness, long-sightedness and astigmatism" },
      { label: "Not for", value: "Needing separate zones for near and far, where progressive lenses may suit better" },
      { label: "Materials", value: "Standard, impact-resistant and high-index" },
      { label: "Options", value: "Coatings, tints and photochromic" },
    ],
    sections: [
      {
        id: "what-they-are",
        title: "What they are",
        body: [
          {
            p: "A single vision lens has one prescription power across the whole lens. It corrects one type of vision need, such as seeing clearly in the distance or reading comfortably up close.",
          },
        ],
      },
      {
        id: "who-they-suit",
        title: "Who they suit",
        body: [
          {
            ul: [
              "People who are short-sighted and need help seeing in the distance.",
              "People who are long-sighted and need help up close.",
              "People with astigmatism, which can be corrected in a single vision lens.",
              "People who want a pair for one task, such as reading or working at a computer.",
            ],
          },
        ],
      },
      {
        id: "materials",
        title: "Choosing a material",
        body: [
          {
            ul: [
              "**Standard plastic:** a good, affordable choice for lighter prescriptions.",
              "**Impact-resistant:** a tougher material, often recommended for children and active wearers.",
              "**High-index:** thinner and lighter, which is helpful for stronger prescriptions.",
            ],
          },
        ],
      },
      {
        id: "options",
        title: "Options and coatings",
        body: [
          {
            p: "You can add an [anti-glare coating](/lenses/anti-glare), a [blue-cut filter](/lenses/blue-cut), a tint, or [photochromic](/lenses/photochromic) lenses that darken in sunlight. Our team can help you choose the combination that suits how you live.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Can I use single vision lenses for reading and distance?",
        a: "A single vision lens has one power. If you need clear vision at more than one distance in the same pair, progressive lenses may be a better fit.",
      },
      {
        q: "Are single vision lenses suitable for children?",
        a: "Yes, they are the usual choice for children. An impact-resistant material is often recommended.",
      },
      {
        q: "What does astigmatism correction look like in a single vision lens?",
        a: "Astigmatism is corrected with a cylinder and axis in your prescription. A single vision lens can include this alongside your main power.",
      },
    ],
    related: ["progressive", "photochromic", "anti-glare"],
  },
  {
    slug: "progressive",
    label: "Progressive",
    title: "Progressive lenses",
    metaDescription:
      "How progressive lenses give clear vision at every distance with no visible lines, and how to adjust to them.",
    intro:
      "Progressive lenses give you clear vision at every distance in one pair, with no visible lines, by gradually changing power from the top of the lens to the bottom.",
    glance: [
      { label: "Best for", value: "People who need help at near and far distances" },
      { label: "Adjusting", value: "Usually a few days to a couple of weeks" },
      { label: "Needs", value: "Accurate fitting measurements" },
      { label: "Options", value: "Coatings, blue-cut and photochromic" },
    ],
    sections: [
      {
        id: "what-they-are",
        title: "What they are",
        body: [
          {
            p: "A progressive lens blends several powers in one lens. The top part is for distance, the middle for intermediate distances such as a computer screen, and the bottom for reading. Unlike a bifocal, there is no visible line between the zones.",
          },
        ],
      },
      {
        id: "how-they-work",
        title: "How they work",
        body: [
          {
            p: "As your eyes move down the lens, the power increases smoothly. You look through the top of the lens for distance and lower down for reading. Between them is a corridor of intermediate vision.",
          },
        ],
      },
      {
        id: "getting-used-to-them",
        title: "Getting used to them",
        body: [
          {
            ul: [
              "Wear them consistently for the first days, rather than switching back and forth.",
              "Move your head to point your nose at what you want to see, rather than turning only your eyes.",
              "Lower your chin to read, and look through the lower part of the lens.",
              "If they still feel wrong after a couple of weeks, tell us so we can check the fit.",
            ],
          },
        ],
      },
      {
        id: "getting-a-good-fit",
        title: "Getting a good fit",
        body: [
          {
            p: "Progressive lenses depend on accurate measurements, including the height of your pupils in the frame. The frame also needs enough lens height for all the zones. Our team will help you choose a frame that works.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to adjust?",
        a: "Many people adapt within a few days to a couple of weeks. Contact us if your lenses still feel uncomfortable after that.",
      },
      {
        q: "Can I choose any frame?",
        a: "The frame needs enough height to fit all the zones of the lens. Very small or narrow frames may not suit, and we will tell you if a frame is not a good match.",
      },
      {
        q: "Are progressives good for computer work?",
        a: "Standard progressives cover distance to reading, but the intermediate zone can be narrow. Lenses designed for office use have a wider zone for screens and can be a better choice at a desk.",
      },
    ],
    related: ["single-vision", "photochromic", "prescription-blue-cut"],
  },
  {
    slug: "photochromic",
    label: "Photochromic",
    title: "Photochromic lenses",
    metaDescription:
      "How photochromic lenses darken in sunlight and clear indoors, where they work best and what to expect.",
    intro:
      "Photochromic lenses darken in sunlight and clear up indoors, so one pair of glasses can work in more situations.",
    glance: [
      { label: "Best for", value: "Moving between indoors and outdoors" },
      { label: "Activated by", value: "Ultraviolet light" },
      { label: "In the car", value: "Usually stay lighter, because windscreens block most UV" },
      { label: "Available", value: "With or without a prescription" },
    ],
    sections: [
      {
        id: "what-they-are",
        title: "What they are",
        body: [
          {
            p: "Photochromic lenses contain molecules that react to ultraviolet light. Outdoors, they darken to reduce brightness and glare. When you move indoors or into shade, they gradually return to clear.",
          },
        ],
      },
      {
        id: "how-they-behave",
        title: "How they behave",
        body: [
          {
            ul: [
              "They darken quickly in strong sunlight and clear more slowly when you come back inside.",
              "Temperature matters: lenses tend to darken less in very hot weather and more in the cold.",
              "Because car windscreens block most UV, the lenses usually stay lighter while you drive.",
            ],
          },
        ],
      },
      {
        id: "who-they-suit",
        title: "Who they suit",
        body: [
          {
            p: "They are a convenient choice if you move between indoors and outdoors often, or if you want a single pair of prescription glasses that also gives some sun comfort. They are not a full replacement for sunglasses in the brightest conditions.",
          },
        ],
      },
      {
        id: "options",
        title: "Options",
        body: [
          {
            p: "Photochromic lenses are available for [single vision](/lenses/single-vision) and [progressive](/lenses/progressive) prescriptions, and as non-prescription lenses. You can browse our [photochromic sunglasses](/sunglasses/photochromic) collection too.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do photochromic lenses block UV when they are clear?",
        a: "Many photochromic lenses block UV at all times, but you should check the specification of the lens you choose.",
      },
      {
        q: "Will they work in the car?",
        a: "They usually darken much less behind a windscreen, so they are not ideal as driving sunglasses. Some special versions respond to visible light and do darken in the car.",
      },
      {
        q: "How long do they last?",
        a: "The darkening effect can gradually fade over several years of use. Good care and avoiding extreme heat help.",
      },
    ],
    related: ["single-vision", "progressive", "blue-cut"],
  },
];

export const getLensGuide = (slug: string) => lensGuides.find((g) => g.slug === slug);
