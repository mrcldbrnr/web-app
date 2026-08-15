import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Ohne Server/API/Login braucht diese App keine externen Quellen; `data:`
 * bei img-src ist nötig für Foto-Uploads und die Demo-Icons (siehe
 * ItemImage.tsx). `unsafe-inline` bei script-/style-src ist die von Next.js
 * empfohlene Variante ohne Proxy-Nonce (siehe next/dist/docs/.../
 * content-security-policy.md, Abschnitt "Without Nonces") – ein
 * Proxy/Middleware wird hier bewusst vermieden.
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
