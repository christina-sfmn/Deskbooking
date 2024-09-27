/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: '5%',
    },
    screens: {
      xs: '480px',
      sm: '760px',
      md: '840px',
      lg: '990px',
      xl: '1440px',
    },
    extend: {
      colors: {
        booking_matteblack: "#272727",
        booking_darkgrey: "#545454",
        booking_grey: "#D9D9D9",
        booking_lightgrey: "#F1F1F1",
        booking_fixdesk: "#757575",
        booking_flexdesk: "#BBA892",
      }
    },
  },
  plugins: [],
};
