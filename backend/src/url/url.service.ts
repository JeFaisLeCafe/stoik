import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 6;
const MAX_RETRIES = 5;
const ALLOWED_PROTOCOLS = ["http:", "https:"];

const LEET_STOIK: Record<string, string[]> = {
  s: ["5", "$", "s", "§"],
  t: ["t", "7", "τ"],
  o: ["0", "o", "ø", "ô", "ó", "ò", "õ", "ö"],
  i: ["1", "i", "ì", "í", "î", "ï"],
  k: ["k", "κ"],
};
const LEET_SUFFIX = ["!", "@", "*", "•"];

@Injectable()
export class UrlService {
  constructor(private readonly db: DatabaseService) {}

  isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false;
      if (!parsed.hostname) return false;
      return true;
    } catch {
      return false;
    }
  }

  private generateShortCode(): string {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return code;
  }

  private generateStoikCode(): string {
    const base = "stoik";
    let code = "";
    for (const char of base) {
      const options = LEET_STOIK[char] || [char];
      code += options[Math.floor(Math.random() * options.length)];
    }
    code += LEET_SUFFIX[Math.floor(Math.random() * LEET_SUFFIX.length)];
    return code;
  }

  shorten(url: string, easterEgg = false): { shortUrl: string; shortCode: string } {
    const database = this.db.getDb();
    let shortCode: string | null = null;

    const generate = easterEgg ? () => this.generateStoikCode() : () => this.generateShortCode();
    for (let i = 0; i < MAX_RETRIES; i++) {
      const candidate = generate();
      const exists = database
        .prepare("SELECT 1 FROM urls WHERE short_code = ? LIMIT 1")
        .get(candidate);

      if (!exists) {
        shortCode = candidate;
        break;
      }
    }

    if (!shortCode) {
      throw new Error("Could not generate unique short code");
    }

    database
      .prepare("INSERT INTO urls (short_code, original_url) VALUES (?, ?)")
      .run(shortCode, url);

    const baseUrl =
      process.env.BASE_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : "http://localhost:3000");
    const shortUrl = `${baseUrl.replace(/\/$/, "")}/${shortCode}`;

    return { shortUrl, shortCode };
  }

  findByShortCode(shortCode: string): string | null {
    const row = this.db
      .getDb()
      .prepare("SELECT original_url FROM urls WHERE short_code = ?")
      .get(shortCode) as { original_url: string } | undefined;

    return row?.original_url ?? null;
  }
}
