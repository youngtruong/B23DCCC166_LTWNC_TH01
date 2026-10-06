# Báo cáo nâng cấp và đo hiệu năng

Ngày đo: 06/10/2026 (Asia/Ho_Chi_Minh). Chrome desktop, viewport 1440 × 900 cho phép đo render, React development, 10.000 bài tập. Lighthouse 12.8.2, preset desktop, chỉ category Performance, dev server localhost:5173. Máy còn chạy các ứng dụng khác; các lần đo không phải benchmark production được cô lập.

## So sánh

Baseline được dựng lại trên `/benchmark?mode=baseline`, dùng cùng AssignmentCard và dữ liệu nhưng bỏ memo, debounce và virtualization. Đây là đối chứng thực nghiệm, không phải kết quả đã ghi trước khi thay đổi mã nguồn ứng dụng cũ.

| Chỉ số | Trước (đối chứng) | Sau |
| --- | ---: | ---: |
| Số AssignmentCard mount trong viewport ban đầu | 10.000 | 7 |
| Render card khi gõ `Bài`, 100 ms giữa ký tự, chờ thêm 600 ms | 30.000 | 0 |
| Tổng actualDuration của các commit tìm kiếm (React Profiler) | 5.346,4 ms | 9,7 ms |
| Commit của vùng danh sách khi tìm kiếm | 3 | 5 |
| Render card khi đổi theme | 0 | 0 |
| Lighthouse Performance | Không có điểm: trang ngừng phản hồi | 57/100 |
| Lighthouse LCP | Không đo được | 6.959,6 ms |
| Lighthouse TBT | Không đo được | 13 ms |

Kết quả render 0 sau tối ưu là do truy vấn `Bài` vẫn khớp tất cả bài mẫu. Các object bài tập và handler giữ nguyên nên memo bỏ qua render lại card. Danh sách vẫn commit để xử lý query/debounce; virtualization chỉ giữ các card trong viewport và overscan. Các truy vấn thay đổi kết quả sẽ mount/render các card khác. Bộ test kiểm tra riêng truy vấn loại bỏ bài không khớp.

Lighthouse đối chứng báo: `Lighthouse was unable to reliably load the URL you requested because the page stopped responding.` Đã thử lại với `--disable-full-page-screenshot --max-wait-for-load=30000`; không có báo cáo điểm hợp lệ. Không thể kết luận mức tăng điểm Lighthouse từ dữ liệu này.

## Minh chứng

- [Dữ liệu đo render](render-results.json), [ảnh trước](baseline.png), [ảnh sau](optimized.png).
- [Lighthouse đối chứng báo PAGE_HUNG](lighthouse-baseline.report.html), [JSON lỗi gốc](lighthouse-baseline.report.json).
- [Lighthouse sau tối ưu](lighthouse-optimized.report.html), [JSON gốc](lighthouse-optimized.report.json).
- Console Redux thật trong Chrome DevTools: [thêm](console-add.png), [hoàn thành](console-complete.png), [xoá](console-delete.png). Bài thử được tạo và xoá trong phiên localhost, không sửa dữ liệu API.

React DevTools extension chưa được cài trong Chrome đang kết nối (menu DevTools không có Components/Profiler). Vì vậy chưa có bản ghi từ **React DevTools Profiler** đúng theo yêu cầu. Số liệu ở trên được ghi bằng API React `<Profiler>` và bộ đếm render development. Test RTL cũng xác nhận đổi theme không render lại một child không dùng context. Để hoàn thiện minh chứng DevTools: cài React DevTools, mở `/benchmark?mode=optimized`, bắt đầu record, đổi theme rồi dừng; vùng AssignmentList/AssignmentCard không được render bởi thao tác này. Chạy thêm record khi gõ `Bài` và đối chiếu dữ liệu JSON.

## Chạy lại

1. Dùng Node >=22.13.0, `npm install`, `npm run dev`.
2. Chạy `npm run measure:performance`. Script mặc định dùng Chrome macOS tại `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; sửa đường dẫn executablePath nếu dùng hệ điều hành khác. Script kiểm tra đúng 10.000 card baseline và dưới 20 card tối ưu trước khi ghi số liệu.
3. Chạy Lighthouse:

```sh
npx lighthouse 'http://localhost:5173/benchmark?mode=optimized' --chrome-flags='--headless --no-sandbox' --only-categories=performance --preset=desktop --disable-full-page-screenshot --output=html --output=json --output-path=docs/performance/lighthouse-optimized
```

Đổi `optimized` thành `baseline` để đo đối chứng. Nên chạy tuần tự trên máy rảnh. Điểm có thể biến động; cần đo production nhiều lần để đánh giá hiệu năng triển khai.

## Kiểm thử và kiểm tra mã

- `npm test`: **24/24 pass**. Unit cho date/stats/reducer và các trường hợp biên; component với userEvent cho card/form; async API loading/success/error/malformed/network; renderHook fake timers cho debounce; thêm kiểm tra ghim, virtualization và theme.
- Statements toàn `features/`: **80,83%**, riêng assignments **80%**. Không loại trừ `useDeadlineTools` chưa có test (coverage 0%) khỏi mẫu số.
- `jest.config.ts`: threshold statements **70%** cho `./features/`, thu thập toàn bộ TS/TSX trong features.
- TypeScript, ESLint và production build thành công. Build chạy bằng runtime Node 22 cục bộ vì Node mặc định của môi trường là 20.
- Redux logger chỉ có middleware trong development. Bỏ log thao tác nạp 10.000 dòng để phép đo không bị console khổng lồ ảnh hưởng. Những action thêm/xoá/hoàn thành vẫn được log.
- Kết quả API đến muộn không được ghi đè dữ liệu stress đã tạo; có test bảo vệ.
