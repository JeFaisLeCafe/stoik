import { ShortenForm } from "./components/ShortenForm";
import { useKonamiCode } from "./hooks/useKonamiCode";
import "./App.css";

function App() {
  const isEasterEgg = useKonamiCode();

  return (
    <main className="app">
      {isEasterEgg && (
        <img
          src="/logo.svg"
          alt=""
          className="easter-egg-logo"
          aria-hidden
        />
      )}
      <h1>URL Shortener</h1>
      <p className="tagline">Turn long links into short, shareable URLs</p>
      <div className="shorten-form-slot">
        <ShortenForm isEasterEgg={isEasterEgg} />
      </div>
    </main>
  );
}

export default App;
