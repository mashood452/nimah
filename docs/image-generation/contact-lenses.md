# Contact lenses page photos

The page at `/contact-lenses` shows a calm placeholder in every photo slot until a real photo exists.
**No code change is needed.** Save each photo into `public/images/contact-lenses/` with the exact file name below
(WebP is best, `.avif`, `.jpg` and `.png` also work) and it replaces the placeholder automatically. Restart the dev
server or redeploy to see new files in production.

While developing, each empty slot shows a small "Add /images/contact-lenses/..." label. It is hidden in production.

## Shared prompt

Use case: lifestyle photography for Nimah Opticals, a refined burgundy, champagne and ivory eyewear website.
Photorealistic, soft natural light, warm neutral tones, shallow depth of field, calm and premium. No text, no logos,
no watermark, no collage, no border. Natural, healthy-looking eyes, relaxed expressions, diverse and realistic people.

## Photos

| File name (without extension) | Size (px) | Ratio | What it shows |
| --- | --- | --- | --- |
| `hero-v2` | 1120 x 1400 | 4:5 | Macro close-up of a transparent contact lens on a fingertip. The lens is the main subject, against an ivory, champagne and burgundy background. |
| `clarity-before-v2` | 1200 x 900 | 4:3 | A leafy neighbourhood cafe street with low-rise sandstone storefronts, without a skyline or landmarks. See "Before and after" below. |
| `clarity-after-v2` | 1200 x 900 | 4:3 | The same scene, framed exactly the same, sharp and clear. |
| `active-before-v2` | 1200 x 900 | 4:3 | Joggers on an open coastal path beside a sandy beach and dune grass, without buildings or landmarks. See "Before and after" below. |
| `active-after-v2` | 1200 x 900 | 4:3 | The same scene, framed exactly the same, sharp and clear. |
| `type-daily` | 1200 x 900 | 4:3 | Close-up of a daily disposable lens resting on a fingertip, clean macro shot. |
| `type-monthly` | 1200 x 900 | 4:3 | A monthly lens in a clean lens case with fresh solution, ivory surface. |
| `type-toric` | 1200 x 900 | 4:3 | A toric lens seen from the side, showing its curved shape, macro shot. |
| `type-multifocal` | 1200 x 900 | 4:3 | A multifocal lens on a clean surface, soft reflections. |
| `type-coloured` | 1200 x 900 | 4:3 | Close-up of an eye wearing a natural-looking coloured lens, no heavy makeup. |
| `type-specialist` | 1200 x 900 | 4:3 | A specialist lens being examined during a fitting, clinical but warm. |
| `fitting` | 1200 x 1500 | 4:5 | An eye care professional carrying out a contact lens fitting, friendly and reassuring. |
| `care` | 1200 x 1500 | 4:5 | Clean hands holding a lens case and fresh solution, bright bathroom or desk, tidy and calm. |
| `faq` | 1200 x 1500 | 4:5 | Beside the questions: a friendly team member talking a customer through contact lenses at the counter. |

Keep every file under about 200 KB (WebP quality around 80). The site resizes them for each screen.

## Before and after sliders

There are two sliders ("Everyday clarity" and "Freedom to move"). Each one needs a `before` and an `after` photo.

* **Easiest:** save the **same sharp photo** as both `-before` and `-after`. The site blurs the "before" side itself
  and feathers the edge, so dragging melts from blurry to sharp. This is the recommended setup.
* **Or** supply a photo that is already blurry as the `-before` file. In that case turn the built-in blur off by
  setting `blur: 0` for that slider in `src/lib/contact-lenses.ts` (the `comparisons` list), so it is not blurred twice.
* Whichever you choose, both files must have the **same framing and size**, so the two sides line up when you drag.
* Until the photos exist, an eye chart placeholder shows the same blur effect.

To change the blur strength, edit `blur` (pixels) in `comparisons`. The default is 12.

## Alt text and wording

The description for each photo (used by search engines and screen readers) is already written next to it in
`src/lib/contact-lenses.ts`. Adjust it there if the photo shows something different.
The page copy, FAQs and table are in the same file.
