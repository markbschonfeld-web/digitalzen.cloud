/*
 * Cloudflare Worker: Dynamic OG Image Generator
 *
 * Serves archetype-specific OG images as SVGs for social sharing.
 * Route: /og/:archetype.svg
 *
 * Each archetype gets a unique visual treatment matching its theme.
 */

const ARCHETYPES = {
  architect: {
    name: 'The Architect',
    tagline: 'Your night mode: Precision',
    color: 'rgba(170, 185, 210, 1)',
    colorDim: 'rgba(170, 185, 210, 0.08)',
  },
  ghost: {
    name: 'The Ghost',
    tagline: 'Your night mode: Subtracted',
    color: 'rgba(255, 255, 255, 0.6)',
    colorDim: 'rgba(255, 255, 255, 0.03)',
  },
  circuit: {
    name: 'The Circuit',
    tagline: 'Your night mode: Restless',
    color: 'rgba(232, 93, 58, 1)',
    colorDim: 'rgba(232, 93, 58, 0.08)',
  },
  twam: {
    name: 'The 2AM',
    tagline: 'Your night mode: Generative',
    color: 'rgba(200, 160, 40, 1)',
    colorDim: 'rgba(200, 160, 40, 0.08)',
  },
  minimalist: {
    name: 'The Minimalist',
    tagline: 'Your night mode: Refined',
    color: 'rgba(255, 255, 255, 0.8)',
    colorDim: 'rgba(255, 255, 255, 0.04)',
  },
  operator: {
    name: 'The Operator',
    tagline: 'Your night mode: Calculated',
    color: 'rgba(42, 111, 255, 1)',
    colorDim: 'rgba(42, 111, 255, 0.08)',
  },
  engineer: {
    name: 'The Night Engineer',
    tagline: 'Your night mode: Exacting',
    color: 'rgba(80, 130, 200, 1)',
    colorDim: 'rgba(80, 130, 200, 0.08)',
  },
  phantom: {
    name: 'The Phantom',
    tagline: 'Your night mode: Contradictory',
    color: 'rgba(150, 100, 190, 1)',
    colorDim: 'rgba(150, 100, 190, 0.08)',
  },
  builder: {
    name: 'The Quiet Builder',
    tagline: 'Your night mode: Meditative',
    color: 'rgba(165, 130, 85, 1)',
    colorDim: 'rgba(165, 130, 85, 0.08)',
  },
  nocturnal: {
    name: 'The Nocturnal',
    tagline: 'Your night mode: Untamed',
    color: 'rgba(230, 45, 45, 1)',
    colorDim: 'rgba(230, 45, 45, 0.1)',
  },
};

function generateOgSvg(archKey) {
  const arch = ARCHETYPES[archKey];
  if (!arch) return null;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${arch.colorDim}"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="30%">
      <stop offset="0%" stop-color="${arch.colorDim}"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <circle cx="600" cy="260" r="80" fill="none" stroke="${arch.color}" stroke-width="1" opacity="0.15"/>
  <circle cx="600" cy="260" r="120" fill="none" stroke="${arch.color}" stroke-width="0.5" opacity="0.08"/>
  <circle cx="600" cy="260" r="160" fill="none" stroke="${arch.color}" stroke-width="0.5" opacity="0.04"/>
  <text x="600" y="180" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="500" letter-spacing="6" fill="rgba(196,30,30,0.8)">I GOT</text>
  <text x="600" y="290" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="700" fill="#f0ede8" letter-spacing="-1">${arch.name.toUpperCase()}</text>
  <text x="600" y="345" text-anchor="middle" font-family="monospace" font-size="16" font-weight="400" letter-spacing="4" fill="${arch.color}" opacity="0.8">${arch.tagline.toUpperCase()}</text>
  <line x1="480" y1="400" x2="720" y2="400" stroke="${arch.color}" stroke-width="0.5" opacity="0.2"/>
  <text x="600" y="440" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="300" fill="rgba(138,134,128,0.8)">What&apos;s your night mode?</text>
  <text x="600" y="480" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="500" letter-spacing="2" fill="rgba(240,237,232,0.4)">digitalzen.cloud</text>
  <text x="600" y="570" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" letter-spacing="5" fill="rgba(240,237,232,0.15)">DIGITAL ZEN</text>
</svg>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/og\/([a-z]+)\.svg$/);

    if (!match) {
      return new Response('Not found', { status: 404 });
    }

    const archKey = match[1];
    const svg = generateOgSvg(archKey);

    if (!svg) {
      return new Response('Unknown archetype', { status: 404 });
    }

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
