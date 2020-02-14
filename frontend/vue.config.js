module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/sass/variables.sass"`
      },
      scss: {
        prependData: `@import "~@/sass/variables.scss";`
      }
    }
  }
};
