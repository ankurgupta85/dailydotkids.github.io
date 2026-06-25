# Google Play feature graphics (1024 × 500)

Upload these in Play Console → **Main store listing** → **Feature graphic**.

| File | App |
|------|-----|
| `feature-graphic-parent.png` | DailyDotKids Parent |
| `feature-graphic-teacher.png` | DailyDotKids Teacher |
| `feature-graphic-admin.png` | DailyDotKids Admin |

## Regenerate

From repo root:

```bash
python3 -m venv .venv-graphics
.venv-graphics/bin/pip install Pillow
.venv-graphics/bin/python scripts/generate-play-feature-graphics.py
```

Uses each app’s `assets/icon.png` and adaptive-icon background colors (parent green, teacher gold, admin peach).
