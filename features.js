// const gfName = "Mrs. Random";
// const gfName2 = "Mrs. Random2";
// const gfName3 = "Mrs. Random3";
// const gfName4 = "Mrs. Random4";


//module.exports = gfName;//for exporting modules by common type

// export default gfName;//for exporting modules by ejs type

// For Exporting Multiple other than default we use curly braces
// export {gfName2,gfName3,gfName4} ;



// for exporting function
export const generateLovePercent = ()=>{
    return `${~~(Math.random()*100)}%`;//we can use either ~~ or Math.floor for getting the ground value
}