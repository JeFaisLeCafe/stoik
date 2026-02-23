import { useEffect, useState } from "react";

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a

export function useKonamiCode(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let index = 0;

    function handleKeyDown(e: KeyboardEvent) {
      if (active) return;
      if (e.keyCode === KONAMI[index]) {
        index++;
        if (index === KONAMI.length) {
          setActive(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return active;
}
