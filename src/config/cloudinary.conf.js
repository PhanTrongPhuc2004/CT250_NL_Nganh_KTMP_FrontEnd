// 📦 src/config/cloudinaryConfig.js
import axios from "axios";

// 🧩 Cấu hình Cloudinary của bạn
const CLOUD_NAME = "dnecovspp"; // ⚠️ thay bằng tên cloud thật của bạn
const UPLOAD_PRESET = "Player_images"; // ⚠️ preset unsigned đã tạo trong dashboard

/**
 * Hàm upload ảnh lên Cloudinary
 * @param {File} file - File ảnh từ input
 * @returns {Promise<string>} - Trả về link ảnh public (secure_url)
 */
export const uploadToCloudinary = async (file) => {
  try {
    if (!file) throw new Error("Không có file để upload");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return res.data.secure_url; // 🔗 link public của ảnh
  } catch (err) {
    console.error("Lỗi upload Cloudinary:", err);
    throw err;
  }
};
