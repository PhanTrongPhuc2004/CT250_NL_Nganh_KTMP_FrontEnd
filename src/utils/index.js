export const formatTime = (time) => {
  if (!time) return "Chưa xác định";

  try {
    // Nếu chỉ có giờ (VD: "19:00")
    if (/^\d{1,2}:\d{2}$/.test(time)) return time;

    // Nếu là dạng ISO
    const date = new Date(time);
    return date.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Lỗi khi formatTime:", error);
    return time;
  }
};
export const formatDate = (time) => {
  if (!time) return "";
  try {
    const date = new Date(time);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // ✅ Chuẩn HTML input[type=date]
  } catch (error) {
    console.error("Lỗi khi formatDateForInput:", error);
    return "";
  }
};
