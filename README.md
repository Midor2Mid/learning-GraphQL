# learning-ReactJS
# Buổi 1:
* Khởi tạo thư mục dự án:
  * Vào thư mục project chạy cmd: feathers generate app (đã cài đặt feathers ở global)
  * Xóa toàn bộ nội dung của file index.js tại src/
  * npm install graphql
# Buổi 2:
* Tạo nhiều thuộc tính schema
* Hiện tại ta đang dùng cấu trúc: 
  * type: Query => khai báo các thuộc tính 
  * resolvers: thuộc tính: () => giá trị để khởi tạo các đối tượng cụ thể
  * query=` query myFirstQuery{ các thuộc tính } `
# Buổi 3:
* Tạo object type cho các kiểu dữ liệu cơ bản
  * Tạo type Video{ fields: kiểu dữ liệu} ở schema
  * Tại resolvers thêm 1 trường video: () => ({ các thuộc tính và giá trị của object đã tạo ở buổi 2})
  * query tạo 1 trường video { các thuộc tính cách nhau bởi dấu ,}
  