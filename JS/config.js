const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "emma";

//前台客製化路徑
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;

//後台客製化路徑
const adminApi = `${baseUrl}/api/livejs/v1/admin/${apiPath}`;
const token = "QXnvOqCYJ7afzlGmYhiG2HZBEOL2";
const headers ={ headers: {
    authorization: token,
  },}