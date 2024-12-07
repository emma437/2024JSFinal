//客製化路徑
const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "emma";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

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
  const addCartBtns = document.querySelectorAll(".addCardBtn");
  addCartBtns.forEach((item) => item.classList.add("disabled"));
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
      Toast.fire({
        icon: "success",
        title: "商品已成功加入購物車",
      });
      addCartBtns.forEach((item) => item.classList.remove("disabled"));

    })
    .catch((err) => {
      console.log(err);
    });
}

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(e.target);
  if (e.target.classList.contains("addCardBtn")) {
    console.log(e.target.dataset.id);
    addCart(e.target.dataset.id);
  }
});

//刪除所有購物車內容
const disCardAllBtn = document.querySelector(".discardAllBtn");

function deleteAllCart() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    //isConfirmed接著後續動作
    if (result.isConfirmed) {
      axios.delete(`${customerApi}/carts`).then((res) => {
        console.log(res);
        cartData = res.data.carts;
        renderCart();
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
  axios
    .delete(`${customerApi}/carts/${id}`)
    .then((res) => {
      // console.log(res);
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

//編輯產品數量 +-按鈕，可更改數量
function updateCart(id, qty) {
  //需要帶入data參數
  const data = {
    data: {
      id,
      quantity: qty,
    },
  };
  //寫入自己要帶的參數
  axios
    .patch(`${customerApi}/carts`, data)
    .then((res) => {
      // console.log(res);
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

//監聽
shoppingCartTableBody.addEventListener("click", (e) => {
  const id = e.target.closest("tr").getAttribute("data-id");
  e.preventDefault();
  //刪除單一購物車內容
  if (e.target.classList.contains("deleteBtn")) {
    deleteCart(id);
  }
  //新增數量
  if (e.target.classList.contains("plusBtn")) {
    let result = {};
    cartData.forEach((item) => {
      if (item.id === id) {
        result = item;
      }
    });
    let qty = result.quantity + 1;
    updateCart(id, qty);
  }
  //減少數量
  if (e.target.classList.contains("minusBtn")) {
    let result = {};
    cartData.forEach((item) => {
      if (item.id === id) {
        result = item;
      }
    });
    let qty = result.quantity - 1;
    updateCart(id, qty);
  }
  // console.log(e.target)
});

const orderInfoForm = document.querySelector(".orderInfo-form");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
//validate驗證表單
function checkForm() {
  const constraints = {
    姓名: {
      presence: { message: "^必填" },
    },
    電話: {
      presence: { message: "^必填" },
    },
    Email: {
      presence: { message: "^必填" },
      email: { message: "^請輸入正確的信箱格式" },
    },
    寄送地址: {
      presence: { message: "^必填" },
    },
  };
  const error = validate(orderInfoForm, constraints);
  console.log(error);
  return error;
}

function sendOrder() {
  if (cartData.length === 0) {
    alert("購物車不得為空");
    return;
  }
  if (checkForm()) {
    alert("表單必填項目務必填寫");
    return;
  }

  //post需帶入資料
  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");

  const data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value,
      },
    },
  };
  axios
    .post(`${customerApi}/orders`, data)
    .then((res) => {
      console.log(res);
      orderInfoForm.reset();
    })
    .catch((err) => {
      console.log("錯誤訊息：", err.response.data);
    });
}

//事件綁定
orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendOrder();
});

//初始化管理
function init() {
  getProduct();
  getCart();
}

init();
