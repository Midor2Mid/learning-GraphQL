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