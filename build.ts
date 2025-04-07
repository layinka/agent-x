// import {build} from 'esbuild'

// await esbuild.build({
//   entryPoints: ['app.jsx'],
//   bundle: true,
//   outfile: 'out.js',

// })

import { build } from 'esbuild';
import { esbuildDecorators } from '@anatine/esbuild-decorators'

async function myBuilder({tsconfig,entryPoints,outfile,cwd }:{
  tsconfig: string,
  entryPoints: string[],
  outfile: string,
  cwd?: string 
}) {
    cwd= cwd??process.cwd()
  const buildResult = await build({
    platform: 'node',
    target: 'node18',
    bundle: true,
    sourcemap: 'external',
    plugins: [
      esbuildDecorators({
        tsconfig,
        cwd,
      }),
    ],
    tsconfig,
    entryPoints,
    outfile,
    external: [
      // This is likely to be your friend...
    ],
  });
}


// Check if we're running in watch mode
if (process.argv.includes("--watch")) {
//   context(options)
//     .then((ctx) => ctx.watch())
//     .then(() => console.log("Watching for changes..."))
//     .catch(() => process.exit(1));
} else {
    myBuilder({
        tsconfig: 'tsconfig.json',
        entryPoints: ['src/server.ts'],
        outfile: 'dist/server.js',

    }).catch(() => process.exit(1));
}