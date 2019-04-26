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
* Tại queryType (đây là nơi xử lí truy vấn) hiện tại chỉ truy vấn theo id, khi chạy ứng dụng nếu ko nhập id vào thì sẽ trả về document là null vì không có giá trị để truy vấn, để người sử dụng có thể biết truyền vào giá trị nào, tại những vùng query bắt buộc phải truyền tham số vào, import GraphQLNonNull và sử dụng tại thuộc tính cần truyền vào trong arguments (args).
  * Ví dụ: `id:{
                    type: GraphQLID,
                    description: 'The Video ID.',
                },`
    => `id:{
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The Video ID.',
                },`
# Buổi 9: Sử dụng GraphQLList trả về danh sách
* Viết một function trả về danh sách các videos (Helpers)
* Tại index.js import GraphQLList
  * thêm fields trong queryType một trường videos, khai báo kiểu và function, ví dụ: `videos:{
            type: new GraphQLList(videoType),
            resolve: getVideos
        },`
# Buổi 10: Sử dụng mutation thêm document
* Tại helper viết hàm createVideo để tạo thêm video (push video vào mảng videos với các thông tin được truyền vào function)
* Tại index.js (program), tạo một mutationType cấu trúc tương tự như queryType và videoType.
  * Các type này có cấu trúc tương tự nhau: `const <tên> = new <kiểu dữ liệu GraphQL> ({
    name: <tên>,
    description: <mô tả>,
    fields:  { //có thể hiểu như đối số truyền vào
      <ý nghĩa hành động>: {
        type: <kiểu>,
        resolve: <function xử lí cho hành động>
      }
    }
  })`
# Buổi 11: Tạo input object type cho một mutation phức tạp
* Tại mutation của buổi 10, ta remove toàn bộ args thay bằng `video: {
                    type: new GraphQLNonNull(videoInputType),
                },`
* Sau đó tạo một `videoInputType = new GraphQLInputObjectType` với các fields là các thuộc tính của video (những args đã remove ở mutation).
  * Lưu ý: lúc này, thay vì `return createVideo(args)` phải đổi thành `return createVideo(args.video)`
# Buổi 12: Thêm interface vào schema GraphQL
# Buổi 13: Thêm relay node interface vào schema GraphQL
* npm i graphql-relay
# Buổi 14: Convert list thành relay connection
* Lấy kết quả cuối cùng của các objects trong connections: 
`{
  videos(last:1){
    edges{
      node{
        id, title,
        duration
      }
    }
  }
}`
* Đếm các objects trong connection: 
`{
  videos{
     totalCount
   }
}`
# Buổi 15: Sử dụng relay nhập object mutations
* Sử dụng mutation để tạo video.
`mutation AddVideoQuery($input: AddVideoInput!){
  createVideo(input: $input){
    video{
      title
    }
  }
}`
  * QUERY VARIABLES:
  `{
  "input": {
    "title": "Video Titles",
    "duration": 300,
    "watched": false,
    "clientMutationId": "abcd"
  }
  }`
* Sử dụng query trả về toàn bộ video trong db (db giả tạo trong index.js của data): 
`query AllVideosQuery{
  videos{
    edges{
      node{title}
    }
  }
}`

# Ghi chú: 
* GraphQL sẽ chia thành 3 phần chính:
  * Query: Các câu lệnh lấy dữ liệu (tương tự method GET trong RestFul API)
  * Mutation: Các câu lệnh để thêm/sửa dữ liệu (tuơng tự method POST/PUT/PATCH/DELETE trong RestFul API)
  * Subscription: Có chức năng kiểu như Emitter. Client nói với Server rằng “này khi nào có thêm dữ liệu mới thì báo cho tao nhé “. Vậy là Client đang lắng nghe server với sự kiện thêm document mới, do đó, mỗi khi có document mới được thêm vào thì Server sẽ gửi Data cho Client. Set up realtime connection via Websockets 
* Cấu trúc: 
`{
  query //Operation type: query, mutation, subscription
  {
    user // Operation "endpoint"
    {
      name //requested field
      age  //requested field
    }
  }
}`
* Resolvers (contain server-side logic)
* Type definition: 
  * Query definitions (like Routes)
  * Mutation definitions (like Routes)
  * Subscription definitions (like Routes)
* Resolvers (like Controllers)