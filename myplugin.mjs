// my-plugin.mjs
export default {
    name: "replace-console",
    setup(build) {
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        let fs = await import("fs/promises");
        let contents = await fs.readFile(args.path, "utf8");
  
        // Replace console.log() calls with console.warn()
        contents = contents.replace(/console\.log/g, "console.warn");
  
        return { contents, loader: "ts" };
      });
    },
  };
  