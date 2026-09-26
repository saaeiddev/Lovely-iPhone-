# Lovely iPhone

Interactive iOS concept with the original apps, gallery and environment, now using the supplied **iPhone 17 Pro Max** three-dimensional model.

The original GLB is by [Ranguel](https://sketchfab.com/3d-models/phone-17-pro-max-66809964eff043a39d553c3795995008), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Its embedded texture images were resized for faster web loading; geometry and materials remain from the submitted model.

The site is deployed automatically by GitHub Actions. For local preview, run `python3 scripts/restore-model.py` before serving `index.html`.

## September 2026 upgrade

The existing phone and hotspot projection are retained. System screens and browser-compatible apps live in `upgrade.js`; the real-time Three.js residence and workstation live in `environment.js`. Third-party runtime dependencies and scene assets are local, with relative URLs for GitHub Pages. See `ASSET-CREDITS.md`.

Settings includes persisted appearance/tint, Notes saves locally, Health records a local mood, and Music/Camera accept local user files. Phone, Mail and Maps explicitly open supported external handlers rather than claiming native service integration. Connectivity switches and Messages are labelled demos.

The environment renders on demand, caps mobile pixel ratio, disables mobile shadows/antialiasing, and honors reduced motion. Failure messages preserve access to the interactive phone.
