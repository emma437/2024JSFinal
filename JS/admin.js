//建立變數
let orderData = [];
const orderPageTableBody = document.querySelector(".orderPage-table tbody");
//取得訂單
function getOrder() {
  axios
    .get(`${adminApi}/orders`, headers)
    .then((res) => {
      console.log(res);
      orderData = res.data.orders;
      renderOrder();
    })
    .catch((err) => {
      console.log(err);
    });
}

//渲染到畫面上
function renderOrder() {
  let str = "";
  orderData.forEach((order) => {
    let productStr = "";
    //訂單裡的數量也一樣跑forEach，記得渲染到畫面上
    order.products.forEach((product) => {
      productStr += `<p>${product.title}</p> x ${product.quantity}`;
    });
    str += `<tr>
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
              <a href="#">${order.paid ? "已處理" : "未處理"}</a>
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

console.log(formatTime(1733292707));

getOrder();

// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
