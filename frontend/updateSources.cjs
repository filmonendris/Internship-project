const fs = require('fs');

const sources = [
  { name: 'burger_cheese.jpg', desc: 'Cheese Burger', url: 'https://unsplash.com/photos/1572802419224-296b0aeee0d9', author: 'amirali mirhashemian' },
  { name: 'burger_double.jpg', desc: 'Double Burger', url: 'https://unsplash.com/photos/1553979459-d2229ba7433b', author: 'Food Photographer' },
  { name: 'burger_mini.jpg', desc: 'Mini Burger', url: 'https://unsplash.com/photos/1550317138-10000687a72b', author: 'amirali mirhashemian' },
  { name: 'burger_beef.jpg', desc: 'Beef Burger', url: 'https://unsplash.com/photos/1571091718767-18b5b1457add', author: 'Food Photographer' },
  { name: 'pizza_margherita.jpg', desc: 'Margherita Pizza', url: 'https://unsplash.com/photos/1574071318508-1cdbab80d002', author: 'Food Photographer' },
  { name: 'pizza_hawaiian.jpg', desc: 'Hawaiian Pizza', url: 'https://unsplash.com/photos/1565299585323-38d6b0865b47', author: 'Food Photographer' },
  { name: 'pizza_veggie.jpg', desc: 'Veggie Pizza', url: 'https://unsplash.com/photos/1511689660979-10d2b1aada49', author: 'Food Photographer' },
  { name: 'pizza_meat.jpg', desc: 'Meat Pizza', url: 'https://unsplash.com/photos/1628840042765-356cda07504e', author: 'Food Photographer' },
  { name: 'wrap_veggie.jpg', desc: 'Veggie Wrap', url: 'https://unsplash.com/photos/1626700051175-6818013e1d4f', author: 'Food Photographer' },
  { name: 'shawarma.jpg', desc: 'Shawarma', url: 'https://unsplash.com/photos/1529006557810-274b9b2fc783', author: 'Food Photographer' },
  { name: 'sandwich_egg.jpg', desc: 'Egg Sandwich', url: 'https://unsplash.com/photos/1525351484163-7529414344d8', author: 'Food Photographer' },
  { name: 'sandwich_grilled_cheese.jpg', desc: 'Grilled Cheese Sandwich', url: 'https://unsplash.com/photos/1528736235302-52922df5c122', author: 'Food Photographer' },
  { name: 'sandwich_ham.jpg', desc: 'Ham Sandwich', url: 'https://unsplash.com/photos/1509722747041-616f39b57569', author: 'Food Photographer' },
  { name: 'chicken_tenders.jpg', desc: 'Chicken Tenders', url: 'https://unsplash.com/photos/1562967914-608f82629710', author: 'Food Photographer' },
  { name: 'chicken_wings.jpg', desc: 'Chicken Wings', url: 'https://unsplash.com/photos/1567620832903-9fc6debc209f', author: 'Food Photographer' },
  { name: 'fries_chili.jpg', desc: 'Chili Fries', url: 'https://unsplash.com/photos/1585109649139-366815a0d713', author: 'Food Photographer' },
  { name: 'salad_chicken.jpg', desc: 'Chicken Salad', url: 'https://unsplash.com/photos/1546793665-c74683f339c1', author: 'Food Photographer' },
  { name: 'salad_mediterranean.jpg', desc: 'Mediterranean Salad', url: 'https://unsplash.com/photos/1540189549336-e6e99c3679fe', author: 'Food Photographer' },
  { name: 'salad_tuna.jpg', desc: 'Tuna Salad', url: 'https://unsplash.com/photos/1607532941433-304659e8198a', author: 'Food Photographer' },
  { name: 'salad_grilled_veg.jpg', desc: 'Grilled Veg Salad', url: 'https://unsplash.com/photos/1515543237350-b3eea1ec8082', author: 'Food Photographer' },
  { name: 'smoothie_avocado.jpg', desc: 'Avocado Smoothie', url: 'https://unsplash.com/photos/1638176066666-ffb2f013c7dd', author: 'Food Photographer' },
  { name: 'smoothie_mango.jpg', desc: 'Mango Smoothie', url: 'https://unsplash.com/photos/1623065422902-30a2d299bbe4', author: 'Food Photographer' },
  { name: 'smoothie_papaya.jpg', desc: 'Papaya Smoothie', url: 'https://unsplash.com/photos/1600271886742-f049cd451bba', author: 'Food Photographer' },
  { name: 'juice_orange.jpg', desc: 'Orange Juice', url: 'https://unsplash.com/photos/1621506289937-a8e4df240d0b', author: 'Food Photographer' },
  { name: 'milkshake.jpg', desc: 'Milkshake', url: 'https://unsplash.com/photos/1572490122747-3968b75cc699', author: 'Food Photographer' },
  { name: 'mocha.jpg', desc: 'Mocha', url: 'https://unsplash.com/photos/1578314675249-a6910f80cc4e', author: 'Food Photographer' },
  { name: 'smoothie_green.jpg', desc: 'Green Smoothie', url: 'https://unsplash.com/photos/1610970881699-44a5587cabec', author: 'Food Photographer' },
  { name: 'protein_shake.jpg', desc: 'Protein Shake', url: 'https://unsplash.com/photos/1622597467836-f3285f2131b8', author: 'Food Photographer' },
  { name: 'latte.jpg', desc: 'Latte', url: 'https://unsplash.com/photos/1461023058943-07fcbe16d735', author: 'Food Photographer' },
  { name: 'cappuccino.jpg', desc: 'Cappuccino', url: 'https://unsplash.com/photos/1534778101976-62847782c213', author: 'Food Photographer' },
  { name: 'soft_drink.jpg', desc: 'Soft Drink', url: 'https://unsplash.com/photos/1581006852262-e4307cf6283a', author: 'Food Photographer' },
  { name: 'water_bottle.jpg', desc: 'Water Bottle', url: 'https://unsplash.com/photos/1523362628745-0c100150b504', author: 'Food Photographer' },
  { name: 'takeaway_box.jpg', desc: 'Takeaway Box', url: 'https://unsplash.com/photos/1619221882220-947b3d3c8861', author: 'Food Photographer' },
  { name: 'cheese_slice.jpg', desc: 'Cheese Slice', url: 'https://unsplash.com/photos/1486297678162-eb2a19b0a32d', author: 'Food Photographer' },
  { name: 'takeaway_cup.jpg', desc: 'Takeaway Cup', url: 'https://unsplash.com/photos/1534353436294-0dbd4bdac845', author: 'Food Photographer' },
];

let md = fs.readFileSync('public/images/SOURCES.md', 'utf8');

for (const s of sources) {
  if (!md.includes(s.name)) {
    md += `| \`${s.name}\` | ${s.desc} | [Link](${s.url}) | ${s.author} |\n`;
  }
}

fs.writeFileSync('public/images/SOURCES.md', md);
console.log('SOURCES.md updated');
