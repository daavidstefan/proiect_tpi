// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  theme: {
    extend: {
      fontFamily: {
        // pentru titluri
        josefin: ['"Josefin Sans"', ...defaultTheme.fontFamily.sans],
        // restul textului rămâne sans default
        sans: defaultTheme.fontFamily.sans,
      },
    },
  },
  plugins: [],
};
