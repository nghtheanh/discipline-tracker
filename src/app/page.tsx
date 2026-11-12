"use client";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  Flame,
  BarChart3,
  Grid3X3,
  CheckSquare,
  Plus,
  Trash2,
  User,
  Snowflake,
  Clock,
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

  const chuoiNgayLienTiep = calcStreak({
    ...danhSachNgay,
    [duLieuHomNay.key]: {
      pct: duLieuHomNay.day.pct,
      frozen: duLieuHomNay.day.frozen,
    },
  });

  const chiSoNangLuong = Math.round(duLieuHomNay.day.pct * 100);

  const danhSachThoiQuenTot = duLieuHomNay.settings.good.map((muc) => ({
    ...muc,
    trangThaiHoanThanh: !!duLieuHomNay.day.good[muc.id],
  }));

  const danhSachThoiQuenXau = duLieuHomNay.settings.bad.map((muc) => ({
    ...muc,
    trangThaiHoanThanh: !!duLieuHomNay.day.bad[muc.id],
  }));

  const khoiThoiGianHomNay = quanLyKhoi.blocks.filter(
    (khoi) => khoi.date === duLieuHomNay.key
  );

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

  const danhSachDieuHuong = [
    { duongDan: "/", nhan: "Hôm nay", bieuTuong: CheckSquare, dangChon: true },
    { duongDan: "/calendar", nhan: "Lịch tuần", bieuTuong: Calendar, dangChon: false },
    { duongDan: "/deep-work", nhan: "Deep Work", bieuTuong: Flame, dangChon: false },
    { duongDan: "/heatmap", nhan: "Bản đồ xanh", bieuTuong: Grid3X3, dangChon: false },
    { duongDan: "/report", nhan: "Báo cáo tuần", bieuTuong: BarChart3, dangChon: false },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <aside className="border-b border-gray-200 bg-gray-50 px-5 py-6 md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:justify-between md:border-b-0 md:border-r">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Sổ kỷ luật</p>
              <p className="text-xs text-gray-500">
                {format(new Date(), "dd/MM/yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-200 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Streak
              </p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">
                {chuoiNgayLienTiep}
                <span className="ml-1 text-xs font-normal text-gray-500">
                  ngày
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Energy
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {chiSoNangLuong}%
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {danhSachDieuHuong.map((muc) => {
              const BieuTuong = muc.bieuTuong;
              return (
                <Link
                  key={muc.duongDan}
                  href={muc.duongDan}
                  className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-colors ${
                    muc.dangChon
                      ? "bg-white font-medium text-blue-600 border border-gray-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <BieuTuong className="h-4 w-4" />
                  <span>{muc.nhan}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 pt-4 md:mt-0">
          <button
            type="button"
            onClick={duLieuHomNay.toggleFreeze}
            className={`flex w-full items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-medium transition-colors ${
              duLieuHomNay.day.frozen
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Snowflake className="h-3.5 w-3.5" />
            {duLieuHomNay.day.frozen
              ? "Đang đóng băng hôm nay"
              : "Đóng băng hôm nay"}
          </button>
        </div>
      </aside>

      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          <header className="mb-8 border-b border-gray-200 pb-5">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Kế hoạch hôm nay
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Tập trung vào từng khối thời gian và giữ vững thói quen cốt lõi.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-2">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Time-boxing hôm nay
                </h2>
                <Link
                  href="/calendar"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Mở lịch tuần
                </Link>
              </div>

              <div className="border-l border-gray-200 pl-5">
                {khoiThoiGianHomNay.length === 0 ? (
                  <p className="py-4 text-sm text-gray-400">
                    Chưa có khối thời gian nào cho hôm nay. Thêm bên dưới hoặc kéo thả ở Lịch tuần.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {khoiThoiGianHomNay.map((khoi) => (
                      <div
                        key={khoi.id}
                        className="group relative flex items-start justify-between gap-3 border-b border-gray-100 pb-3"
                      >
                        <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-gray-300 bg-white" />
                        <label className="flex flex-1 cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={khoi.done}
                            onChange={() => xuLyDanhDauKhoi(khoi.id, khoi.done)}
                            className="mt-1 h-4 w-4 accent-blue-600"
                          />
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                {minutesToHHMM(khoi.start)} –{" "}
                                {minutesToHHMM(khoi.end)}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span>{BLOCK_META[khoi.type].label}</span>
                            </div>
                            <p
                              className={`mt-0.5 text-sm ${
                                khoi.done
                                  ? "text-gray-400 line-through"
                                  : "font-medium text-gray-900"
                              }`}
                            >
                              {khoi.title}
                            </p>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() => quanLyKhoi.removeBlock(khoi.id)}
                          aria-label="Xóa khối thời gian"
                          className="text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={xuLyThemKhoi}
                  className="mt-5 space-y-2 border-t border-gray-200 pt-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      value={gioBatDau}
                      onChange={(e) => setGioBatDau(e.target.value)}
                      className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                    />
                    <span className="text-xs text-gray-400">đến</span>
                    <input
                      type="time"
                      value={gioKetThuc}
                      onChange={(e) => setGioKetThuc(e.target.value)}
                      className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
                    />
                    <select
                      value={loaiKhoiMoi}
                      onChange={(e) =>
                        setLoaiKhoiMoi(e.target.value as BlockType)
                      }
                      className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
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
                      placeholder="Thêm block (vd: Tự học Ca 1)..."
                      className="flex-1 border-b border-gray-200 bg-transparent py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="h-3.5 w-3.5" /> Thêm
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="space-y-8">
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Việc hôm nay
                </h2>
                <div className="divide-y divide-gray-100 border-t border-gray-200">
                  {duLieuHomNay.day.tasks.map((viec) => (
                    <div
                      key={viec.id}
                      className="group flex items-center justify-between gap-3 py-2.5"
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={viec.done}
                          onChange={() => duLieuHomNay.toggleTask(viec.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span
                          className={`text-sm ${
                            viec.done
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {viec.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => duLieuHomNay.removeTask(viec.id)}
                        aria-label="Xóa việc"
                        className="text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={xuLyThemViec} className="mt-2">
                  <input
                    type="text"
                    value={viecMoi}
                    onChange={(e) => setViecMoi(e.target.value)}
                    placeholder="+ Thêm việc hôm nay, nhấn Enter..."
                    className="w-full border-b border-gray-200 bg-transparent py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </form>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Thói quen cần xây dựng
                </h2>
                <div className="divide-y divide-gray-100 border-t border-gray-200">
                  {danhSachThoiQuenTot.map((thoiQuen) => (
                    <div
                      key={thoiQuen.id}
                      className="group flex items-center justify-between gap-3 py-2.5"
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={thoiQuen.trangThaiHoanThanh}
                          onChange={() =>
                            duLieuHomNay.toggleHabit("good", thoiQuen.id)
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span
                          className={`text-sm ${
                            thoiQuen.trangThaiHoanThanh
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {thoiQuen.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          duLieuHomNay.removeHabit("good", thoiQuen.id)
                        }
                        aria-label="Xóa thói quen"
                        className="text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    xuLyThemThoiQuen("good", thoiQuenTotMoi, setThoiQuenTotMoi);
                  }}
                  className="mt-2"
                >
                  <input
                    type="text"
                    value={thoiQuenTotMoi}
                    onChange={(e) => setThoiQuenTotMoi(e.target.value)}
                    placeholder="+ Thêm thói quen cần xây dựng..."
                    className="w-full border-b border-gray-200 bg-transparent py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </form>
              </div>

              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Thói quen xấu cần tránh
                </h2>
                <p className="mb-3 text-xs text-gray-400">
                  Chỉ đánh dấu khi bạn đã giữ kỷ luật suốt 24 giờ.
                </p>
                <div className="divide-y divide-gray-100 border-t border-gray-200">
                  {danhSachThoiQuenXau.map((thoiQuen) => (
                    <div
                      key={thoiQuen.id}
                      className="group flex items-center justify-between gap-3 py-2.5"
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={thoiQuen.trangThaiHoanThanh}
                          onChange={() =>
                            duLieuHomNay.toggleHabit("bad", thoiQuen.id)
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span
                          className={`text-sm ${
                            thoiQuen.trangThaiHoanThanh
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {thoiQuen.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          duLieuHomNay.removeHabit("bad", thoiQuen.id)
                        }
                        aria-label="Xóa thói quen"
                        className="text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    xuLyThemThoiQuen("bad", thoiQuenXauMoi, setThoiQuenXauMoi);
                  }}
                  className="mt-2"
                >
                  <input
                    type="text"
                    value={thoiQuenXauMoi}
                    onChange={(e) => setThoiQuenXauMoi(e.target.value)}
                    placeholder="+ Thêm thói quen xấu cần tránh..."
                    className="w-full border-b border-gray-200 bg-transparent py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                  />
                </form>
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
      </main>
    </div>
  );
}
