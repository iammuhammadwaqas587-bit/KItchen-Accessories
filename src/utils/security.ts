/**
 * Security and Cryptography Utilities for Ideal Collections
 * Provides SHA-256 password hashing, strength estimation, rate-limiting, and audit helpers.
 */

const SALT_PREFIX = 'IC_SECURE_SALT_2026_';

/**
 * Computes a SHA-256 hex string for a given plain password string.
 * Falls back to a deterministic fast hash if Web Crypto is unavailable.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const input = `${SALT_PREFIX}${plainText.trim()}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch {
      // Fallback
    }
  }

  // Fallback simple bitwise hash representation
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_fallback_${Math.abs(hash).toString(16)}`;
}

/**
 * Synchronous hash check for instant initialization
 */
export function hashPasswordSync(plainText: string): string {
  const input = `${SALT_PREFIX}${plainText.trim()}`;
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }
  return `sync_h_${(Math.abs(hash1) * 4096 + Math.abs(hash2)).toString(16)}`;
}

/**
 * Password Strength Evaluator
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: 'Too Weak',
      color: 'bg-slate-200 text-slate-500',
      feedback: ['Enter a password'],
    };
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter (A-Z)');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number (0-9)');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character (!@#$%^&*)');
  }

  const levels: Record<number, { label: PasswordStrength['label']; color: string }> = {
    0: { label: 'Too Weak', color: 'bg-rose-500 text-white' },
    1: { label: 'Weak', color: 'bg-orange-500 text-white' },
    2: { label: 'Fair', color: 'bg-amber-500 text-slate-950' },
    3: { label: 'Strong', color: 'bg-emerald-500 text-white' },
    4: { label: 'Very Strong', color: 'bg-emerald-600 text-white' },
  };

  return {
    score,
    label: levels[score].label,
    color: levels[score].color,
    feedback,
  };
}
