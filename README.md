# Shinas Samoon — Portfolio & Engineering Blog

Personal portfolio website and technical writing platform for **Shinas Samoon** ([@shinas101](https://github.com/shinas101)).

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, featuring an interactive canvas-rendered Koi Pond physics engine, project case studies, and a static Markdown blog system.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Static HTML Export `output: "export"`)
- **UI & Styling**: React 19, Tailwind CSS, Motion
- **Interactive Engine**: HTML5 Canvas ASCII/Physics Koi Pond simulation
- **Markdown & Content**: `marked`, `gray-matter` with in-memory caching and zero-allocation word counter
- **Analytics**: Vercel Analytics & PostHog with reverse-proxy rewrites
- **Deployment Target**: Cloudflare Pages / Static Edge CDN

---

## 🚀 Local Development

### Prerequisites

- **Node.js**: `20.x` or higher (see `.nvmrc`)
- **Package Manager**: `npm`

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server (Turbopack)
npm run dev

# Run automated test suites
npm test

# Build production static export (outputs to /out)
npm run build
```

The app will be available locally at `http://localhost:3000`.

---

## ☁️ Cloudflare Pages Deployment Guide

This project is optimized for direct static export deployment to **Cloudflare Pages**.

### 1. Connect Repository

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select repository: `shinas101/myPortfolio`.

### 2. Configure Build Settings

- **Framework Preset**: `Next.js (Static HTML Export)` or `None`
- **Build Command**: `npm run build`
- **Build Output Directory**: `out`
- **Node.js Version**: Handled automatically via `.nvmrc` (Node 20). Alternatively, set Environment Variable `NODE_VERSION = 20`.

### 3. Edge Routing & Headers

- **`public/_redirects`**: Automatically copied to `out/_redirects` for canonical paths and PostHog ingestion proxies.
- **`public/_headers`**: Automatically copied to `out/_headers` to enforce cache immutability on `/_next/static/*` and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

## 📁 Key Architecture

```
├── posts/                    # Markdown engineering blog posts
├── public/                   # Static media, resume.pdf, _redirects, _headers
├── src/
│   ├── app/
│   │   ├── blog/             # Blog list and dynamic slug routes (/blog/[slug])
│   │   ├── projects/         # Project case study routes (/projects/[slug])
│   │   ├── components/
│   │   │   ├── koi-pond/     # Canvas physics engine & ASCII renderer
│   │   │   └── front-page.tsx# Neo-brutalist landing page layout
│   │   ├── data/             # Structured project and experience records
│   │   └── opengraph-image.png # Pixel art OpenGraph social preview
│   └── lib/
│       └── blog.ts           # Markdown compiler, cache layer & blog services
└── test/
    └── data.test.mjs         # Unit tests (projects sorting, slug validation, caching)
```

---

## 📄 License

MIT © [Shinas Samoon](https://github.com/shinas101)
