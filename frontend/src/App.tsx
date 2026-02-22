import { ShortenForm } from "./components/ShortenForm";
import "./App.css";

function App() {
  return (
    <main className="app">
      <h1>URL Shortener</h1>
      <p className="tagline">Turn long links into short, shareable URLs</p>
      <div className="shorten-form-slot">
        <ShortenForm />
      </div>
    </main>
  );
}

export default App;
