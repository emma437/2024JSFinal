//建立變數
let orderData = [];
const orderPageTableBody = document.querySelector(".orderPage-table tbody");
//取得訂單
function getOrder() {
  axios
    .get(`${adminApi}/orders`, headers)
    .then((res) => {
      //   console.log(res);
      orderData = res.data.orders;
      renderOrders();
      calcProductCategory();
    })
    .catch((err) => {
      console.log(err);
    });
}

//渲染到畫面上
function renderOrders() {
  let str = "";
  orderData.forEach((order) => {
    let productStr = "";
    //訂單裡的數量也一樣跑forEach，記得渲染到畫面上
    order.products.forEach((product) => {
      productStr += `<p>${product.title}</p> x ${product.quantity}`;
    });
    str += `<tr data-id ="${order.id}">
            <td>${order.id}</td>
            <td>
              <p>${order.user.name}</p>
              <p>${order.user.tel}</p>
            </td>
            <td>${order.user.address}</td>
            <td>${order.user.email}</td>
            <td>
             ${productStr}
            </td>
            <td>${formatTime(order.createdAt)}</td>
            <td class="orderStatus">
              <a href="#">${
                order.paid
                  ? `<span style="color:green">已處理</span>`
                  : `<span style="color:red">未處理</span>`
              }</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
          </tr>`;
  });
  orderPageTableBody.innerHTML = str;
}

//時間戳的格式化(取到毫秒的單位)
function formatTime(timestamp) {
  const time = new Date(timestamp * 1000);
  //月份從0開始所以要加1
  return `${time.getFullYear()}/${
    time.getMonth() + 1
  }/${time.getDate()} ${time.getHours()}:${String(time.getMinutes()).padStart(
    2,
    0
  )}:${time.getSeconds()}`;
}

//刪除全部購物車
const disCardAllBtn = document.querySelector(".discardAllBtn");

function deleteAllOrder() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${adminApi}/orders`, headers).then((res) => {
        // console.log(res);
        orderData = res.data.orders;
        renderOrders();
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

disCardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log();
  deleteAllOrder();
});

//刪除單筆訂單
function deleteOrder(id) {
  axios
    .delete(`${adminApi}/orders/${id}`, headers)
    .then((res) => {
      // console.log(res);
      orderData = res.data.orders;
      renderOrders();
    })
    .catch((err) => {
      console.log(err);
    });
}

//修改訂單狀態
function updateOrderStatus(id) {
  //使用 filter
  const filteredOrders = orderData.filter((order) => order.id === id);
  const result = filteredOrders.length > 0 ? filteredOrders[0] : null;
  // console.log(result.paid)
  const data = {
    data: {
      id: id,
      paid: !result.paid,
    },
  };
  axios
    .put(`${adminApi}/orders`, data, headers)
    .then((res) => {
      // console.log(res)
      orderData = res.data.orders;
      renderOrders();
    })
    .catch((err) => {
      console.log(err);
    });
}

//LV1  - 全產品類別營收比重
//組成資料
function calcProductCategory() {
  const resultObj = {};
  orderData.forEach((order) => {
    // console.log(order)
    order.products.forEach((product) => {
      if (resultObj[product.category] === undefined) {
        //初始值(一開始是空物件)
        resultObj[product.category] = product.price * product.quantity;
      }else{
        resultObj[product.category] += product.price * product.quantity;

      }
    });
  });
  renderChat(Object.entries(resultObj));
  
}

orderPageTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(e.target);
  const id = e.target.closest("tr").getAttribute("data-id");
  if (e.target.classList.contains("delSingleOrder-Btn")) {
    deleteOrder(id);
  }
  if (e.target.nodeName === "SPAN") {
    updateOrderStatus(id);
  }
});

//初始化
function init() {
  getOrder();
}

init();

// C3.js 渲染圖表
function renderChat(data) {
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    color: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"],
    },
    data: {
      type: "pie",
      columns: data,
      // colors: {
      //   "Louvre 雙人床架": "#DACBFF",
      //   "Antony 雙人床架": "#9D7FEA",
      //   "Anty 雙人床架": "#5434A7",
      //   其他: "#301E5F",
      // },
    },
  });
}
