# Alejandro Avila — Portfolio

Personal portfolio website for **Alejandro Avila Gómez**, Cloud & Telecom Engineer.

**Live**: [https://alejandrodevai.cloud](https://alejandrodevai.cloud)

## Stack

- Vanilla HTML, CSS, and JavaScript (ES modules) — no framework, no build step
- JSON-driven content with ES/EN i18n
- EmailJS for the contact form
- Deployable as static files (GitHub Pages) or as a Docker container (`nginx:alpine`)

## Run locally

### Option 1 — Python (simplest, no dependencies)

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

### Option 2 — Docker (mirrors production on the containerized path)

```bash
cp .env.example .env   # fill in EmailJS credentials
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

## Project structure

```
.
├── index.html              # Entry point
├── css/styles.css          # Styles
├── js/
│   ├── main.js             # Animations, navigation, contact form
│   ├── i18n.js             # ES/EN translation engine
│   └── config.js           # EmailJS credentials
├── data/content.json       # All site text (ES + EN)
├── assets/images/          # Photos (EXIF stripped)
├── CNAME                   # GitHub Pages custom domain
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── Dockerfile              # Alternative containerized deploy
├── nginx.conf              # nginx config for containerized deploy
├── docker-compose.yml      # Local dev with Docker
├── docker-entrypoint.sh    # EmailJS env var injection for Docker
└── .env.example            # Credential template
```

## Deployment

Deployed to **GitHub Pages** with a custom domain (`alejandrodevai.cloud`). Every push to `main` triggers an automatic redeploy.

## License

Content and imagery © Alejandro Avila Gómez. Source code available for reference.
