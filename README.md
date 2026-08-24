# Romantic Apology Website

A private, one-page romantic apology site built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. It is designed to deploy cleanly on Vercel and to be edited from one configuration file.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm run build
```

## Customize The Content

Edit everything personal in:

```text
data/apology.ts
```

Before deploying, replace:

- `herName`
- `myName`
- the apology and letter text, if you want to personalize it further
- appreciation messages with her real qualities
- promise text, if needed
- final message
- `importantDate`, if you want to use it later
- theme colors, if you want a different palette

## Replace Images

Place your own optimized photos in `public/images` using these names:

- `hero.jpg`
- `memory-1.jpg`
- `memory-2.jpg`
- `memory-3.jpg`
- `memory-4.jpg`
- `memory-5.jpg`
- `memory-6.png`
- `final-photo.jpg`

Recommended image sizes:

- Hero/final images: 1800px wide or larger
- Memory images: 1200px wide or larger
- Use `.jpg` or `.webp`
- Compress images before deployment for faster loading

The current files are placeholders only.

## Optional Music

Place your song at:

```text
public/audio/our-song.mp3
```

Music stays off initially and can only begin after the opening button is pressed. If the audio file is missing, the site still works.

## Privacy Notes

This project sets `noindex` and `nofollow` metadata, but a public Vercel URL is not fully private. Anyone with the link may still be able to open it.

For stronger privacy, use one of these:

- Vercel password protection
- Vercel authentication or deployment protection
- A private route guarded by your own access code

Do not add analytics, tracking scripts, comments, forms, or social sharing buttons if you want to keep the page personal.

## Deploy To Vercel

1. Create a GitHub repository and push this project.
2. Go to `https://vercel.com/new`.
3. Import the repository.
4. Framework preset should be `Next.js`.
5. Keep the default build command: `next build`.
6. Click **Deploy**.
7. After deployment, enable Vercel deployment protection if you want the link to be less public.

## Final Checklist

- Replace `[YOUR NAME]` in `data/apology.ts`.
- Confirm her name is correct.
- Replace all placeholder photos in `public/images`.
- Add `public/audio/our-song.mp3` only if you want music.
- Read the entire letter out loud once to make sure it sounds like you.
- Test on your phone before sending.
- Consider enabling Vercel password protection.
