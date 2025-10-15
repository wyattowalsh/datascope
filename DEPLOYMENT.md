# DataScope - Vercel Deployment Guide

This document provides instructions for deploying DataScope to Vercel at https://datascope.w4w.dev

## Prerequisites

- Vercel account with access to deploy to w4w.dev domain
- Git repository connected to Vercel
- Node.js 18+ for local testing

## Deployment Configuration

The project is configured with `vercel.json` for optimal deployment:

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (recommended)

### Environment Variables
No environment variables are required for basic deployment.

### Custom Domain Setup

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add custom domain: `datascope.w4w.dev`
4. Configure DNS records as instructed by Vercel:
   - Type: CNAME
   - Name: datascope
   - Value: cname.vercel-dns.com

### Google Tag Manager Integration

The application includes Google Tag Manager (GTM) integration with ID: `GTM-KDKW33HQ`

GTM is loaded in two places for complete coverage:
1. **Head script**: Async loading in `<head>` tag
2. **Noscript fallback**: Iframe fallback in `<body>` for users with JavaScript disabled

No additional configuration needed - GTM will automatically track:
- Page views
- Navigation events
- User interactions (as configured in GTM dashboard)

## Deployment Steps

### Automatic Deployment (Recommended)

1. Push changes to your main branch
2. Vercel will automatically build and deploy
3. Monitor deployment at vercel.com/dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Performance Optimizations

The deployment includes:

- **Asset Caching**: Static assets cached for 1 year with immutable headers
- **Security Headers**: 
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: enabled
  - Referrer-Policy: strict-origin-when-cross-origin
- **SPA Routing**: All routes rewrite to index.html for client-side routing
- **Clean URLs**: Trailing slashes removed for consistency

## Testing Deployment

After deployment, verify:

1. ✅ Site loads at https://datascope.w4w.dev
2. ✅ All data formats parse correctly (JSON, YAML, JSONL, CSV)
3. ✅ Theme toggle works (light/dark mode)
4. ✅ File upload and URL loading function
5. ✅ Graph visualizations render properly
6. ✅ GTM tracking fires (check browser Network tab for gtm.js)

## Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Verify all dependencies are in package.json
- Run `npm run build` locally to identify issues

### 404 Errors on Routes
- Verify rewrites configuration in vercel.json
- Ensure all routes redirect to /index.html

### GTM Not Tracking
- Verify GTM container ID is GTM-KDKW33HQ
- Check browser console for GTM errors
- Test with Google Tag Assistant extension

### Domain Not Resolving
- Verify DNS CNAME record points to cname.vercel-dns.com
- Allow up to 48 hours for DNS propagation
- Use DNS checker tool to verify propagation

## Monitoring

Monitor your deployment:
- **Vercel Analytics**: Built-in analytics in Vercel dashboard
- **GTM Dashboard**: Track user behavior and conversions
- **Error Tracking**: Check Vercel function logs for runtime errors

## Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in Vercel dashboard
3. Test locally with `npm run build && npm run preview`
