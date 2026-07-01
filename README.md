# District Flow YTT Landing Page

Modern single-page landing site for the 200-Hour Teacher Training campaign.

## Stack

- Static HTML / CSS / JS
- Deploy: **Vercel**
- URL: `ytt.districtflow.com` (CNAME from Wix DNS)

## Local preview

```bash
cd ytt-landing
npx serve .
# or: python3 -m http.server 3000
```

## Deploy

```bash
cd ytt-landing
npx vercel --prod
```

## Config

Edit `js/config.js`:

- `applicationUrl` — application + payment link
- `qnaRsvpUrl` — July 22 Q&A RSVP form

## Notes

- **No tuition pricing on site** (client request). FAQ defers to post-acceptance.
- Teacher cards are placeholders until Allyssa sends bios/photos.
- Campaign context: `../README.md`
