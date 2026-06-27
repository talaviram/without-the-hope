# Without the Hope

Static HTML5 site for [woth.talaviram.com](https://woth.talaviram.com/).

The site has no build step or runtime dependencies. The modern site lives at `/`;
the previous plain-HTML site is preserved at `/legacy/`, and the original Flash
archive remains at `/flash/`.

## Local preview

Run any static HTTP server from the repository root. For example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080/`. Opening `index.html` directly is not
recommended because browser media behavior differs for `file:` URLs.

## Cloudflare Pages connected to GitHub

1. Push this directory to a GitHub repository.
2. In Cloudflare Pages, create a project connected to that repository.
3. Select no framework preset, leave the build command empty, and set the output
   directory to `/`.
4. Add `woth.talaviram.com` as the Pages custom domain.
5. After the preview URL works, replace the existing DNS target when Cloudflare
   prompts you.

The `_headers` file is applied by Cloudflare Pages. Every current site asset is
below the Pages per-file limit; Git LFS is neither required nor appropriate.

## GitHub Pages alternative

The included `CNAME` and `.nojekyll` files prepare the repository for branch-based
GitHub Pages:

1. In repository settings, enable Pages from the `main` branch and `/ (root)`.
2. Set the `woth` DNS record to the GitHub Pages hostname shown by GitHub.
3. Confirm `woth.talaviram.com` under the Pages custom-domain setting and enable
   HTTPS after DNS validation completes.

## Media

The nine streaming MP3 files are served from `/flash/media/` and should be
committed as normal Git files. The three larger album ZIP archives remain at
`www.talaviram.com/media/`; they can later be migrated to Cloudflare R2 without
changing the player.
