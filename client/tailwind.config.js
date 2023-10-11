/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    
    extend: {
      fontSize : {
        semiXs : "0.65rem"
      }
      ,
      borderWidth : {
        1 : "1px"
      },
      borderColor : {
        gray : "#9BA5B7",
        darkGray : " color: rgb(107 114 128 / var(--tw-text-opacity))"
      },
      colors: {
        themeBlue : "#002349",
        white : "#ffffff",
        themeOrange : "#EB6B23"
        
      },
      width : {
        0.2 : "1px"
      },
      borderRadius : {
        "4xl" : "2rem"
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    
      
    },
  },
  plugins: [],
}

