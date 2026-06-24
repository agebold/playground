# Ads videos — drop your files here

The **Ads** step (`00-ads.html`) plays two vertical videos, one at a time.
Upload your two videos into **this folder** with these exact filenames:

| Slot     | Filename                  |
| -------- | ------------------------- |
| Video 1  | `assets/ads/ad-1.mp4`     |
| Video 2  | `assets/ads/ad-2.mp4`     |

Until the files exist, each slide shows a dashed "upload your video here"
placeholder, so the prototype still runs.

## Recommended export settings (for smooth playback)

- **Orientation / ratio:** vertical **9:16** (e.g. 1080 × 1920)
- **Format:** **MP4**, **H.264** video codec (most compatible / hardware-decoded)
- **Audio:** any — the player is permanently **muted** (no sound ever plays)
- **Frame rate:** 30 fps
- **Length:** short loops play best (≈ 6–20 s); the video loops automatically
- **File size:** keep each under ~10 MB so it buffers and starts instantly

If your source files have different names, either rename them to `ad-1.mp4` /
`ad-2.mp4`, or tell me the filenames and I'll update the `<source>` tags.
