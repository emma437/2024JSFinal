//客製化路徑
const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "emma";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;

let productsData = [];

function getProduct() {
  axios
    .get(`${customerApi}/products`)
    .then((res) => {
      //   console.log(res.data.products);
      productsData = res.data.products;
      //確認遠端資料拿到
      renderProducts(productsData);
    })
    .catch((err) => console.log(err));
}

const productWrap = document.querySelector(".productWrap");

//商品資訊渲染到畫面上
function renderProducts(data) {
  let str = "";
  data.forEach((item) => {
    str += ` <li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${item.images}"
            alt=""
          />
          <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
        </li>`;
  });
  productWrap.innerHTML = str;
}

//篩選產品
const productSelect = document.querySelector(".productSelect");

function filterProduct(value) {
  let filterResult = [];
  productsData.forEach((item) => {
    if (item.category === productSelect.value) {
      filterResult.push(item);
    }
    if (productSelect.value === "全部") {
      filterResult.push(item);
    }
  });
  renderProducts(filterResult);
}

productSelect.addEventListener("change", (e) => {
  filterProduct(e.target.value);
  // console.log(e.target.value);
});

//加入購物車
//post需要帶入文件(依照對方需求模式)
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  axios
    .post(`${customerApi}/carts`, data)
    .then((res) => {
      // console.log(res.data);
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e.target.dataset.id);
  addCart(e.target.dataset.id);
});

//刪除所有購物車內容
const disCardAllBtn = document.querySelector(".discardAllBtn");

function deleteAllCart() {
  axios.delete(`${customerApi}/carts`).then((res) => {
    console.log(res);
    cartData = res.data.carts;
    renderCart();
  });
}

disCardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log();
  deleteAllCart();
});

//渲染購物車
let cartData = [];

function getCart() {
  axios
    .get(`${customerApi}/carts`)
    .then((res) => {
      // console.log(res.data);
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const totalPriceElement = document.querySelector(".totalPrice");

function renderCart() {
  if (cartData.length === 0) {
    shoppingCartTableBody.innerHTML = "購物車沒有商品";
    //將購物車按鈕設為disable
    disCardAllBtn.classList.add("disabled");
    disCardAllBtn.style.pointerEvents = "none";
    //總金額設定為0
    totalPriceElement.textContent = "NT$0";

    return;
  }
  //有商品時確保按鈕可以點擊
  disCardAllBtn.classList.remove("disabled");
  disCardAllBtn.style.pointerEvents = "auto";

  let str = "";
  let totalPrice = 0;
  cartData.forEach((item) => {
    str += `
            <tr data-id="${item.id}">
              <td>
                <div class="cardItem-title">
                  <img src="${item.product.images}" alt="" />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.origin_price}</td>
              <td><button type="button" class="minusBtn">-</button>${item.quantity}<button type="button" class="plusBtn">+</button ></td>
              <td>NT$${item.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons deleteBtn"> clear </a>
              </td>
            </tr>
         `;
    totalPrice += item.product.price * item.quantity;
  });
  shoppingCartTableBody.innerHTML = str;

  //更新金額
  totalPriceElement.textContent = `NT$${totalPrice.toLocaleString()}`;
}

//刪除單一購物車選項(需要代入一個ID的值)
function deleteCart(id) {
  axios.delete(`${customerApi}/carts/${id}`).then((res) => {
    // console.log(res);
    cartData = res.data.carts;
    renderCart();
  }).catch((err) => {
    console.log(err);
  });
}

//編輯產品數量
function updateCart(id, qty) {
  //需要帶入data參數
  const data = {
    "data": {
      id,
      "quantity": qty
    }
  };
  //寫入自己要帶的參數
  axios.patch(`${customerApi}/carts`, data).then((res) => {
    // console.log(res);
    cartData = res.data.carts;
    renderCart();
  }).catch((err) => {
    console.log(err);
  });
}

shoppingCartTableBody.addEventListener("click", (e) => {
  const id =e.target.closest('tr').getAttribute('data-id')
  e.preventDefault();
  if (e.target.classList.contains("deleteBtn")) {
    deleteCart(id);
  }
  //新增數量
  if (e.target.classList.contains("plusBtn")) {
   let result = {};
    cartData.forEach(item =>{
    if(item.id === id){
      result = item;
    }
   })
   let qty = result.quantity + 1 ;
   updateCart(id, qty);
  }
//減少數量
  if (e.target.classList.contains("minusBtn")) {
    let result = {};
     cartData.forEach(item =>{
     if(item.id === id){
       result = item;
     }
    })
    let qty = result.quantity - 1 ;
    updateCart(id, qty);
   }
  // console.log(e.target)
});
//初始化管理
function init() {
  getProduct();
  getCart();
}

init();
