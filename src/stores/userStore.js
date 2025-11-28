// stores/userStore.js
import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { ref } from "vue";
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const accessToken = ref(localStorage.getItem('accessToken') || null)
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
    authChecked: false,
    initializeError: null,
  }),
  
  actions: {
    async initialize() {
      console.log("🔄 Store: Bắt đầu initialize...");

      if (this.loading) {
        console.log("⏳ Store: Đang loading, bỏ qua...");
        return;
      }

      this.loading = true;
      this.initializeError = null;

      try {
        await this.checkAuth();
        console.log("✅ Store: Initialize thành công");
      } catch (error) {
        console.error("❌ Store: Initialize thất bại:", error);
        this.initializeError = error;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      console.log("🔄 Store: Đang checkAuth...");

      try {
        const res = await axios.get("/nguoidung/check", {
          withCredentials: true,
        });

        this.user = res.data.user;
        this.authChecked = true;
        console.log(
          "✅ Store: CheckAuth thành công - User:",
          this.user?.tenDangNhap
        );
        return true;
      } catch (err) {
        this.user = null;
        this.authChecked = true;

        if (err.response?.status === 401) {
          console.log(
            "🔐 Store: Token không hợp lệ - Interceptor sẽ xử lý refresh"
          );
        } else {
          console.error("❌ Store: CheckAuth thất bại:", err.message);
        }

        return false;
      }
    },

    async login(credentials) {
      try {
        this.loading = true;
        const response = await axios.post("/nguoidung/login", credentials, {
          withCredentials: true,
        });

        this.user = response.data.user;
        console.log("✅ Đăng nhập thành công:", this.user?.tenDangNhap);

        this.mergeCart();
        return true;
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        this.user = null;
        return false;
      } finally {
        this.loading = false;
      }
    },
    loginFromGoogle(userData) {
      try {
        console.log('🔄 UserStore: Google login with data', userData)
        
        this.user = userData.user
        this.accessToken = userData.accessToken
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userData.user))
        localStorage.setItem('accessToken', userData.accessToken)
        
        console.log('✅ UserStore: Google login successful', this.user)
        
        // Gọi mergeCart nếu có
        if (this.mergeCart) {
          this.mergeCart()
        }
        
        return true
      } catch (error) {
        console.error('❌ UserStore: Google login failed', error)
        this.user = null
        this.accessToken = null
        return false
      }
    },
    mergeCart() {
  // Kiểm tra user đã đăng nhập chưa
  if (!this.user) {
    console.warn("⚠️ Chưa đăng nhập, không thể merge giỏ hàng");
    return;
  }
  
  try {
    const guestCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
    const userCartKey = `cart_${this.user.tenDangNhap}`;
    const userCart = JSON.parse(localStorage.getItem(userCartKey) || "[]");

    // Nếu không có cart_guest hoặc cart_guest rỗng
    if (!guestCart || guestCart.length === 0) {
      console.log("ℹ️ Không có giỏ hàng guest để merge");
      return;
    }

    console.log(`🛒 Đang merge ${guestCart.length} sản phẩm từ guest vào user cart`);

    // Tạo bản sao của user cart để tránh mutation trực tiếp
    const mergedCart = [...userCart];

    // Merge từng item từ guest cart
    guestCart.forEach((guestItem) => {
      // Validate item có đủ thông tin cần thiết
      if (!guestItem.maSanPham || !guestItem.quantity) {
        console.warn("⚠️ Bỏ qua item không hợp lệ trong guest cart:", guestItem);
        return;
      }

      const existingItemIndex = mergedCart.findIndex(
        userItem => userItem.maSanPham === guestItem.maSanPham
      );

      if (existingItemIndex > -1) {
        // Item đã tồn tại, cộng dồn quantity
        mergedCart[existingItemIndex].quantity += guestItem.quantity;
        console.log(`↔️ Đã cập nhật số lượng cho sản phẩm ${guestItem.maSanPham}`);
      } else {
        // Item mới, thêm vào giỏ hàng
        mergedCart.push({ ...guestItem });
        console.log(`➕ Đã thêm mới sản phẩm ${guestItem.maSanPham}`);
      }
    });

    // Lưu giỏ hàng đã merge và xóa guest cart
    localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
    localStorage.removeItem("cart_guest");
    
    console.log("✅ Đã merge giỏ hàng thành công");
    console.log(`📊 Tổng số sản phẩm trong giỏ: ${mergedCart.length}`);

    // Có thể trigger event hoặc callback để cập nhật UI
    this.onCartMerged?.(mergedCart);

  } catch (error) {
    console.error("❌ Lỗi khi merge giỏ hàng:", error);
  }
},

    async logout() {
      try {
        await axios.post(
          "/nguoidung/logout",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("Lỗi logout:", err);
      } finally {
        this.user = null;
        this.authChecked = false;

        // Clear cart
        if (this.user?.tenDangNhap) {
          localStorage.removeItem(`cart_${this.user.tenDangNhap}`);
        }
        localStorage.removeItem("cart_guest");

        window.location.href = "/";
      }
    },

    // ✅ XÓA các hàm không cần thiết
    // refreshToken(), handleAuthFailure() - để interceptor xử lý
  },
});
