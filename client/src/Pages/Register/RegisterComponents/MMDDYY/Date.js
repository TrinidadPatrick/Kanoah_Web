let yearNow = new Date().getFullYear()
let min = yearNow - 90
let year = []
for(let i=yearNow;i>=min;i--){
    year.push(i)
  }

export const DateData = {
    months : ["January","February","March","April","May","June","July",
    "August","September","October","November","December"],

    days : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],

    year
}