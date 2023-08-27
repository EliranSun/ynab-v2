/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["he", "en"],
  sourceLocale: "he",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
};