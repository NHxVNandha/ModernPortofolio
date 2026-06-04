# Modern Portfolio

Interactive personal portfolio for Kurnia Hary Trisnandha, built with React, Vite, animated UI components, 3D assets, and live GitHub activity integrations.

## Highlights

- Responsive single-page portfolio with modern motion-heavy visual design.
- GitHub profile, repository, public activity, and contribution trend sections.
- Optional private contribution summary through a serverless API endpoint.
- 3D lanyard/card interaction powered by Three.js and React Three Fiber.
- Google Stitch export showcase generated from files in `public/portofolioStitch`.
- Home music player using licensed SoundHelix example tracks.
- Reusable animated components such as dock navigation, target cursor, true focus text, and electric border cards.

## Tech Stack

- React 19
- Vite 8
- Three.js
- React Three Fiber and Drei
- GSAP
- Motion
- ESLint

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The development command regenerates Stitch project metadata before starting Vite.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

The portfolio works without environment variables, but private GitHub contribution summaries require a GitHub token.

Create `.env.local` when running locally:

```env
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=NHxVNandha
```

`GITHUB_TOKEN` is used by `api/github-private-summary.js` to query GitHub GraphQL contribution data. Do not commit `.env.local` or any secret token.

## Stitch Project Showcase

Stitch exports are stored under:

```text
public/portofolioStitch/<project-folder>/
```

Each project folder should include:

- An HTML preview file.
- A thumbnail image such as `screen.png`.
- Optional Markdown metadata, for example `DESIGN.md`.

Regenerate showcase metadata manually with:

```bash
npm run generate:stitch
```

The generated data is written to `src/data/stitchProjects.json`.

## Project Structure

```text
api/                         Serverless API endpoint for GitHub private contribution summary
public/                      Static assets, 3D card assets, profile image, and Stitch exports
scripts/                     Build-time utility scripts
src/components/              Reusable UI and animation components
src/data/                    Generated project metadata
src/App.jsx                  Main portfolio page
src/main.jsx                 React entry point
```

## Deployment

This project is optimized for Vite-compatible hosting. If the private GitHub summary endpoint is needed, deploy on a platform that supports the `api/` serverless function pattern and configure `GITHUB_TOKEN` and `GITHUB_USERNAME` as environment variables.

## Credits

- Music examples are provided by [SoundHelix](https://www.soundhelix.com/audio-examples).
- GitHub activity data is fetched from the public GitHub REST API and optional GitHub GraphQL API.

## License

No license has been specified yet. Add a license before reusing or redistributing this project.
