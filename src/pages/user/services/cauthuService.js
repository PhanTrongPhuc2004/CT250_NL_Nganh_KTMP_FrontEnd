import axios from "axios";

const API_URL = "http://localhost:5000/cauthu"; // 🔗 thay bằng URL backend của bạn

// Lấy tất cả cầu thủ
export const getAllCauthu = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Lấy cầu thủ theo ID
export const getCauthuById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
