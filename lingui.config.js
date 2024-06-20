/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    sourceLocale: "en",
    locales: ["he", "en"],
    catalogs: [
        {
            path: "<rootDir>/src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    format: "po",
};