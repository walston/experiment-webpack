module.exports = function SiblingChunksOnlyPlugin() {
  SiblingChunksOnlyPlugin.prototype.apply = apply;

  /**
   * @param {Chunk[]} chunks no formal definition exported from webpack
   * @param {{ plugin: HtmlWebpackPlugin }} plugin instance */
  function chunkSearcher(chunks, { plugin }) {
    // Each instance of HtmlWebpackPlugin can request chunks by name
    // But this filtering isn't done for some reason
    // this can be either an array or a string, so let's just make it always array
    const includes = [].concat(plugin.options.chunks);

    // to prevent any potential duplication, let's sort them by name into an object
    const byName = {};

    for (let i = 0; i < includes.length; i++) {
      // chunk requested by name
      const include = includes[i];
      // find the chunk name in the array of chunks (which can have multiple names? for ... reasons?)
      const chunk = chunks.find(c => c.names.find(n => n === include));

      // no find? fine. skip to the next
      if (!chunk) continue;

      // set it in the hash-map
      byName[include] = chunk;

      if (chunk.siblings.length > 0)
        // if there are siblings they're given by id number, so that's nice.
        // just grab them out by id number
        chunk.siblings.forEach(id => {
          // mostly doing this because i need the name... which is an array...
          // and as a 1 liner... it was incredibly long
          const chunk = chunks[id];
          const name = chunk.names[0];
          return (byName[name] = chunk);
        });
    }

    // we never really needed the names. so just return the Object.values
    return Object.values(byName);
  }
  /** @param {import("webpack").Compiler} compiler */
  function apply(compiler) {
    /** @note
     * Hook into the "compilation" plugin allows access to each fork
     * That should give us access to the multiple occurances of HtmlWebpackPlugin */
    compiler.plugin("compilation", function(compilation) {
      if (
        compilation.hooks &&
        // this is shown in the source code as a webpack 4 hook, but it doesn't work
        "function" === typeof compilation.hooks.htmlWebpackPluginAlterChunks
      )
        compilation.hooks.htmlWebpackPluginAlterChunks(chunkSearcher);
      else
        compilation.plugin("html-webpack-plugin-alter-chunks", chunkSearcher);
    });
  }
};
