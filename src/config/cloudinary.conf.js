// 📦 src/config/cloudinaryConfig.js
import axios from "axios";

const CLOUD_NAME = "dnecovspp";
const UPLOAD_PRESET = "Player_images";

export const uploadToCloudinary = async (file) => {
  try {
    console.log('🔍 DEBUG UPLOAD STARTED');
    console.log('📁 File:', file?.name, file?.size, file?.type);

    if (!file || !(file instanceof File)) {
      throw new Error("File không hợp lệ");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    // Thêm các tham số để tránh lỗi
    formData.append("tags", "club_management");
    formData.append("context", `source=webapp`);

    console.log('🔧 Sending to Cloudinary...', {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET
    });

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Thêm để debug chi tiết
        transformRequest: [(data) => {
          console.log('📤 FormData content:');
          for (let pair of data.entries()) {
            console.log(pair[0] + ': ', pair[1]);
          }
          return data;
        }]
      }
    );

    console.log('✅ CLOUDINARY UPLOAD SUCCESS:', {
      url: response.data.secure_url,
      public_id: response.data.public_id,
      bytes: response.data.bytes,
      format: response.data.format
    });

    // KIỂM TRA KỸ URL KẾT QUẢ
    if (!response.data.secure_url) {
      throw new Error('Không nhận được URL từ Cloudinary');
    }

    if (!response.data.secure_url.includes(CLOUD_NAME)) {
      console.warn('⚠️ URL không chứa cloud name đúng!');
    }

    return response.data.secure_url;

  } catch (error) {
    console.error("❌ CLOUDINARY UPLOAD FAILED:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        uploadPreset: UPLOAD_PRESET
      }
    });
    
    // NÉM LỖI CỤ THỂ HƠN
    if (error.response?.data?.error?.message) {
      throw new Error(`Cloudinary: ${error.response.data.error.message}`);
    }
    throw error;
  }
};