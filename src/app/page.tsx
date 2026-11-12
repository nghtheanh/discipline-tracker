"use client";
import { useState } from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, differenceInCalendarDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Flame,
  Check,
  Plus,
  Trash2,
  Clock,
  Snowflake,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { DailyReflection } from "@/components/daily-reflection";
import { useBlocks } from "@/hooks/use-blocks";
import { useDays } from "@/hooks/use-days";
import { useToday } from "@/hooks/use-today";
import { BLOCK_META, minutesToHHMM } from "@/lib/blocks";
import { calcStreak } from "@/lib/discipline";
import type { BlockType } from "@/lib/types";

export default function TrangChu() {
  const duLieuHomNay = useToday();
  const danhSachNgay = useDays();
  const quanLyKhoi = useBlocks();

  const [viecMoi, setViecMoi] = useState("");
  const [thoiQuenTotMoi, setThoiQuenTotMoi] = useState("");
  const [thoiQuenXauMoi, setThoiQuenXauMoi] = useState("");

  const [tieuDeKhoiMoi, setTieuDeKhoiMoi] = useState("");
  const [gioBatDau, setGioBatDau] = useState("08:00");
  const [gioKetThuc, setGioKetThuc] = useState("09:30");
  const [loaiKhoiMoi, setLoaiKhoiMoi] = useState<BlockType>("study");

  const ngayHienTai = new Date();
  const dauTuan = startOfWeek(ngayHienTai, { weekStartsOn: 1 });
  const cuoiTuan = endOfWeek(ngayHienTai, { weekStartsOn: 1 });
  const soNgayConLaiTrongTuan = Math.max(0, differenceInCalendarDays(cuoiTuan, ngayHienTai));

  const chuoiNgayLienTiep = calcStreak({
    ...danhSachNgay,
    [duLieuHomNay.key]: {
      pct: duLieuHomNay.day.pct,
      frozen: duLieuHomNay.day.frozen,
    },
  });

  const tongSoMuc =
    duLieuHomNay.day.tasks.length +
    duLieuHomNay.settings.good.length +
    duLieuHomNay.settings.bad.length;

  const soMucDaXong =
    duLieuHomNay.day.tasks.filter((v) => v.done).length +
    duLieuHomNay.settings.good.filter((h) => duLieuHomNay.day.good[h.id]).length +
    duLieuHomNay.settings.bad.filter((h) => duLieuHomNay.day.bad[h.id]).length;

  const tyLeHoanThanh = tongSoMuc > 0 ? Math.round((soMucDaXong / tongSoMuc) * 100) : 0;

  const danhSachThoiQuenTot = duLieuHomNay.settings.good.map((muc) => ({
    ...muc,
    trangThaiHoanThanh: !!duLieuHomNay.day.good[muc.id],
  }));

  const danhSachThoiQuenXau = duLieuHomNay.settings.bad.map((muc) => ({
    ...muc,
    trangThaiHoanThanh: !!duLieuHomNay.day.bad[muc.id],
  }));

  const khoiThoiGianHomNay = quanLyKhoi.blocks
    .filter((khoi) => khoi.date === duLieuHomNay.key)
    .sort((a, b) => a.start - b.start);

  const chuyenGioSangPhut = (chuoiGio: string) => {
    const [gio, phut] = chuoiGio.split(":").map(Number);
    return (gio || 0) * 60 + (phut || 0);
  };

  const xuLyThemKhoi = (suKien: React.FormEvent) => {
    suKien.preventDefault();
    if (!tieuDeKhoiMoi.trim()) return;
    const batDau = chuyenGioSangPhut(gioBatDau);
    const ketThuc = chuyenGioSangPhut(gioKetThuc);
    if (ketThuc <= batDau) return;
    quanLyKhoi.addBlock({
      date: duLieuHomNay.key,
      start: batDau,
      end: ketThuc,
      type: loaiKhoiMoi,
      title: tieuDeKhoiMoi.trim(),
      done: false,
    });
    setTieuDeKhoiMoi("");
  };

  const xuLyDanhDauKhoi = (maKhoi: string, trangThaiHienTai: boolean) => {
    quanLyKhoi.updateBlock(maKhoi, { done: !trangThaiHienTai });
  };

  const xuLyThemViec = (suKien: React.FormEvent) => {
    suKien.preventDefault();
    if (!viecMoi.trim()) return;
    duLieuHomNay.addTask(viecMoi.trim());
    setViecMoi("");
  };

  const xuLyThemThoiQuen = (
    loai: "good" | "bad",
    giaTri: string,
    datLai: (v: string) => void
  ) => {
    if (!giaTri.trim()) return;
    duLieuHomNay.addHabit(loai, giaTri.trim());
    datLai("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tuần: {format(dauTuan, "dd 'thg' MM", { locale: vi })} –{" "}
                {format(cuoiTuan, "dd 'thg' MM", { locale: vi })}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {format(ngayHienTai, "EEEE, dd/MM/yyyy", { locale: vi })}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>{chuoiNgayLienTiep} ngày liên tiếp</span>
              </div>
              <button
                type="button"
                onClick={duLieuHomNay.toggleFreeze}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  duLieuHomNay.day.frozen
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Snowflake className="h-3.5 w-3.5" />
                <span>{duLieuHomNay.day.frozen ? "Đang đóng băng" : "Đóng băng"}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                {soMucDaXong}/{tongSoMuc} hoàn thành ({tyLeHoanThanh}%)
              </span>
              <span className="text-gray-300">•</span>
              <span>còn {soNgayConLaiTrongTuan} ngày trong tuần</span>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 font-medium text-gray-900 hover:underline"
            >
              Mở chế độ xem tuần <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-300"
              style={{ width: `${tyLeHoanThanh}%` }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Time-boxing trong ngày
              </h2>
              <span className="text-xs text-gray-500">
                {khoiThoiGianHomNay.filter((k) => k.done).length}/{khoiThoiGianHomNay.length} block xong
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              {khoiThoiGianHomNay.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-7 w-7 text-gray-300" />
                  <p className="mt-2 text-sm font-medium text-gray-700">Chưa có block thời gian nào</p>
                  <p className="text-xs text-gray-400">
                    Phân bổ giờ học, tập gym, giải trí để quản lý ngày hiệu quả.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {khoiThoiGianHomNay.map((khoi) => (
                    <div
                      key={khoi.id}
                      className={`group flex items-center justify-between rounded-md border border-l-4 px-3 py-2.5 transition-colors ${
                        BLOCK_META[khoi.type].borderClass
                      } ${khoi.done ? "border-gray-200 bg-gray-50/60" : "border-gray-200 bg-white hover:bg-gray-50/40"}`}
                    >
                      <button
                        type="button"
                        onClick={() => xuLyDanhDauKhoi(khoi.id, khoi.done)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            khoi.done
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {khoi.done && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm ${
                              khoi.done
                                ? "text-gray-400 line-through"
                                : "font-medium text-gray-900"
                            }`}
                          >
                            {khoi.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {minutesToHHMM(khoi.start)} – {minutesToHHMM(khoi.end)} ·{" "}
                            {BLOCK_META[khoi.type].label}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        {khoi.type === "study" && !khoi.done && (
                          <Link
                            href={`/deep-work?task=${encodeURIComponent(khoi.title)}`}
                            className="hidden items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 group-hover:inline-flex"
                          >
                            Focus <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => quanLyKhoi.removeBlock(khoi.id)}
                          aria-label="Xóa block"
                          className="text-gray-300 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={xuLyThemKhoi} className="mt-4 border-t border-gray-100 pt-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="time"
                    value={gioBatDau}
                    onChange={(e) => setGioBatDau(e.target.value)}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-gray-900 focus:outline-none"
                  />
                  <span className="text-xs text-gray-400">–</span>
                  <input
                    type="time"
                    value={gioKetThuc}
                    onChange={(e) => setGioKetThuc(e.target.value)}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-gray-900 focus:outline-none"
                  />
                  <select
                    value={loaiKhoiMoi}
                    onChange={(e) => setLoaiKhoiMoi(e.target.value as BlockType)}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-gray-900 focus:outline-none"
                  >
                    <option value="study">Học tập</option>
                    <option value="gym">Tập luyện</option>
                    <option value="fun">Giải trí</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tieuDeKhoiMoi}
                    onChange={(e) => setTieuDeKhoiMoi(e.target.value)}
                    placeholder="Tên block mới..."
                    className="flex-1 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                  >
                    <Plus className="h-3 w-3" /> Thêm
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Việc cần làm hôm nay
              </h2>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="space-y-1 divide-y divide-gray-100">
                  {duLieuHomNay.day.tasks.length === 0 ? (
                    <p className="py-2 text-xs text-gray-400">Chưa có công việc nào trong danh sách.</p>
                  ) : (
                    duLieuHomNay.day.tasks.map((viec) => (
                      <div
                        key={viec.id}
                        className="group flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                      >
                        <button
                          type="button"
                          onClick={() => duLieuHomNay.toggleTask(viec.id)}
                          className="flex flex-1 items-center gap-3 text-left"
                        >
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                              viec.done
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {viec.done && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-sm ${
                              viec.done ? "text-gray-400 line-through" : "text-gray-900"
                            }`}
                          >
                            {viec.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => duLieuHomNay.removeTask(viec.id)}
                          aria-label="Xóa việc"
                          className="text-gray-300 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={xuLyThemViec} className="mt-3 border-t border-gray-100 pt-2.5">
                  <input
                    type="text"
                    value={viecMoi}
                    onChange={(e) => setViecMoi(e.target.value)}
                    placeholder="+ Thêm việc cần làm..."
                    className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </form>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Thói quen cần xây dựng
              </h2>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="space-y-1 divide-y divide-gray-100">
                  {danhSachThoiQuenTot.map((thoiQuen) => (
                    <div
                      key={thoiQuen.id}
                      className="group flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <button
                        type="button"
                        onClick={() => duLieuHomNay.toggleHabit("good", thoiQuen.id)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            thoiQuen.trangThaiHoanThanh
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {thoiQuen.trangThaiHoanThanh && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-sm ${
                            thoiQuen.trangThaiHoanThanh
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {thoiQuen.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => duLieuHomNay.removeHabit("good", thoiQuen.id)}
                        aria-label="Xóa thói quen"
                        className="text-gray-300 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    xuLyThemThoiQuen("good", thoiQuenTotMoi, setThoiQuenTotMoi);
                  }}
                  className="mt-3 border-t border-gray-100 pt-2.5"
                >
                  <input
                    type="text"
                    value={thoiQuenTotMoi}
                    onChange={(e) => setThoiQuenTotMoi(e.target.value)}
                    placeholder="+ Thêm thói quen mới..."
                    className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </form>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Thói quen xấu cần tránh
                </h2>
                <p className="text-[11px] text-gray-400">
                  Chỉ tick khi đã giữ vững kỷ luật suốt 24 giờ.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="space-y-1 divide-y divide-gray-100">
                  {danhSachThoiQuenXau.map((thoiQuen) => (
                    <div
                      key={thoiQuen.id}
                      className="group flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <button
                        type="button"
                        onClick={() => duLieuHomNay.toggleHabit("bad", thoiQuen.id)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            thoiQuen.trangThaiHoanThanh
                              ? "border-amber-600 bg-amber-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {thoiQuen.trangThaiHoanThanh && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-sm ${
                            thoiQuen.trangThaiHoanThanh
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {thoiQuen.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => duLieuHomNay.removeHabit("bad", thoiQuen.id)}
                        aria-label="Xóa thói quen"
                        className="text-gray-300 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    xuLyThemThoiQuen("bad", thoiQuenXauMoi, setThoiQuenXauMoi);
                  }}
                  className="mt-3 border-t border-gray-100 pt-2.5"
                >
                  <input
                    type="text"
                    value={thoiQuenXauMoi}
                    onChange={(e) => setThoiQuenXauMoi(e.target.value)}
                    placeholder="+ Thêm thói quen xấu cần tránh..."
                    className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </form>
              </div>
            </div>

            <DailyReflection
              dayKey={duLieuHomNay.key}
              loaded={duLieuHomNay.loaded}
              reflection={duLieuHomNay.day.reflection}
              onSave={(reflection) => duLieuHomNay.saveDay({ reflection })}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
