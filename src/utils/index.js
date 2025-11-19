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

export const fetchSquad = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/doihinh`
    );
    let data = response.data;
    console.log("doi hinh fetch duoc o constant", data);
    if (data) {
      data = data.map((item) => ({
        _id: item.maDoiHinh,
        name: item.tenDoiHinh, // đổi field doiHinh -> name
        cauLacBoId: item.cauLacBoId,
      }));
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách đội hình:", error);
  }
};

export const fetchClubInfo = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/caulacbo/`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin câu lạc bộ:", error);
  }
};

export const getMe = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BE_BASE_URL}/nguoidung/me`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin người dùng:", error);
  }
};

export function parseScore(scoreStr) {
    const [home, away] = scoreStr.split('-').map(Number);
    return {
        home,
        away,
        difference: home - away
    };
}