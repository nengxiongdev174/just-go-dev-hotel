---
name: portfolio-i18n
description: >-
  Use this skill whenever creating, modifying, translating, or verifying UI text, projects,
  or components in nx-creations-portfolio. Enforces trilingual (Lao default, English, Thai) consistency and Zero-Reload client architecture.
---

# Portfolio i18n & Localization Guide (nx-creations-portfolio)

Skill นี้เป็นคู่มือมาตรฐานสำหรับการจัดการระบบหลายภาษา (Multilingual / i18n) ในโปรเจกต์ `nx-creations-portfolio`

---

## 1. ข้อมูลสถาปัตยกรรม (Architecture Overview)

- **ภาษาที่รองรับ:**
  1. `lo` (ລາວ - **Default**)
  2. `en` (English)
  3. `th` (ไทย)
- **หมายเหตุ:** เดิมค่าเริ่มต้นเป็น `en` เปลี่ยนเป็น `lo` ตามที่เจ้าของโปรเจกต์กำหนด (29-10-2026) ค่าเริ่มต้นนี้กำหนดที่ `useState<Locale>("lo")` ใน `LanguageContext.tsx` และต้องตรงกับ `<html lang="lo">` ใน `src/app/layout.tsx` เสมอ ไม่งั้นจะเกิด hydration mismatch
- **ระบบ State:** ใช้ `LanguageContext` (`src/context/LanguageContext.tsx`)
- **พฤติกรรม:** Client-side React State + `localStorage` (`nx_portfolio_lang`)
- **Zero-Reload:** การสลับภาษาต้องไม่ทำให้หน้าเว็บโหลดใหม่ (No browser reload) และไม่ทำให้กระตุกหรือเสีย Scroll Position
- **Switcher:** ใช้ `LanguageSwitcher.tsx` พร้อม Framer Motion `layoutId` pill animation

---

## 2. โครงสร้างไฟล์ Dictionary (`src/locales/`)

```text
src/locales/
├── types.ts    # กำหนด TypeScript TranslationSchema (ป้องกันคีย์ขาด / พิมพ์ผิด)
├── en.ts       # ภาษาอังกฤษ (ค่าเริ่มต้น)
├── th.ts       # ภาษาไทย
└── lo.ts       # ภาษาลาว
```

### กฎการเพิ่ม/แก้ไขคีย์:
1. **ห้ามตกหล่น:** เมื่อเพิ่มฟิลด์ใหม่ใน `types.ts` จะต้องใส่ค่าใน `en.ts`, `th.ts`, และ `lo.ts` ให้ครบพร้อมกันเสมอ
2. **Type Safety:** ทุกไฟล์ต้อง `implements TranslationSchema`

---

## 3. มาตรฐานโทนภาษา (Tone of Voice)

| ภาษา | โทนและแนวทางการแปล |
| :--- | :--- |
| **English (`en`)** | คมชัด ทรงพลัง สไตล์ International Portfolio (Modern Tech, Action verbs, Minimalist) |
| **ไทย (`th`)** | สุภาพ ทันสมัย เป็นมืออาชีพ ศัพท์เทคนิคให้ทับศัพท์อย่างเป็นธรรมชาติ (เช่น Next.js, Frontend, Cloud, Tech Stack) ไม่แปลไทยแบบแข็งทื่อ |
| **ລາວ (`lo`)** | ภาษาลาวทางการและสุภาพ ถูกต้องตามอักขรวิธี คงความเป็นมิตรและสร้างสรรค์ |

---

## 4. แนวปฏิบัติในการเขียนโค้ด (Coding Conventions)

### 1) การเรียกใช้ใน Component:
```tsx
import { useLanguage } from "@/context/LanguageContext";

export default function MyComponent() {
  const { locale, dictionary, t } = useLanguage();

  return (
    <div>
      {/* ใช้ t() สำหรับ string ทั่วไป */}
      <h2>{t("section.heading")}</h2>

      {/* หรือใช้ dictionary เมื่อต้องการ map อาเรย์ที่มี type ชัดเจน */}
      {dictionary.about.roles.map((role) => (
        <span key={role.name}>{role.desc}</span>
      ))}
    </div>
  );
}
```

### 2) การตั้งค่า Anchor Links & Section IDs:
ใช้ภาษาอังกฤษที่เป็นสากลเสมอ เพื่อให้ scroll ทำงานได้ถูกต้องในทุกภาษา:
- `#projects` (ไม่ใช่ `#ຜົນງານ` หรือ `#ผลงาน`)
- `#skills`
- `#experience`
- `#about`
- `#contact`

### 3) การเพิ่มโปรเจกต์ใหม่ใน `src/data/projects.ts`:
แต่ละโปรเจกต์ต้องมี:
- `titleEn`, `titleTh`, `titleLo`
- `descriptionEn`, `descriptionTh`, `descriptionLo`

### 4) การจัดการไฟล์ CV ทั้ง 3 ภาษา (`public/`):
ไฟล์ PDF ของประวัติการทำงาน (CV) ใน `public/` ต้องมีครบ 3 ภาษา:
- `public/nengxiong-wtx-cv-eng.pdf` (English - International Edition)
- `public/nengxiong-wtx-cv-th.pdf` (ฉบับภาษาไทย)
- `public/nengxiong-wtx-cv-la.pdf` (ສະບັບພາສາລາວ)
- Component `CvDownloadActions.tsx` จะแสดงการ์ดทั้ง 3 ฉบับให้ผู้ใช้เลือกกดดู (`View`) และดาวน์โหลด (`Download`) ได้ทันที พร้อมไฮไลต์แท็บภาษาปัจจุบันที่ผู้ใช้เลือกอยู่

---

## 5. Checklist ก่อนส่งงาน (Validation Checklist)
- [ ] ภาษาเริ่มต้นเป็น Lao (`lo`) และ `<html lang>` ใน `layout.tsx` ตรงกัน
- [ ] เมื่อกดสลับภาษา ข้อความเปลี่ยนทันทีโดยไม่ต้อง reload หน้าเว็บ
- [ ] เมื่อรีเฟรชหน้าเว็บ ระบบจำภาษาล่าสุดจาก `localStorage` ได้
- [ ] ไม่มีคำว่า `undefined` หรือ key หลุดบนหน้าจอ
- [ ] Section anchor links เลื่อนลงมาถูกต้องทุกปุ่ม
- [ ] ตัวหนังสือภาษาไทย/ลาวไม่ล้นกรอบ (Text Wrap & Responsive เหมาะสม)
