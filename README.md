# learning-ReactJS
# Buổi 1:
* Khởi tạo thư mục dự án:
  * Vào thư mục project chạy cmd: feathers generate app (đã cài đặt feathers ở global)
  * Xóa toàn bộ nội dung của file index.js tại src/
  * npm install graphql
# Buổi 2: Sử dụng các kiểu dữ liệu của GraphQL
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
# Buổi 4:
* Tạo list cho collections:
  * Khi có các document, ví dụ: 
  `const videoA = {
    id: () => '1',
    title: () => 'Barron',
    duration: () => 180,
    watched: () => true,
  }` ta có thể tạo một mảng các documents này `const videos = [videoA, videoB]`
  * Tại resolvers khởi tạo list bằng cách `videos: () => videos`
  * Tại query tạo videos{ các thuộc tính}
# Buổi 5: Sử dụng graphql như middleware trong express (feathers) 
* npm install express-graphql (Lưu ý: feathers-graphql hiện giờ báo lỗi -> sử dụng express-graphql)
    `const express = require('@feathersjs/express');
    const graphqlHTTP = require('express-graphql');`
    `const PORT = process.env.PORT || 3000
    const server = express();`
    `server.use('/graphql', graphqlHTTP({
        schema,
        graphiql: true,
        rootValue: resolvers,
    }));
    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    })`
# Buổi 6: Xây dựng GraphQl Schema 
* graphql hỗ trợ: `GraphQLID,
                  GraphQLBoolean,
                  GraphQLObjectType,
                  GraphQLString,
                  GraphQLInt,
                  GraphQLSchema`...
# Buổi 7: Sử dụng arguments để query
* Tạo 1 file index.js trong thư mục /src/data => Lưu dữ liệu và các helper funtions.
  * Tạo 1 helper function getVideoByID có tác dụng trả về document đầu tiên có id trùng với id được truyền vào.
* Tại file index.js của project import function vừa viết và truyền vào resolve.
# Buổi 8: Sử dụng GraphQLNonNull cho những giá trị bắt buộc
* Tại queryType (đây chính là nơi ta xử lí các câu truy vấn) hiện tại chỉ truy vấn theo id, khi chạy ứng dụng nếu ta ko nhập id vào thì sẽ trả về document là null vì không có giá trị để truy vấn, để người sử dụng có thể biết truyền vào giá trị nào, tại những vùng query bắt buộc phải truyền tham số vào, ta import GraphQLNonNull và sử dụng tại thuộc tính cần truyền vào trong arguments (args).
  * Ví dụ: `id:{
                    type: GraphQLID,
                    description: 'The Video ID.',
                },`
    => `id:{
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The Video ID.',
                },`