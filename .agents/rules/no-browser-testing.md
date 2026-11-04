# Rule: No Browser Testing & Fast Verification

## Behavioral Constraint
- **ห้ามเรียกใช้ `browser_subagent` หรือเปิดเบราว์เซอร์อัตโนมัติเด็ดขาด** (Do NOT invoke `browser_subagent` or open automated browsers for testing, recording, or screenshots).
- ผู้ใช้ระบุว่าการเปิดเบราว์เซอร์จำลองขึ้นมาทดสอบใช้เวลานานเกินไปและเสียเวลา

## มาตรฐานการตรวจสอบผลงาน (Fast Verification Standards)
เมื่อแก้ไข พัฒนา หรือตรวจสอบโค้ด ให้ใช้คำสั่งเทอร์มินัลที่รวดเร็วเท่านั้น:
1. `npx tsc --noEmit` สำหรับตรวจ Type Safety
2. `npm run build` สำหรับตรวจการ Build ของ Next.js
3. ให้รายงานผลลัพธ์ผ่านข้อความแชทอย่างกระชับ
