const pool = require("../config/db");

async function updateImages() {
  const map = {
    1: "/images/burger_beef.jpg",
    2: "/images/fries_plain.jpg",
    3: "/images/soft_drink.jpg",
    4: "/images/burger_double.jpg",
    5: "/images/chicken_tenders.jpg",
    6: "/images/juice_orange.jpg",
  };

  for (const [id, img] of Object.entries(map)) {
    await pool.query("UPDATE products SET image = ? WHERE id = ?", [img, Number(id)]);
  }

  const [prods] = await pool.query("SELECT id, name, price, image FROM products");
  console.log("Products with verified images:", prods);
  await pool.end();
}

updateImages();
