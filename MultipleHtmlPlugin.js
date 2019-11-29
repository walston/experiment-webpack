module.exports = class MultipleHtmlPlugin {
  matching = null;
  constructor({ matching }) {
    this.matching = matching;
  }

  /** @param {import('webpack').Compiler} compiler */
  apply(compiler) {
    const matching = this.matching;
    compiler.hooks.afterEmit.tap("MultipleHtmlPlugin", function(compilation) {
      console.log(compilation.namedChunks);
      return true;
    });
  }
};
