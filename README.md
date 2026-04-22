# Ứng dụng Quản lý Câu lạc bộ Bóng đá - Frontend

Đây là phần Frontend của ứng dụng quản lý câu lạc bộ bóng đá, được xây dựng bằng Vue 3. Nền tảng này giúp quản lý thông tin cầu thủ, lịch thi đấu, quản lý đội hình và các hoạt động của câu lạc bộ.

## Công nghệ sử dụng

Dự án được xây dựng dựa trên các công nghệ mạnh mẽ sau:

*   **[Vite](https://vitejs.dev/):** Công cụ build frontend cực nhanh.
*   **[Vue 3](https://vuejs.org/):** Progressive JavaScript Framework (Sử dụng Composition API).
*   **[Pinia](https://pinia.vuejs.org/):** Quản lý State chính thức cho Vue.
*   **[Vue Router](https://router.vuejs.org/):** Điều hướng trang.
*   **[FontAwesome 6](https://fontawesome.com/):** Bộ icon chuyên nghiệp (đã tích hợp các gói Solid và Brands).

## Cài đặt

Để chạy dự án này ở môi trường local, hãy thực hiện các bước sau:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/PhanTrongPhuc2004/CT250_NL_Nganh_KTMP_FrontEnd
    cd CT250_NL_Nganh_KTMP_FrontEnd
    ```

2.  **Cài đặt các gói phụ thuộc:**
    Sử dụng npm hoặc yarn:
    ```bash
    npm install
    ```

## Hướng dẫn sử dụng

### Chế độ phát triển (Development)
Khởi động server phát triển với tính năng hot-reload:
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại: `http://localhost:5173`

### Xây dựng bản sản xuất (Production Build)
Để build dự án ra thư mục `dist`:
```bash
npm run build
```

## Cấu trúc thư mục chính

*   `src/`: Chứa mã nguồn chính của ứng dụng.
*   `node_modules/`: Các thư viện đã cài đặt.
*   `public/`: Chứa các tài nguyên tĩnh như hình ảnh, logo.

Dự án này được nhóm sinh viên thực hiện cho môn học CT250.
