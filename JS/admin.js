//客製化路徑
const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "emma";
const adminApi = `${baseUrl}/api/livejs/v1/admin/${apiPath}`;
const token = 'QXnvOqCYJ7afzlGmYhiG2HZBEOL2';

//建立變數
let orderData = [];
const orderPageTableBody = document.querySelector('.orderPage-table tbody');

function getOrder(){
    axios.get(`${adminApi}/orders`,{
        headers:{
            authorization:token
        }
    }).then((res) => {
        console.log(res)
        orderData = res.data.orders;
        renderOrder();
    }).catch(err =>{
        console.log(err)
    })
}

//渲染到畫面上
function renderOrder(){
   let str = '';
   orderData.forEach(order=>{
    let productStr = "";
    //訂單裡的數量也一樣跑fprEach，記得渲染到畫面上
    order.products.forEach((product) =>{
        productStr +=`<p>${product.title}</p> x ${product.quantity}`;
    })
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
            <td>${order.createdAt}</td>
            <td class="orderStatus">
              <a href="#">${order.paid ? "已處理" : "未處理"}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
          </tr>`
   })
   orderPageTableBody.innerHTML = str;
}



 getOrder()




// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});