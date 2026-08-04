import sharp from "sharp";
import { mkdirSync } from "node:fs";

const slugs = [
  ["markupless", "#F59E0B"],
  ["malas-finance", "#F97316"],
  ["zevy-note", "#EAB308"],
  ["visual-code-space", "#FBBF24"],
  ["imphnen-skor", "#D97706"],
  ["google-reverse-image-api", "#F59E0B"],
  ["task-manager", "#B45309"],
  ["personal-finance-tracker", "#EA580C"],
];

const W = 1200;
const H = 900;

function svg(slug, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0A0908"/>
  <circle cx="200" cy="200" r="320" fill="${accent}" opacity="0.14"/>
  <circle cx="${W - 150}" cy="${H - 180}" r="420" fill="${accent}" opacity="0.08"/>
  <rect x="0" y="0" width="${W}" height="1" fill="${accent}" opacity="0.5"/>
  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="${accent}" opacity="0.3"/>
  <line x1="60" y1="${H - 140}" x2="${W - 60}" y2="${H - 140}" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
</svg>`;
}

mkdirSync("static/covers", { recursive: true });

for (const [slug, accent] of slugs) {
  const buffer = Buffer.from(svg(slug, accent));
  await sharp(buffer)
    .resize(1200, 900, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(`static/covers/${slug}-1200.webp`);
  await sharp(buffer)
    .resize(600, 450, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(`static/covers/${slug}-600.webp`);
  console.log(`cover: ${slug}`);
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0908"/>
  <circle cx="180" cy="160" r="280" fill="#F59E0B" opacity="0.18"/>
  <circle cx="1100" cy="520" r="360" fill="#F59E0B" opacity="0.1"/>
  <rect y="0" width="1200" height="2" fill="#F59E0B" opacity="0.6"/>
  <rect y="628" width="1200" height="2" fill="#F59E0B" opacity="0.4"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("static/og.png");
console.log("og.png");
