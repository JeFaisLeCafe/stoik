import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL (http or https)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong");
        return;
      }

      setShortUrl(data.shortUrl);
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard");
    }
  }

  function handleReset() {
    setUrl("");
    setShortUrl(null);
    setError(null);
  }

  if (loading) {
    return (
      <div className="shorten-form">
        <div className="result result--loading" role="status" aria-live="polite">
          <p className="loading-text">Shortening…</p>
        </div>
      </div>
    );
  }

  if (shortUrl) {
    return (
      <div className="shorten-form">
        <div className="result" role="status">
          <label>Your short URL</label>
          <div className="short-url-row">
            <output className="short-url-output" aria-live="polite">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </output>
            <button
              type="button"
              onClick={handleCopy}
              className={`copy-btn ${copied ? "copied" : ""}`}
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shorten-another"
          >
            Shorten another URL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shorten-form">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/your-long-url"
          disabled={loading}
          autoFocus
          aria-label="URL to shorten"
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
        />
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>

      {error && (
        <p id="url-error" className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
