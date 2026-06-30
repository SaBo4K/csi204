let studentName = "Nutchapon Wongsajan";
let studentAge = 28;
let isGraduated = false;
let scores = [85, 90, 78];
let student = {id: "67107433", name: "Nutchapon Wongsajan", grade: "A"};
console.log("Name:", studentName, "Type:", typeof studentName);
console.log("Age:", studentAge, "Type:", typeof studentAge);
document.getElementById("output").innerHTML =`
    Name: ${studentName}<br>
    Age: ${studentAge}<br>
    Average Grade: ${(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2)}
`;
//ทดสอบการแปลงชนิดข้อมูล

// parseInt()
let stringAge = "20";
let convertedAge = parseInt(stringAge);
console.log("--- Test parseInt ---");
console.log("ค่าที่แปลงได้:", convertedAge, "ชนิดข้อมูลเป็น", typeof convertedAge);

// parseFloat
let stringGpa = "3.50";
let convertedGpa = parseFloat(stringGpa);
console.log("--- Test parseFloat ---");
console.log("ค่าที่แปลงได้:", convertedGpa, "ชนิดข้อมูลเป็น", typeof convertedGpa);

// String
let numberId = 67107433;
let convertedId = String(numberId);
console.log("--- Test String ---");
console.log("ค่าที่แปลงได้:", convertedId, "ชนิดข้อมูลเป็น", typeof convertedId);