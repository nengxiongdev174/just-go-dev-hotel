---
name: demo-showcase-expert
description: มาตรฐานและแนวทางปฏิบัติสำหรับการออกแบบ พัฒนา และจัดโครงสร้างโปรเจกต์ Demo Sandbox สำหรับแสดงผลงาน (Showcase Projects) บน JustGoDev โดยเน้น Client-side LocalStorage Sandbox, Modular Mock Data, Zero-Reload Trilingual, Clean Light UI, และ Strict Separation of Concerns
---

# Demo Showcase Expert Guide (JustGoDev)

Skill นี้เป็นคู่มือมาตรฐานระดับ Enterprise สำหรับการพัฒนาเว็บแอปพลิเคชันตัวอย่าง (Demo Showcase Projects) ในเครือ JustGoDev (`JustGoDev.com`) เพื่อให้ลูกค้าและผู้ว่าจ้างสามารถทดลองใช้งานฟีเจอร์จริงได้อย่างสมบูรณ์แบบบนเบราว์เซอร์ โดยไม่ต้องพึ่งพา Backend API จริง

---

## 1. ปรัชญาและมาตรฐานหลักของระบบ Demo (Core Philosophy)

1. **ความสมจริงระดับ Production (Realism):**
   - ออกแบบและพัฒนาให้เหมือนระบบซอฟต์แวร์จริงระดับ Enterprise ไม่ใส่ลูกเล่นที่ดูเหมือนเดโมทดลอง
   - **ห้ามใส่แถบนับถอยหลัง (No Countdown Banner):** ให้ระบบทำงานเงียบๆ เสมือนระบบ Production จริง
2. **ธีมเริ่มต้น (Default Theme):**
   - กำหนดให้เป็น **Light Mode (สีขาว คลีน สบายตา มินิมอล คมชัด)** เป็นค่าเริ่มต้นเสมอ
3. **ภาษาเริ่มต้น (Default Language):**
   - กำหนดให้เป็น **ภาษาลาว (`lo`)** เป็นค่าเริ่มต้นเสมอ และรองรับ 3 ภาษา (ລາວ `lo`, ไทย `th`, English `en`) ภายใต้มาตรฐาน Zero-Reload
4. **การเลือก Layout:**
   - **Sidebar Navigation:** สำหรับระบบบริหารจัดการ, POS, Dashboard, ERP, SaaS, Backoffice
   - **Top Navbar:** สำหรับ Landing Page, Portfolio Showcase หรือ E-commerce Storefront

---

## 2. โครงสร้างโฟลเดอร์ Mock Data กลาง (`src/data/`)

> [!IMPORTANT]
> **ห้ามเขียนไฟล์ `mockData.ts` รวมข้อมูลทั้งหมดในไฟล์เดียวขนาดยาวเด็ดขาด** ให้แยกเป็นโฟลเดอร์ `src/data/` ที่แบ่งตามโดเมนอย่างชัดเจน

### โครงสร้างไฟล์มาตรฐาน:
```text
src/data/
├── store.mock.ts       # ข้อมูลตั้งค่าร้านค้า/ระบบ, สาขา, อัตราภาษี, ช่องทางติดต่อ
├── products.mock.ts    # ข้อมูลสินค้า/บริการ Mock พร้อมชื่อ 3 ภาษา (lo, th, en), SKU, สต็อก, ราคา
├── orders.mock.ts      # ข้อมูลประวัติออเดอร์/ธุรกรรมย้อนหลังสำหรับแสดงกราฟและแดชบอร์ด
├── index.ts            # Hub รวม export กลาง (Barrel Export)
└── mockData.ts         # Re-export จาก ./index เพื่อคง Backward Compatibility
```

### แนวปฏิบัติของข้อมูล Mock:
- ข้อมูลชื่อสินค้า/รายการ ต้องรองรับ 3 ภาษา (`lo`, `th`, `en`) ครบถ้วนเสมอ
- กำหนดราคาให้สัมพันธ์กับค่าเงินจริงของภูมิภาค (LAK, THB, USD)
- มีรหัส SKU/Barcode และไอคอนหมวดหมู่ที่ชัดเจน

---

## 3. สถาปัตยกรรม Client Sandbox & LocalStorage (`src/lib/storage.ts`)

1. **Silent TTL Auto-Reset (การล้างข้อมูลอัตโนมัติแบบเงียบ):**
   - กำหนดอายุเซสชัน LocalStorage (ค่าเริ่มต้น 3 ชั่วโมง: `3 * 60 * 60 * 1000 ms`)
   - ตรวจสอบ Timestamp ในเบื้องหลัง หากเกินเวลา ให้รีเซ็ต LocalStorage กลับสู่ Mock Data เริ่มต้นอัตโนมัติ โดยไม่ต้องมีแบนเนอร์นับถอยหลังรบกวนสายตา
2. **ป้องกัน React Hydration Mismatch 100%:**
   - **ห้าม** อ่าน `localStorage` โดยตรงใน `useState(() => getStoredData())` ในจุดที่เรนเดอร์ข้อความ SSR
   - ใช้สถาปัตยกรรม **`useSyncExternalStore`** ใน Global Store/Context:
     - `getServerSnapshot()` คืนค่า `SERVER_SNAPSHOT` (ค่าเริ่มต้นคงที่) เพื่อให้ Server SSR และ Initial Hydration Pass ตรงกัน 100%
     - `getClientSnapshot()` คืนค่าที่อ่านจาก `localStorage` หลัง Hydration เสร็จสมบูรณ์
     - ไม่เกิด Hydration Error, ไม่มีปัญหา `react-hooks/set-state-in-effect`, และไม่มี Cascading Renders

---

## 4. มาตรฐาน Demo Authentication Flow

1. **ต้องมีหน้าเข้าสู่ระบบ (Login Flow เสมอ):**
   - สำหรับระบบประเภท Dashboard, POS, หรือ Backoffice ให้เริ่ม Flow ตั้งแต่หน้า `/login`
2. **ป้ายแจ้งเตือนลูกค้า (1-Click Notice):**
   - แสดงข้อความและป้ายแจ้งเตือนเด่นชัดว่า:
     *"โหมดทดลองใช้งาน: คุณสามารถคลิกเข้าสู่ระบบได้ทันทีโดยไม่ต้องจำรหัสผ่าน"*
3. **1-Click Test Accounts:**
   - สร้างปุ่มเข้าสู่ระบบแบบคลิกเดียวสำหรับสลับบทบาท เช่น **Store Manager** และ **Cashier**
4. **ปุ่มออกจากระบบ (Logout Flow):**
   - มีปุ่ม Logout ชัดเจนบน Sidebar/Navbar เพื่อให้ลูกค้าสามารถทดสอบ Flow ได้ครบวงจร: `Login -> ใช้งานแอป -> ออกจากระบบ`

---

## 5. กฎสถาปัตยกรรมโค้ดและการแยกไฟล์ (Component Architecture & Modularity)

1. **ห้ามเขียนไฟล์ยาวเกินไป (Keep Files Small & Modular):**
   - ห้ามเขียน Component รวมกันหลายร้อยบรรทัดในไฟล์เดียว
   - แตก Component ย่อยตามความรับผิดชอบเดี่ยว (Single Responsibility)
2. **ห้ามเอา Logic & Hooks มารวมกับ UI Components:**
   - **UI Components = Pure Presentational View:** รับ props และ render JSX เท่านั้น
   - **Logic, Calculations, State Orchestration = Custom Hooks:** สร้างไฟล์แยกใน `src/hooks/use[Feature].ts`
3. **แยก Types ออกจาก Components เสมอ:**
   - ประกาศ Types และ Interfaces ในไดเรกทอรี `src/types/` (เช่น `dashboard.ts`, `inventory.ts`, `pos.ts`)
   - ห้ามประกาศ Types ขนาดยาวหรือซับซ้อนในไฟล์ Component
4. **การจัดกลุ่มตามขอบเขต (Colocation vs Shared):**
   - **Private / Feature-Specific:** Component ที่ใช้เฉพาะในหน้านั้น ให้จัดเก็บรวมไว้ในโฟลเดอร์ฟีเจอร์นั้นร่วมกัน (เช่น `src/components/dashboard/`, `src/components/inventory/`)
   - **Shared Components:** Component ที่ใช้งานร่วมกันข้ามหลายหน้า ให้สร้างไว้ใน `src/components/shared/` หรือ `src/components/ui/`
5. **Shared Formatters:**
   - รวมฟังก์ชันจัดรูปแบบทั่วไป เช่น `formatCurrency(amount, currency)` ไว้ใน `src/lib/formatters.ts` ห้ามเขียนซ้ำซ้อนในแต่ละไฟล์

---

## 6. Checklist ก่อนส่งมอบโปรเจกต์ Demo

- [ ] โครงสร้าง Mock Data แยกเป็นโฟลเดอร์ `src/data/` เรียบร้อย
- [ ] ธีมเริ่มต้นเป็น Light Mode สะอาด คลีน สบายตา
- [ ] ภาษาเริ่มต้นเป็นภาษาลาว (`lo`) และสลับ 3 ภาษาได้แบบ Zero-Reload
- [ ] มีหน้า Login พร้อมป้ายแจ้ง 1-Click และปุ่ม Logout
- [ ] มีระบบ Sandbox LocalStorage ทำงานเงียบๆ โดยไม่มีป้ายนับถอยหลัง
- [ ] Component ทุกตัวเป็น Pure View และดึง Logic ผ่าน Custom Hooks
- [ ] Types ทุกตัวแยกอยู่ใน `src/types/`
- [ ] `npm run lint` ผ่าน (0 errors, 0 warnings)
- [ ] `npm run typecheck` ผ่าน (0 errors)
- [ ] `npm run build` ผ่านสมบูรณ์ 100%

