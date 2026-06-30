function calculateCarLoan() {
    let carPrice = parseFloat(document.getElementById("carPrice").value);
    let downPayment = parseFloat(document.getElementById("downPayment").value);
    let interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    let months = parseInt(document.getElementById("months").value);

    // ==========================================
    // 🛡️ ส่วนตรวจสอบความถูกต้องของข้อมูลก่อนคำนวณ (Data Validation)
    // ==========================================
    if (isNaN(carPrice) || carPrice <= 0) {
        alert("กรุณากรอกราคารถยนต์ให้ถูกต้อง");
        return;
    }
    if (isNaN(downPayment) || downPayment < 0) {
        alert("กรุณากรอกเงินดาวน์ให้ถูกต้อง");
        return;
    }
    if (downPayment >= carPrice) {
        alert("เงินดาวน์ต้องน้อยกว่าราคารถยนต์นะคร้าบ");
        return;
    }
    if (isNaN(interestRate) || interestRate < 0) {
        alert("กรุณากรอกอัตราดอกเบี้ยให้ถูกต้อง");
        return;
    }

    // คำนวณจำนวนเงินกู้สุทธิ (ยอดจัดไฟแนนซ์)
    let loanAmount = carPrice - downPayment;

    // คำนวณค่างวดรายเดือน (สูตร PMT)
    let monthPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, months)) /
                       (Math.pow(1 + interestRate, months) - 1);
    
    if (isNaN(monthPayment) || !isFinite(monthPayment)) {
        monthPayment = loanAmount / months;
    }

    // ตัวแปรสะสมสถิติสำหรับสร้างผลสรุปการเงินทั้งหมดตามโจทย์
    let totalInterest = 0;
    let remaining = loanAmount;

    // แก้บั๊กหัวตารางและสไตล์ให้เข้าธีมสวยงาม
    let tableHtml = "<table><thead><tr><th class='text-center'>งวดที่</th><th>ค่างวด</th><th>เงินต้นที่จ่าย</th><th>ดอกเบี้ยที่จ่าย</th><th>เงินต้นคงเหลือ</th></tr></thead><tbody>";
    
    // 🚀 [แก้ไขบั๊กที่ 1]: เปลี่ยนจาก 1 <= months เป็น i <= months ป้องกันลูปค้าง
    for (let i = 1; i <= months; i++) {
        let interest = remaining * interestRate;
        let principal = monthPayment - interest;
        
        // ดักงวดสุดท้าย
        if (i === months || remaining < principal) {
            principal = remaining;
            monthPayment = principal + interest;
        }

        totalInterest += interest; // สะสมยอดดอกเบี้ยรวม
        remaining -= principal;

        // 🚀 [แก้ไขบั๊กที่ 2]: เปลี่ยนจาก I พิมพ์ใหญ่ เป็น i พิมพ์เล็กเพื่อให้เงื่อนไขทำงานถูกต้อง
        // แสดงตารางผ่อนชำระแบบย่อ (แสดงทุกๆ 6 เดือน หรือ งวดสุดท้าย)
        if (i % 6 === 0 || i === months) {
            tableHtml += `<tr>
                <td class='text-center'>งวดที่ ${i}</td>
                <td>${monthPayment.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</td>
                <td>${principal.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</td>
                <td>${interest.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</td>
                <td>${Math.max(0, remaining).toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</td>
            </tr>`;
        }
    }
    tableHtml += "</tbody></table>";
    
    // พ่นตารางผ่อนชำระแบบย่อลงหน้าเว็บ
    document.getElementById("paymentTable").innerHTML = tableHtml;

    // 🚀 [ส่วนเพิ่มใหม่]: สรุปรายงานการเงินทั้งหมดส่งอาจารย์
    let totalPaid = loanAmount + totalInterest; // ยอดรวมทั้งหมดที่ต้องจ่ายให้ไฟแนนซ์
    document.getElementById("carSummary").innerHTML = `
        <h4>สรุปรายละเอียดการเงินทั้งหมด</h4>
        <p>ราคารถยนต์ต้นฉบับ: ${carPrice.toLocaleString('th-TH')} บาท</p>
        <p>หักเงินดาวน์ชำระแล้ว: ${downPayment.toLocaleString('th-TH')} บาท</p>
        <p><strong>ยอดเงินกู้สุทธิ (ยอดจัดไฟแนนซ์): ${loanAmount.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</strong></p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0;">
        <p>ค่างวดผ่อนชำระต่อเดือน: <strong>${monthPayment.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท/เดือน</strong></p>
        <p>ดอกเบี้ยรวมสะสมตลอดสัญญา: <span style="color: #e74c3c;">${totalInterest.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</span></p>
        <p>ยอดรวมเงินต้นและดอกเบี้ยที่ต้องจ่ายทั้งสิ้น: <strong>${totalPaid.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</strong></p>
    `;
}