/**
 * Security & Hardening Utilities
 * - Cryptographic Passcode Verification (SHA-256)
 * - Anti-XSS Input Sanitization
 * - Anti-Brute-Force Rate Limiting
 */

const DEFAULT_ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

/**
 * Computes SHA-256 cryptographic hash of a string using Web Crypto API.
 */
export async function hashString(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

/**
 * Verifies if an entered password matches the stored admin SHA-256 hash.
 */
export async function verifyAdminPasscode(inputPassword: string): Promise<boolean> {
  const storedHash = localStorage.getItem('myheartcraft_admin_hash') || DEFAULT_ADMIN_HASH;
  const inputHash = await hashString(inputPassword);
  return inputHash === storedHash;
}

/**
 * Updates the stored admin password by saving its SHA-256 hash.
 */
export async function updateAdminPasscode(newPassword: string): Promise<void> {
  const newHash = await hashString(newPassword);
  localStorage.setItem('myheartcraft_admin_hash', newHash);
  // Remove plain text if present
  localStorage.removeItem('myheartcraft_admin_passcode');
}

/**
 * Anti-XSS Sanitizer: Strips malicious HTML tags, scripts, javascript: links, and event handlers.
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Anti-Brute-Force Rate Limiter Helper
 */
export class RateLimiter {
  private failedAttempts: number = 0;
  private lockedUntil: number = 0;

  public isLocked(): boolean {
    return Date.now() < this.lockedUntil;
  }

  public getRemainingSeconds(): number {
    if (!this.isLocked()) return 0;
    return Math.ceil((this.lockedUntil - Date.now()) / 1000);
  }

  public recordFailedAttempt(): void {
    this.failedAttempts += 1;
    if (this.failedAttempts >= 5) {
      this.lockedUntil = Date.now() + 60000; // 60s lockout
      this.failedAttempts = 0;
    }
  }

  public reset(): void {
    this.failedAttempts = 0;
    this.lockedUntil = 0;
  }
}
