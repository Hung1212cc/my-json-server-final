class Product {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
  }
  render() {
    return `
      <div class="product">
        <img src="${this.image}" alt="${this.name}">
        <h3>${this.name}</h3>
        <p>${this.price.toLocaleString()}₫</p>
      </div>
    `;
  }
}
class ProductList {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.products = [];
  }
  loadProducts() {
    fetch(this.dataUrl)
      .then(response => {
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm!");
        return response.json();
      })
      .then(data => {
        this.products = data.map(
          p => new Product(p.id, p.name, p.price, p.image)
        );
        this.render();
        this.initSearch();
      })
      .catch(error => {
        console.error("Lỗi:", error);
        this.container.innerHTML = "<p>Không thể tải danh sách sản phẩm!</p>";
      });
  }
  render(products = this.products) {
    this.container.innerHTML = products.map(p => p.render()).join("");
  }
  initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.querySelector(".search button");
  if (!searchInput || !searchBtn) return;
  const doSearch = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(keyword)
    );
    this.render(filtered);
  };
  searchInput.addEventListener("input", doSearch);
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    doSearch();
  });
}
}
document.addEventListener("DOMContentLoaded", () => {
  const productList = new ProductList("product-list", "http://localhost:3001/products");
  productList.loadProducts();
});
