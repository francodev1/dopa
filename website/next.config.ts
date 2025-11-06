import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // OWASP A05: Security Misconfiguration - Headers de Segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // OWASP A03: Injection - Prevenir XSS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // OWASP A01: Broken Access Control - Prevenir Clickjacking
          // Temporariamente desabilitado para Clerk funcionar
          // {
          //   key: 'X-Frame-Options',
          //   value: 'DENY',
          // },
          // OWASP A03: Injection - XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // OWASP A05: Security Misconfiguration - Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // OWASP A05: Security Misconfiguration - Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // OWASP A02: Cryptographic Failures - HSTS (apenas em produção com HTTPS)
          // Desabilitado em localhost
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=31536000; includeSubDomains',
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
