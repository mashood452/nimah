# Coloured lenses page photos

The page at `/coloured-lenses` uses generated photographs for every photo slot. See
[the generation notes](coloured-lenses-generated.md) for the saved assets and exact prompts. If a photo is missing,
the slot falls back to an eye illustration in the matching shade.
**No code change is needed.** Save each photo into `public/images/coloured-lenses/` with the exact file name below
(WebP is best, `.avif`, `.jpg` and `.png` also work) and it replaces the placeholder automatically. Restart the dev
server or redeploy to see new files in production.

While developing, each empty slot shows a small "Add /images/coloured-lenses/..." label. It is hidden in production.

## Shared prompt

Use case: lifestyle and beauty photography for Nimah Opticals, a refined burgundy, champagne and ivory eyewear website.
Photorealistic, soft natural light, warm neutral tones, shallow depth of field, calm and premium. No text, no logos,
no watermark, no collage, no border. Natural, healthy-looking eyes, relaxed expressions, diverse and realistic people.
Eyes should look natural and comfortable (no red or irritated eyes, no heavy eye makeup, no costume or "cat eye" effects).

## Photos

| File name (without extension) | Size (px) | Ratio | What it shows |
| --- | --- | --- | --- |
| `hero` | 1120 x 1400 | 4:5 | Macro close-up of a sage-green coloured contact lens on a fingertip, with its patterned iris ring and clear centre in focus. Displayed in a curved frame with a tighter crop. |
| `shade-hazel` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a natural hazel lens. |
| `shade-honey` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a warm honey or amber lens, golden light. |
| `shade-green` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a green lens. |
| `shade-blue` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a blue lens. |
| `shade-grey` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a grey lens, cool daylight. |
| `shade-brown` | 1200 x 900 | 4:3 | Macro close-up of one eye wearing a rich dark brown lens. |
| `shade-before` | 1200 x 900 | 4:3 | The natural eye colour, close-up. See "Before and after" below. |
| `shade-after` | 1200 x 900 | 4:3 | The same eye, framed exactly the same, wearing a coloured lens. |
| `fitting` | 1120 x 1400 | 4:5 | An eye care professional fitting a coloured lens for a customer, friendly and reassuring. |
| `care` | 1120 x 1400 | 4:5 | Clean hands holding a coloured lens above a lens case with fresh solution, tidy and calm. |
| `faq` | 1120 x 1400 | 4:5 | An optical adviser helping a customer choose a shade at the counter. |

Keep every file under about 200 KB (WebP quality around 80). The site resizes them for each screen.

## Before and after

The "See the colour" slider needs a `shade-before` and a `shade-after` photo. Use two **different** photos of the
**same eye with the same framing and size**, so the two sides line up when you drag. Unlike the contact lenses page,
nothing is blurred (`blur` is 0), because this slider compares colour, not sharpness. The before layer also keeps its
original crop and saturation, so it aligns with the after image and shows the intended colour faithfully.

## Alt text and wording

The description for each photo (used by search engines and screen readers) is already written next to it in
`src/lib/coloured-lenses.ts`. Adjust it there if the photo shows something different.
The shades, lens kinds, steps, safety tips and FAQs are in the same file.
