function calculateElectricity() {
    let prevUnit = parseFloat(document.getElementById("prevUnit").value);
    let currentUnit = parseFloat(document.getElementById("currentUnit").value);

    // 1. ตรวจสอบข้อมูล (Data Validation)
    if (isNaN(prevUnit) || prevUnit < 0) {
        alert("กรุณากรอกเลขมิเตอร์ครั้งก่อนให้ถูกต้อง (ห้ามติดลบ)");
        return;
    }
    if (isNaN(currentUnit) || currentUnit < 0) {
        alert("กรุณากรอกเลขมิเตอร์ครั้งล่าสุดให้ถูกต้อง (ห้ามติดลบ)");
        return;
    }
    if (currentUnit < prevUnit) {
        alert("ข้อมูลผิดพลาด: เลขมิเตอร์ปัจจุบัน ต้องมากกว่าหรือเท่ากับ เลขมิเตอร์ครั้งก่อน");
        return;
    }

    // 2. คำนวณหน่วยที่ใช้จริง
    let usedUnit = currentUnit - prevUnit;

    // 3. ตรรกะคำนวณค่าพลังงานแบบอัตราก้าวหน้า 
    let energyCost = 0;
    
    if (usedUnit <= 150) {
        // ขั้นที่ 1: 0 - 150 หน่วย (หน่วยละ 3.25 บาท)
        energyCost = usedUnit * 3.25;
    } 
    else if (usedUnit <= 400) {
        // ขั้นที่ 2: 151 - 400 หน่วย (หน่วยละ 4.22 บาท)
        // เอาขั้นแรก 150 หน่วยที่เต็มแม็กซ์มาคิดก่อน แล้วบวกกับส่วนที่เกิน 150 มาคูณเรทใหม่
        energyCost = (150 * 3.25) + ((usedUnit - 150) * 4.22);
    } 
    else {
        // ขั้นที่ 3: 401 หน่วยขึ้นไป (หน่วยละ 4.42 บาท)
        // เอาขั้นแรกเต็มแม็กซ์ + ขั้นสองเต็มแม็กซ์ (250 หน่วย) + ส่วนที่เกิน 400
        energyCost = (150 * 3.25) + (250 * 4.22) + ((usedUnit - 400) * 4.42);
    }

    // 4. คำนวณค่า Ft 
    let ftRate = 0.85; 
    let ftCost = usedUnit * ftRate;

    // 5. รวมยอดก่อนภาษี และคำนวณ VAT 7%
    let totalBeforeVat = energyCost + ftCost;
    let vatAmount = totalBeforeVat * 0.07;
    let netTotal = totalBeforeVat + vatAmount;

    // 6. แสดงผลลัพธ์ออกทางหน้าจอ
    document.getElementById("result").innerHTML = `
        <h3 style="text-align: center; color: #0f4c5f; margin-top: 0;">สรุปรายละเอียดค่าไฟฟ้า</h3>
        <p>⚡ ปริมาณการใช้ไฟฟ้าสุทธิ: <strong>${usedUnit} หน่วย</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
        <p>1. ค่าพลังงานไฟฟ้า (ตามอัตราก้าวหน้า): ${energyCost.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
        <p>2. ค่า Ft (หน่วยละ ${ftRate} บาท): ${ftCost.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
        <p>3. รวมเงินค่าไฟฟ้า (ก่อนภาษี): ${totalBeforeVat.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
        <p>4. ภาษีมูลค่าเพิ่ม (VAT 7%): ${vatAmount.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
        <p class="highlight">💰 ยอดเงินรวมที่ต้องชำระทั้งสิ้น: ${netTotal.toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
    `;
}