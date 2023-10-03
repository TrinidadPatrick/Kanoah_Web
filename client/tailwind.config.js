/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    
    extend: {
      fontSize : {
        semiXs : "13px"
      }
      ,
      borderWidth : {
        1 : "1px"
      },
      borderColor : {
        gray : "#9BA5B7"
      },
      colors: {
        themeBlue : "#002349",
        white : "#ffffff",
        
      }
      
    },
  },
  plugins: [],
}

