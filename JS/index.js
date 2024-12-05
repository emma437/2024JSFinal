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

//渲染到畫面上
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
    .post(`${customerApi}/carts`,data)
    .then((res) => {
      console.log(res.data);
      cartData(res.data.carts);
      rederCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

productWrap.addEventListener('click',(e) =>{
  e.preventDefault();
  console.log(e.target.dataset.id);
  addCart(e.target.dataset.id);
});

//渲染購物車
let cartData = [];

function getCart() {
  axios
    .get(`${customerApi}/carts`)
    .then((res) => {
      // console.log(res.data);
      cartData = res.data.carts;
      rederCart();
    })
    .catch((err) => {
      console.log(err);
    });
}

const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);

function rederCart() {
  let str = "";
  cartData.forEach((item) => {
    str += `
            <tr>
              <td>
                <div class="cardItem-title">
                  <img src="${item.product.images}" alt="" />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.origin_price}</td>
              <td>${item.quantity}</td>
              <td>NT$${item.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons"> clear </a>
              </td>
            </tr>
         `;
  });
  shoppingCartTableBody.innerHTML = str;
}

//初始化管理
function init() {
  getProduct();
  getCart();
}

init();
