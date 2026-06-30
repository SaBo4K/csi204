function validateForm() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();
    let errors = [];

    if (name === "") errors.push("Please enter your name");
    if (email === "" || !email.includes("@")) errors.push("Please enter a valid email address");
    if (phone === "" || phone.length < 9 || isNaN(phone)) errors.push("Please enter a valid 10-digit phone number");
    if (password.length < 6) errors.push("Password must be at least 6 characters long");

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
    }
    alert("Registration successful!");
    // บันทึกข้อมูล
    saveToLocalStorage({name, email, phone, password});
    return false; // เปลี่ยนเป็น false ชั่วคราวเพื่อกันหน้าเว็บ Refresh จะได้เห็นรายชื่ออัปเดตทันทีบนหน้าจอครับ
}

// บันทึกข้อมูล
function saveToLocalStorage(userData) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData); 
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
}

// แสดงข้อมูล
function displayUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let html = "<h3>Registered Users</h3><ul>";
    users.forEach((user, index) => {
        html += `<li>${index+1}. ${user.name} - ${user.email}</li>`;
    });
    html += "</ul>";
    // สั่งเอาไปแสดงผลในกล่องที่มี id="userList"
    document.getElementById("userList").innerHTML = html;
}

// ลบข้อมูล
function clearStorage() {
    localStorage.removeItem("users");
    displayUsers();
    alert("Data cleared successfully");
}

// สั่งให้ดึงข้อมูลมาโชว์ทันทีที่เปิดหน้าเว็บขึ้นมา
window.onload = displayUsers;