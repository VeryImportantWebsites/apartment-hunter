@AGENTS.md

## Rules
- **No Mock Data**: Never mock, fake, or use placeholder information and images. Always use real data or leave fields empty/use graceful UI fallbacks.
- **Update Database**: When adding new apartments, always use the `update-apartment-database` skill workflow to find real data and run the Puppeteer script for real images.
