# Rafiif Dzakwan — Portfolio

Built with [Astro 7](https://astro.build), React 19, Tailwind CSS v4 and TypeScript. Static output, deployed on Vercel:
https://rafiif-portofolio.vercel.app

Interactive pieces are React islands in `src/components/react/`:

| Component         | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `IntroHero`       | Full-screen intro: giant name, cut-out portrait, parallax, HUD      |
| `Lanyard`         | 3D ID card on a physics rope (three.js + Rapier), drag to swing it  |
| `LanyardIsland`   | Static card first, lazy-loads the 3D lanyard when the browser idles |
| `HeroHeadline`    | Blur-in headline with rotating phrase                               |
| `DotGrid`         | Hero background dots that react to the cursor                       |
| `Dock`            | Floating macOS-style section nav with magnification                 |
| `Cursor`          | Custom cursor ring (mouse only)                                     |
| `Magnet`          | Buttons that pull toward the cursor                                 |
| `TiltCard`        | 3D tilt + spotlight on project cards                                |
| `VelocityMarquee` | Marquee that speeds up with scroll velocity                         |
| `CountUp`         | Animated stat numbers                                               |

All effects respect `prefers-reduced-motion`. Smooth scrolling uses Lenis.

## Requirements

Node.js **24 LTS** (Astro 7 needs at least 22.22).

## Commands

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm install`     | Install dependencies                  |
| `npm run dev`     | Dev server at http://localhost:4321   |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Preview the production build          |

## Editing content

All content lives in `src/data/` — no need to touch components:

- `site.ts` — name, email, CV link, social links
- `experience.ts` — work, leadership and education
- `projects.ts` — projects (set `featured: true` for the large cards, `draft: true` to hide)
- `skills.ts` — skill groups
- `certifications.ts` — certificates

Images go in `src/assets/` and are optimized automatically at build time.
Videos go in `public/media/` and are referenced from a project's `video` field.

The intro portrait is `src/assets/portrait-cutout.png` (transparent background). To change it, replace that file with another PNG cut-out of the same style.

### Adding a project

1. Put screenshots in `src/assets/projects/<slug>/`.
2. Import them at the top of `src/data/projects.ts` and add an entry to the `projects` array.
3. A case-study page is generated automatically at `/projects/<slug>/`.

## Deploying

Every push to `main` on `Mrafiif/Rafiif-Portofolio` is built and deployed by Vercel.
`vercel.json` tells Vercel this is an Astro project (build `npm run build`, output `dist/`).
