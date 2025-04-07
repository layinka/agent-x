const { spawn } = await import("child_process");
const path = new URL("./myplugin.mjs", import.meta.url).pathname;

// Define the environment variable
const esbuildOptions = JSON.stringify({
  plugins: [await import(path).then((m) => m.default)],
});

// Spawn `tsx` with the correct environment variable
const child = spawn("tsx", ["src/server.ts"], {
  stdio: "inherit",
  env: {
    ...process.env,
    TSX_ESBUILD_OPTIONS: esbuildOptions,
  },
});

child.on("exit", (code) => process.exit(code));


// Import and run your TypeScript file
// import("./src/server.ts");