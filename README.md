# Sổ kỷ luật — Next.js + shadcn/ui + Firestore

Bản chuyển từ prototype HTML sang Next.js (App Router, TypeScript, Tailwind v3). Chưa chạy thử build trong môi trường tạo file, nên nếu `npm run dev` báo lỗi hãy dán lỗi cho AI sửa.

## Cài đặt
```bash
npm install
npx shadcn@latest add button card checkbox input dialog textarea tabs   # sinh src/components/ui/*
npm i @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
cp .env.example .env.local   # điền khóa Firebase
npm run dev
```
Firebase Console: tạo project, bật **Firestore** và **Authentication → Anonymous**, tạo Web app để lấy khóa, dán nội dung `firestore.rules` vào tab Rules.

## Cấu trúc
- `src/lib/discipline.ts`: `calcPct`, `calcStreak`, `dateKey` (logic port từ prototype)
- `src/lib/types.ts`: kiểu `DayDoc`, `Block`, `Settings`
- `src/hooks/use-today.ts`: realtime Firestore cho hôm nay + mọi thao tác tick/thêm/xóa
- `src/hooks/use-days.ts`: 400 ngày gần nhất (streak, heatmap, báo cáo)
- `src/components/`: `energy-bar`, `completion-stamp` (X vẽ bằng framer-motion), `checklist-card`, `nav`
- `src/app/`: `/` Hôm nay (xong), `/heatmap` (xong), `/calendar` `/deep-work` `/report` (khung trống)

## Dữ liệu Firestore
```
users/{uid}/settings/main      { good: Habit[], bad: Habit[] }
users/{uid}/days/{yyyy-MM-dd}  { tasks, good, bad, reflection, focusMinutes, focusBreaks, frozen, pct }
users/{uid}/blocks/{id}        { date, start, end, type, title, done }
```
`pct` lưu sẵn trong từng ngày để đổi danh sách thói quen không làm sai lịch sử.

## Prompt để vibe coding tiếp
Dán kèm cây thư mục và `types.ts` cho AI.
2. **Lịch**: “Trong `src/app/calendar/page.tsx`, dùng FullCalendar timeGridDay/timeGridWeek, kéo thả tạo/dời/đổi độ dài block, lưu `Block` vào `users/{uid}/blocks` bằng onSnapshot. Viền trái theo `type`. Toast cảnh báo 10 phút trước khi block kết thúc. Ngày có `pct>=1` hiện dấu X ở tiêu đề cột.”
3. **Deep Work**: “Overlay toàn màn hình Pomodoro (25/45/50 phút) chỉ hiện đồng hồ, một câu quote và đúng 1 task. Xong thì cộng `focusMinutes`, thoát sớm thì tăng `focusBreaks` của hôm nay. Gợi ý vào chế độ này khi block `study` bắt đầu.”
4. **Báo cáo tuần**: “Tính 7 ngày Thứ Hai–Chủ Nhật từ `useDays`: thanh `pct` từng ngày, tổng focus/gãy tập trung, so sánh tổng phút kế hoạch với phút block `done` theo `type`. Tự mở vào Chủ Nhật.”
5. **Nhật ký phản tỉnh**: “Thêm Dialog shadcn tự mở lúc 22:45 nếu `day.reflection` còn null, 3 Textarea (điều làm tốt / xao nhãng / lời nhắc ngày mai), lưu bằng `saveDay({reflection})`.”
6. **Nâng cấp sau**: đăng nhập Google thay Anonymous, PWA + thông báo đẩy, xuất dữ liệu.
