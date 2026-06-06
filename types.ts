@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

body {
  font-family: var(--font-sans);
  background-color: #050505; /* Immersive UI pure rich dark background */
  color: #d1d1d1; /* soft gray text */
}

/* Custom scrollbar logic for side panels */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 10, 12, 0.5);
  border-radius: 99px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}

