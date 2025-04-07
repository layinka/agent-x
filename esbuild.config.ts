// import { build, context } from "esbuild";
// import {esbuildDecorators} from "@anatine/esbuild-decorators";
// // const esbuildPluginTsc = require('esbuild-plugin-tsc');
// console.log("Building server...");
// const options = {
//   entryPoints: ["./src/server.ts"],
//   bundle: true,
//   platform: "node",
//   target: ["node22", "es2022"],
//   format: "esm", 
//   outdir: "dist",
//   packages: 'external',
//   sourcemap: true,
//   plugins: [esbuildDecorators()],
//   loader: { ".ts": "ts" },

// };

// if (process.argv.includes("--watch")) {
//   context(options)
//     .then((ctx) => ctx.watch())
//     .then(() => console.log("Watching for changes..."))
//     .catch(() => process.exit(1));
// } else {
//   build(options).catch((err) => {
//     console.error('Error building:',err)
//     process.exit(1)
//   });
// }