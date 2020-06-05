module.exports = {
  webpack: function (config, env) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      // type: 'json',
      use: ['json-loader', 'yaml-loader'],
    })

    const fileLoaderRule = config.module.rules[2].oneOf.find(
      (r) => r.loader && r.loader.indexOf('file-loader') > -1,
    )
    fileLoaderRule.exclude.push(/\.ya?ml$/)

    return config
  },
}
