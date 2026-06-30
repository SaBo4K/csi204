function calculateLoan() {
    // 1. ดึงค่าจาก HTML DOM มาจัดการแปลงชนิดข้อมูลเป็นตัวเลข
    let monthlySalary = parseFloat(document.getElementById("salary").value);
    let loanAmount = parseInt(document.getElementById("loanAmount").value);
    let rawInterestRate = parseFloat(document.getElementById("interestRate").value);
    let years = parseInt(document.getElementById("years").value);

    // ==========================================
    // 🛡️ ส่วนการตรวจสอบความถูกต้องของข้อมูล (Data Validation)
    // ==========================================
    if (isNaN(monthlySalary) || monthlySalary <= 0) {
        alert("กรุณากรอกเงินเดือนปัจจุบันให้ถูกต้องและต้องมากกว่า 0 บาท");
        return;
    }
    if (isNaN(loanAmount) || loanAmount <= 0) {
        alert("กรุณากรอกจำนวนเงินกู้ให้ถูกต้องและต้องมากกว่า 0 บาท");
        return;
    }
    if (isNaN(rawInterestRate) || rawInterestRate <= 0) {
        alert("กรุณากรอกอัตราดอกเบี้ยให้ถูกต้อง");
        return;
    }
    if (isNaN(years) || years <= 0) {
        alert("กรุณากรอกระยะเวลาผ่อนชำระให้ถูกต้อง");
        return;
    }

    // ตรวจสอบเงื่อนไขวงเงินสูงสุด (200 เท่าของเงินเดือน) ตามโจทย์กำหนด
    let maxLoan = monthlySalary * 200;
    if (loanAmount > maxLoan) {
        alert(`วงเงินกู้สูงสุดที่ท่านกู้ได้คือ ${maxLoan.toFixed(2)} บาท (200 เท่าของเงินเดือน)`);
        return;
    }

    // 2. คำนวณค่าตัวแปรสำหรับสูตรผ่อนชำระรายเดือน (PMT)
    let interestRatePerMonth = rawInterestRate / 100 / 12; // แปลง % ต่อปี ให้เป็นทศนิยมต่อเดือน
    let months = years * 12;

    // คำนวณค่างวดรายเดือนคงที่ (สูตร PMT)
    let monthlyPayment = (loanAmount * interestRatePerMonth * Math.pow(1 + interestRatePerMonth, months)) / (Math.pow(1 + interestRatePerMonth, months) - 1);

    // กรณีดอกเบี้ยเป็น 0 (ดักบั๊กคณิตศาสตร์หารด้วยศูนย์)
    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
        monthlyPayment = loanAmount / months;
    }

    // 3. แสดงผลสรุปภาพรวมด้านบน
    document.getElementById("result").innerHTML = `
        <h4>สรุปผลการคำนวณสินเชื่อบ้าน</h4>
        <p>วงเงินกู้ที่อนุมัติ: <strong>${loanAmount.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</strong></p>
        <p>วงเงินสูงสุดตามฐานเงินเดือน (200 เท่า): ${maxLoan.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</p>
        <p>อัตราดอกเบี้ย: ${rawInterestRate.toFixed(2)}% ต่อปี</p>
        <p>ระยะเวลาผ่อนชำระ: ${years} ปี (${months} เดือน)</p>
        <p style="font-size: 18px; color: #0f4c5f;"><strong>ค่างวดที่ต้องผ่อนชำระต่อเดือน: ${monthlyPayment.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</strong></p>
    `;

    // ==========================================
    // 📊 ส่วนเพิ่มใหม่: ตรรกะการสร้างตารางผ่อนชำระ (Amortization Schedule) แบบลดต้นลดดอก
    // ==========================================
    let remainingPrincipal = loanAmount; // เงินต้นคงเหลือตั้งต้น
    let tableHtml = `
        <h3>ตารางแจกแจงรายละเอียดการผ่อนชำระแต่ละงวด</h3>
        <table>
            <thead>
                <tr>
                    <th class="text-center">งวดที่</th>
                    <th>ค่างวด/เดือน</th>
                    <th>ดอกเบี้ยที่จ่าย</th>
                    <th>เงินต้นที่ลดลง</th>
                    <th>เงินต้นคงเหลือ</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalInterestCharged = 0;
    let totalAmountPaid = 0;

    // รันลูปเพื่อคำนวณสถานะการเงินทีละเดือน (ตรรกะลดต้นลดดอกจริง)
    for (let i = 1; i <= months; i++) {
        // ดอกเบี้ยงวดนั้น = เงินต้นคงเหลือรอบก่อน x อัตราดอกเบี้ยต่อเดือน
        let interestForMonth = remainingPrincipal * interestRatePerMonth;
        // เงินต้นที่ลดลงในงวดนั้น = เงินค่างวดคงที่ - ดอกเบี้ยงวดนั้น
        let principalForMonth = monthlyPayment - interestForMonth;

        // ดักงวดสุดท้ายป้องกันปัญหายอดติดลบเศษทศนิยม
        if (i === months || remainingPrincipal < principalForMonth) {
            principalForMonth = remainingPrincipal;
            monthlyPayment = principalForMonth + interestForMonth;
        }

        // หักลบเงินต้นที่ลดลงออกจากเงินต้นคงเหลือรวม
        remainingPrincipal -= principalForMonth;
        if (remainingPrincipal < 0) remainingPrincipal = 0;

        // สะสมยอดสถิติรวมทั้งหมด
        totalInterestCharged += interestForMonth;
        totalAmountPaid += monthlyPayment;

        // พ่นแถวข้อมูลตารางออกมาทีละงวด
        tableHtml += `
            <tr>
                <td class="text-center">${i}</td>
                <td>${monthlyPayment.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${interestForMonth.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${principalForMonth.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${remainingPrincipal.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
        `;
    }

    tableHtml += `
            </tbody>
        </table>
    `;

    // เรนเดอร์สร้างตารางเข้าไปใน Div บนหน้า HTML
    document.getElementById("scheduleTableContainer").innerHTML = tableHtml;

    // อัปเดตข้อมูลสรุปรวมท้ายตารางกลับเข้าไปในกล่องสรุปผลด้านบนเพื่อให้สมบูรณ์
    document.getElementById("result").innerHTML += `
        <p>รวมเงินต้นและดอกเบี้ยที่จ่ายทั้งสิ้น: ${totalAmountPaid.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</p>
        <p>รวมเฉพาะดอกเบี้ยที่จ่ายสะสมตลอดสัญญา: <span style="color: #e74c3c;">${totalInterestCharged.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} บาท</span></p>
    `;
}