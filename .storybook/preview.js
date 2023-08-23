import { initialize, mswDecorator } from 'msw-storybook-addon';
import { app } from '../src/utils';
import '../src/index.css';

initialize();

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
