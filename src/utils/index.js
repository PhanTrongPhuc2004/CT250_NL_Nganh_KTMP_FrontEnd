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
  if (!time) return "Chưa xác định";

  try {
    const date = new Date(time);
    return date.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Lỗi khi formatDate:", error);
    return time;
  }
};
