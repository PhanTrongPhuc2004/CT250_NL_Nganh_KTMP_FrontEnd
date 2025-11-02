// ✅ Định nghĩa field ĐƠN GIẢN - KHÔNG CẦN createField()
import { fetchSquad } from ".";
const viTriOptions = [
  { name: "Tiền đạo" },
  { name: "Tiền vệ" },
  { name: "Hậu vệ" },
];
export const adminFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "anhMinhHoa", type: "file", label: "Ảnh minh họa" },
];

export const nguoiHamMoFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
];
export const playerFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "namHanhNghe", type: "text", label: "Năm hành nghề" },
  { name: "cauLacBoCu", type: "text", label: "Câu lạc bộ cũ" },
  { name: "chieuCao", type: "number", step: "0.01", label: "Chiều cao" },
  { name: "viTri", type: "select", label: "Vị trí", children: viTriOptions },
  {
    name: "chanThuan",
    type: "select",
    label: "Chân thuận",
    children: [{ name: "Trái" }, { name: "Phải" }, { name: "Cả hai" }],
  },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "soAo", type: "number", label: "Số áo" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "namSinh", type: "date", label: "Năm sinh" },
  {
    name: "doiHinhId",
    type: "select",
    label: "Đội hình",
    children: await fetchSquad(),
  },
  { name: "anhMinhHoa", type: "file", label: "Ảnh minh họa" },
];

export const huanLuyenVienFields = [
  { name: "hoVaTen", type: "text", label: "Họ và tên" },
  { name: "email", type: "email", label: "Email" },
  { name: "tenDangNhap", type: "text", label: "Tên đăng nhập" },
  { name: "matKhau", type: "password", label: "Mật khẩu" },
  { name: "diaChi", type: "text", label: "Địa chỉ" },
  { name: "namHanhNghe", type: "number", label: "Năm hành nghề" },
  { name: "cauLacBoCu", type: "text", label: "Câu lạc bộ cũ" },
  { name: "quocTich", type: "text", label: "Quốc tịch" },
  { name: "ngayGiaNhap", type: "date", label: "Ngày gia nhập" },
  { name: "anhMinhHoa", type: "text", label: "Ảnh minh họa" },
  {
    name: "doiHinhId",
    type: "select",
    label: "Đội hình",
    children: await fetchSquad(),
  },
  {
    name: "phuTrach",
    type: "select",
    label: "Phụ trách",
    children: [
      { name: "Huấn luyện viên trưởng" },
      { name: "Trợ lý huấn luyện viên" },
      { name: "Huấn luyện viên thể lực" },
      { name: "Huấn luyện viên thủ môn" },
      { name: "Huấn luyện viên phục hồi chấn thương" },
      { name: "Huấn luyện viên chiến thuật" },
      { name: "Huấn luyện viên đội trẻ" },
      { name: "Huấn luyện viên tâm lý" },
      { name: "Chuyên gia dinh dưỡng" },
    ],
  },
  { name: "namSinh", type: "number", label: "Năm sinh" },
];

export const seasonFields = [
  { name: "namBatDau", type: "number", label: "Năm bắt đầu" },
  { name: "namKetThuc", type: "number", label: "Năm kết thúc" },
];

export const tournamentFields = [
  { name: "tenGiaiDau", type: "text", label: "Tên" },
  { name: "moTa", type: "text", label: "Mô tả" },
];

export const souvenirFields = [
  {
    name: "tenQuaLuuNiem",
    label: "Tên quà lưu niệm",
    type: "text",
  },
  {
    name: "gia",
    label: "Giá (VNĐ)",
    type: "number",
    step: "1000",
    min: 0,
  },
  {
    name: "moTa",
    label: "Mô tả",
    type: "text",
  },
  {
    name: "anhMinhHoa",
    label: "Ảnh minh họa (URL)",
    type: "text",
  },
];

export const matchFields = [
  { name: "doiNha", type: "text", label: "Đội nhà" },
  { name: "doiKhach", type: "text", label: "Đội khách" },

  { name: "diaDiem", type: "text", label: "Địa điểm" },
  { name: "ngayDienRa", type: "date", label: "Ngày diễn ra" },
  { name: "thoiGianDienRa", type: "time", label: "Thời gian diễn ra" },
  {
    name: "doiHinhId",
    type: "select",
    label: "Chọn đội hình",
    children: await fetchSquad(),
  },
];

export const squadFields = [
  { name: "doiHinh", type: "text", label: "Tên đội hình" },
];
