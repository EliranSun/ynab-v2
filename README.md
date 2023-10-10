# Foo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Translation

The project is being translated using lingui.
To translate:

1. ### `npm run extract`

This will extract all the strings from the `Trans` component to the `src/locales/en/messages.po` file.

2. Translate the strings in the `src/locales/en/messages.po` file.

3. ### `npm run compile`

To compile the translated strings to the `src/locales/en/messages.js` file.