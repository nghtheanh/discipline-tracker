Act as an expert frontend developer. Build a single-page daily discipline and habit tracker web application using React (Next.js), Tailwind CSS, and lucide-react icons.

Visual Style & UI/UX (Strict Requirements):
- Style: Ultra-Minimalist, Utilitarian, Flat Design (inspired by Notion and Beaver Plans).
- Background: Pure white (`bg-white`) or extremely light gray (`bg-gray-50`). No gradients, no dark modes.
- Typography: Sans-serif (Inter or system default). Rely heavily on typography hierarchy, font weights, and ample white space instead of borders or cards.
- Colors: Monochrome text (`text-gray-900` for primary, `text-gray-500` for secondary). Use a very subtle accent color (like a soft black or understated blue) only for active states or the "Streak" counter.
- Components: Flat, no shadows (`shadow-none`), use thin, light borders (`border-gray-200`) only where absolutely necessary to separate main sections.

Layout Structure:
1. Left Sidebar (Fixed):
   - A clean profile section.
   - A minimalist "Streak" and "Energy" numeric counter (no flashy bars, just clean text).
   - Navigation links.
2. Main Content Area:
   - Split into two columns or sections:
     a) Time-boxing Calendar (Daily view): A minimalist vertical timeline for blocks like "Tự học Ca 1", "Tập Gym", "Giải trí".
     b) Habit Checklist: Grouped into "Thói quen cần xây dựng" and "Thói quen xấu cần tránh". Use simple, unstyled checkboxes. When checked, apply a simple line-through and text graying (no glowing effects).

Coding Standards (CRITICAL):
- Use Vietnamese for ALL variable names, function names, and state names (e.g., `danhSachThoiQuen`, `trangThaiHoanThanh`, `xuLyDanhDau`).
- DO NOT generate any comments in the code. Zero comments.
- Keep the code clean, modular, and functional within a single file for this initial layout.

Please generate the complete, functioning code for this UI.
