import { initialize, mswDecorator } from 'msw-storybook-addon';
import { emulateDB } from '../src/utils';
import { emulateAuth } from "../src/utils/auth";
import '../src/index.css';

initialize();
emulateDB();
emulateAuth();

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [mswDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
