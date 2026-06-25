#!/usr/bin/env python3
"""Generate 1024x500 Google Play feature graphics for DailyDotKids apps."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "web" / "play-store"
WIDTH, HEIGHT = 1024, 500

APPS = [
    {
        "slug": "parent",
        "title": "DailyDotKids Parent",
        "tagline": "Live updates, daily reports & photos from your daycare",
        "accent": "#97C4A7",
        "accent_dark": "#6FA383",
        "icon": Path("/Users/ankurgupta/github/DailyDot_parent/assets/icon.png"),
    },
    {
        "slug": "teacher",
        "title": "DailyDotKids Teacher",
        "tagline": "3-tap classroom logging, reports, diary & clock in/out",
        "accent": "#F5C575",
        "accent_dark": "#D9A84E",
        "icon": Path("/Users/ankurgupta/github/DailyDot_teacher/assets/icon.png"),
    },
    {
        "slug": "admin",
        "title": "DailyDotKids Admin",
        "tagline": "Run your daycare — team, rosters, bulletins & time logs",
        "accent": "#E8AC84",
        "accent_dark": "#C98E62",
        "icon": Path("/Users/ankurgupta/github/DailyDot_admin/assets/icon.png"),
    },
]

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = FONT_CANDIDATES if bold else FONT_CANDIDATES[1:]
    for path in paths:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def blend(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_background(accent: str, accent_dark: str) -> Image.Image:
    top = blend(hex_to_rgb(accent), (255, 255, 255), 0.55)
    bottom = blend(hex_to_rgb(accent_dark), (255, 255, 255), 0.25)
    img = Image.new("RGB", (WIDTH, HEIGHT), top)
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        t = y / max(HEIGHT - 1, 1)
        color = blend(top, bottom, t)
        draw.line([(0, y), (WIDTH, y)], fill=color)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for i, (cx, cy, radius, alpha) in enumerate(
        [
            (860, 90, 180, 28),
            (940, 360, 140, 22),
            (120, 420, 120, 18),
        ]
    ):
        overlay_draw.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            fill=(*hex_to_rgb(accent), alpha),
        )
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    return mask


def draw_text_block(
    draw: ImageDraw.ImageDraw,
    title: str,
    tagline: str,
    x: int,
    y: int,
    max_width: int,
) -> None:
    title_font = load_font(54, bold=True)
    tag_font = load_font(28, bold=False)
    draw.text((x, y), title, fill="#1F2933", font=title_font)

    words = tagline.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), candidate, font=tag_font)
        if bbox[2] - bbox[0] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    line_y = y + 78
    for line in lines:
        draw.text((x, line_y), line, fill="#3D4F5F", font=tag_font)
        line_y += 38


def build_graphic(app: dict) -> Image.Image:
    canvas = make_background(app["accent"], app["accent_dark"]).convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    icon_size = 220
    icon = Image.open(app["icon"]).convert("RGBA")
    icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    mask = rounded_mask(icon_size, 44)
    icon.putalpha(mask)

    shadow = Image.new("RGBA", (icon_size + 24, icon_size + 24), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (12, 16, icon_size + 12, icon_size + 16),
        radius=44,
        fill=(31, 41, 51, 55),
    )
    canvas.alpha_composite(shadow, (72, 128))
    canvas.alpha_composite(icon, (84, 140))

    draw_text_block(
        draw,
        app["title"],
        app["tagline"],
        x=360,
        y=150,
        max_width=590,
    )

  # subtle footer brand line
    footer_font = load_font(20, bold=False)
    draw.text((360, 390), "Invitation required · Anthor Canada corp.", fill="#5C6B7A", font=footer_font)

    return canvas.convert("RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for app in APPS:
        graphic = build_graphic(app)
        out_path = OUT_DIR / f"feature-graphic-{app['slug']}.png"
        graphic.save(out_path, format="PNG", optimize=True)
        print(f"Wrote {out_path} ({graphic.size[0]}x{graphic.size[1]})")


if __name__ == "__main__":
    main()
