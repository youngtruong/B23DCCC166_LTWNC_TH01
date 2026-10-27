# Class Deadline Hub — giao diện tham khảo PTIT S-Link

Theo yêu cầu người dùng, thiết kế tham khảo ngôn ngữ cổng sinh viên S-Link: đỏ học thuật, nền trắng/xám sáng, sidebar có icon, header gọn, vùng nội dung phân cấp rõ. Giữ nhận diện ClassHub riêng; không dùng logo S-Link và không thể hiện đây là sản phẩm chính thức của Học viện.

Màu: đỏ chủ đạo #b8202e; đỏ đậm #951b27; nền #f6f7f9; surface trắng; ink #202636; secondary #687082; line #e8eaf0. Các môn học dùng điểm nhấn đỏ, xanh dương, tím và xanh lá nhất quán. Be Vietnam Pro cho dữ liệu; serif italic chỉ dùng làm điểm nhấn trong banner. Khoảng cách 4/8/12/16/24/32/48; radius 8/12/16/20. Nút/trường nhập tối thiểu 44px.

Trang chủ là tổng quan lớp: banner hình học học thuật, số môn/deadline lấy từ JSON khi build SSG, lưới môn học và các deadline đầu tiên trong lịch. Danh sách dùng nhãn ưu tiên, ngày nộp và countdown rõ. Dashboard có tiến độ cá nhân thực tế, sidebar lồng nhau theo đề; form quản trị và đăng nhập đồng bộ cùng hệ thống.

Giữ nguyên route, chiến lược SSG/ISR/SSR, Auth.js, can(), POST/303 và các thao tác JSON. Không thêm thư viện. CSS Hub được giới hạn bằng tên class; phần Redux cũ vẫn giữ nguyên. Kiểm tra desktop, tablet, mobile, focus bàn phím và reduced motion.

Tham khảo: https://slink.ptit.edu.vn/ và hướng dẫn PTIT S-Link công khai của PTIT. Bản thiết kế mới là diễn giải cho Class Deadline Hub, không sao chép màn hình đăng nhập hay nhận diện của S-Link.
