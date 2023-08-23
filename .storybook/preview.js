import { initialize, mswDecorator } from 'msw-storybook-addon';
import '../src/index.css';
import { getAuth, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
connectAuthEmulator(auth, "http://127.0.0.1:9099");
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
