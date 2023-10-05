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
        
      },
      width : {
        0.2 : "1px"
      },
      
      
    },
  },
  plugins: [],
}

