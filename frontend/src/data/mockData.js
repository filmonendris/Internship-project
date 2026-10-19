// ─── Branches ───────────────────────────────────────────────────────────────
export const mockBranches = [
  {
    id: 1,
    name: 'Branch 1 — Bole',
    address: 'Bole Road, Addis Ababa',
    phone: '+251911634938',
    isActive: true,
  },
  {
    id: 2,
    name: 'Branch 2 — Kazanchis',
    address: 'Kazanchis, Addis Ababa',
    phone: '+251911875524',
    isActive: true,
  },
  {
    id: 3,
    name: 'Branch 3 — Piassa',
    address: 'Piassa, Addis Ababa',
    phone: '+251990222919',
    isActive: true,
  },
]

// ─── Categories ──────────────────────────────────────────────────────────────
export const mockCategories = [
  { id: 1,  name: 'All',                branchId: 1, order: 0,  isActive: true },
  { id: 2,  name: 'Burger',             branchId: 1, order: 1,  isActive: true },
  { id: 3,  name: 'Pizza',              branchId: 1, order: 2,  isActive: true },
  { id: 4,  name: 'Wraps & Sandwiches', branchId: 1, order: 3,  isActive: true },
  { id: 5,  name: 'Shawarma',           branchId: 1, order: 4,  isActive: true },
  { id: 6,  name: 'WOW Crispy',         branchId: 1, order: 5,  isActive: true },
  { id: 7,  name: 'Special Fries',      branchId: 1, order: 6,  isActive: true },
  { id: 8,  name: 'Salad',              branchId: 1, order: 7,  isActive: true },
  { id: 9,  name: 'Juices',             branchId: 1, order: 8,  isActive: true },
  { id: 10, name: 'Hot Drinks',         branchId: 1, order: 9,  isActive: true },
  { id: 11, name: 'Cold Drinks',        branchId: 1, order: 10, isActive: true },
  { id: 12, name: 'Fasting Burgers',    branchId: 1, order: 11, isActive: true },
  { id: 13, name: 'Extra',              branchId: 1, order: 12, isActive: true },
]

// ─── Products ────────────────────────────────────────────────────────────────
// ─── Products ────────────────────────────────────────────────────────────────
// All items mapped to valid images now.
export const mockProducts = [
  // BURGERS
  { id: 1,  name: 'Wow Special Burger',     description: 'Our signature burger with special WOW sauce, double beef patty, fresh vegetables and melted cheese.', price: 738.27, image: '/images/burger_double.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 2,  name: 'Wow Double Burger',      description: 'Double beef patty stacked high with lettuce, tomato, onion and our house sauce.', price: 668.70, image: '/images/burger_double.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 3,  name: 'Cheese Burger',          description: 'Juicy beef patty with melted cheddar cheese, fresh lettuce and tomato.', price: 520.87, image: '/images/burger_cheese.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 4,  name: 'Beef Burger',            description: 'Classic beef burger with fresh toppings and house sauce.', price: 433.92, image: '/images/burger_beef.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 5,  name: 'Chicken Special Burger', description: 'Crispy chicken fillet with special sauce, lettuce and pickles.', price: 738.27, image: '/images/burger_chicken.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 6,  name: 'Chicken Burger',         description: 'Tender grilled chicken with fresh vegetables and mayo.', price: 625.22, image: '/images/burger_chicken.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 7,  name: 'Cheesy Delight',         description: 'Extra cheese loaded burger for the cheese lovers.', price: 520.87, image: '/images/burger_cheese.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 8,  name: 'Beef Supreme',           description: 'Premium beef patty with supreme toppings and special sauce.', price: 460.00, image: '/images/burger_beef.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 9,  name: 'Mini Special Burger',    description: 'Smaller version of our special burger, perfect for a light meal.', price: 607.83, image: '/images/burger_mini.jpg', categoryId: 2, branchId: 1, isAvailable: true },
  { id: 10, name: 'Mini Burger',            description: 'Small classic burger, great as a snack or side.', price: 390.44, image: '/images/burger_mini.jpg', categoryId: 2, branchId: 1, isAvailable: true },

  // PIZZA
  { id: 11, name: 'Wow Special Pizza',       description: 'Our famous special pizza loaded with premium toppings.', price: 781.74, image: '/images/pizza_meat.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 12, name: 'Chicken Pizza',           description: 'Grilled chicken pieces on a rich tomato base with mozzarella.', price: 694.79, image: '/images/pizza2.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 13, name: 'Meat Lover/Beef Pizza',   description: 'Loaded with seasoned beef and premium meats.', price: 564.35, image: '/images/pizza_meat.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 14, name: 'Hawaiian Pizza',          description: 'Classic Hawaiian with ham and pineapple.', price: 564.35, image: '/images/pizza_hawaiian.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 15, name: 'Tuna Pizza',              description: 'Flaked tuna with onions and olives on tomato base.', price: 625.22, image: '/images/pizza1.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 16, name: 'Margarita Pizza',         description: 'Classic margarita with fresh tomato sauce and mozzarella.', price: 433.92, image: '/images/pizza_margherita.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 17, name: 'Pazzala Pizza',           description: 'Unique WOW specialty pizza with a blend of flavors.', price: 564.35, image: '/images/pizza_meat.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 18, name: 'Chicken Pesto Pizza',     description: 'Grilled chicken with fresh basil pesto and mozzarella.', price: 564.35, image: '/images/pizza2.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 19, name: 'Vegetable Pizza',         description: 'Fresh seasonal vegetables on a classic tomato base.', price: 433.92, image: '/images/pizza_veggie.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 20, name: 'Fasting Tuna Pizza',      description: 'Tuna pizza prepared for fasting — no dairy.', price: 546.96, image: '/images/pizza1.jpg', categoryId: 3, branchId: 1, isAvailable: true },
  { id: 21, name: 'Wow Fasting Special Pizza', description: 'Our special pizza adapted for fasting days.', price: 607.83, image: '/images/pizza_veggie.jpg', categoryId: 3, branchId: 1, isAvailable: true },

  // WRAPS & SANDWICHES
  { id: 22, name: 'Chicken Wrap Big',      description: 'Large chicken wrap with fresh vegetables, sauce and cheese.', price: 868.70, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 23, name: 'Chicken Wrap Medium',   description: 'Medium chicken wrap with crisp lettuce and special sauce.', price: 651.31, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 24, name: 'Tuna Wrap Big',         description: 'Large tuna wrap with fresh salad and creamy sauce.', price: 738.27, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 25, name: 'Tuna Wrap Medium',      description: 'Medium tuna wrap, light and delicious.', price: 607.83, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 26, name: 'Fish Wrap',             description: 'Crispy fish fillet wrapped with fresh greens and tartar sauce.', price: 503.48, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 27, name: 'Vegetable Wrap',        description: 'Fresh seasonal vegetables wrapped with hummus and herbs.', price: 477.40, image: '/images/wrap_veggie.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 28, name: 'Chicken Zinger',        description: 'Spicy crispy chicken in a toasted bun with coleslaw.', price: 607.83, image: '/images/burger_chicken.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 29, name: 'Chicken Sandwich',      description: 'Grilled chicken sandwich with lettuce and mayo.', price: 520.87, image: '/images/sandwich.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 30, name: 'Tuna Sandwich',         description: 'Tuna salad sandwich on toasted bread.', price: 503.48, image: '/images/sandwich.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 31, name: 'Fish Sandwich',         description: 'Crispy fish fillet sandwich with tartar sauce.', price: 433.92, image: '/images/sandwich.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 32, name: 'Ham & Cheese Sandwich', description: 'Toasted ham and cheese sandwich.', price: 407.83, image: '/images/sandwich_ham.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 33, name: 'Egg Sandwich',          description: 'Fried egg sandwich with fresh vegetables.', price: 346.96, image: '/images/sandwich_egg.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 34, name: 'Cheese Sandwich',       description: 'Grilled cheese sandwich on toasted bread.', price: 346.96, image: '/images/sandwich_grilled_cheese.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 35, name: 'Vegetable Sandwich',    description: 'Fresh vegetable sandwich with hummus.', price: 346.96, image: '/images/sandwich.jpg', categoryId: 4, branchId: 1, isAvailable: true },
  { id: 36, name: 'Toasted Twister',       description: 'Toasted chicken twister with crispy lettuce.', price: 520.87, image: '/images/wrap1.jpg', categoryId: 4, branchId: 1, isAvailable: true },

  // SHAWARMA
  { id: 37, name: 'Normal Shawarma',  description: 'Classic chicken shawarma with garlic sauce and pickles.', price: 477.40, image: '/images/shawarma.jpg', categoryId: 5, branchId: 1, isAvailable: true },
  { id: 38, name: 'Special Shawarma', description: 'Loaded shawarma with extra toppings and special WOW sauce.', price: 694.79, image: '/images/shawarma.jpg', categoryId: 5, branchId: 1, isAvailable: true },

  // WOW CRISPY
  { id: 39, name: 'Chicken Tender (4 Pcs)',         description: '4 pieces of crispy golden chicken tenders with dipping sauce.', price: 607.83, image: '/images/chicken_tenders.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 40, name: 'Chicken Tender (6 Pcs)',         description: '6 pieces of crispy golden chicken tenders with dipping sauce.', price: 694.79, image: '/images/chicken_tenders.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 41, name: 'Chicken Hot Full Wings (3 Pcs)', description: '3 pieces of spicy hot wings, crispy and juicy.', price: 607.83, image: '/images/chicken_wings.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 42, name: 'Chicken Normal Wings (4 Pcs)',   description: '4 pieces of classic crispy chicken wings.', price: 599.14, image: '/images/chicken_wings.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 43, name: 'Chicken Normal Wings (6 Pcs)',   description: '6 pieces of classic crispy chicken wings.', price: 694.79, image: '/images/chicken_wings.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 44, name: 'BBQ Chicken Wing',               description: 'Smoky BBQ glazed chicken wings, finger-licking good.', price: 599.14, image: '/images/chicken_wings.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 45, name: 'Chicken Broast (2 Pcs)',         description: '2 pieces of pressure-fried broast chicken.', price: 520.20, image: '/images/chicken1.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 46, name: 'Chicken Broast (3 Pcs)',         description: '3 pieces of pressure-fried broast chicken.', price: 651.31, image: '/images/chicken1.jpg', categoryId: 6, branchId: 1, isAvailable: true },
  { id: 47, name: 'Chicken With Cheese',            description: 'Crispy chicken pieces topped with melted cheese.', price: 686.09, image: '/images/chicken1.jpg', categoryId: 6, branchId: 1, isAvailable: true },

  // SPECIAL FRIES
  { id: 48, name: 'French Fries',                description: 'Classic golden crispy french fries.', price: 346.96, image: '/images/fries_plain.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 49, name: 'Cheesy Fries Big',            description: 'Large portion of fries loaded with melted cheese sauce.', price: 346.96, image: '/images/fries_loaded.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 50, name: 'Cheesy Fries Small',          description: 'Small portion of fries with melted cheese sauce.', price: 173.05, image: '/images/fries_loaded.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 51, name: 'Chili Fries Big',             description: 'Large spicy chili-topped crispy fries.', price: 346.96, image: '/images/fries_chili.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 52, name: 'Chili Fries Small',           description: 'Small spicy chili-topped crispy fries.', price: 173.05, image: '/images/fries_chili.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 53, name: 'Chicken Loaded Fries Big',    description: 'Large fries loaded with seasoned chicken, cheese and sauce.', price: 433.92, image: '/images/fries_loaded.jpg', categoryId: 7, branchId: 1, isAvailable: true },
  { id: 54, name: 'Chicken Loaded Fries Small',  description: 'Small fries loaded with seasoned chicken and sauce.', price: 216.53, image: '/images/fries_loaded.jpg', categoryId: 7, branchId: 1, isAvailable: true },

  // SALAD
  { id: 55, name: 'Mixed Salad',            description: 'Fresh mixed greens with house dressing.', price: 513.05, image: '/images/salad.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 56, name: 'Beef Sesame Salad',      description: 'Sliced beef with sesame dressing and fresh greens.', price: 643.48, image: '/images/salad_grilled_veg.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 57, name: 'Tuna Salad',             description: 'Flaked tuna over fresh greens with lemon dressing.', price: 686.96, image: '/images/salad_tuna.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 58, name: 'Chicken Keto Salad',     description: 'Grilled chicken with keto-friendly vegetables.', price: 686.96, image: '/images/salad_chicken.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 59, name: 'Pumpkin Avocado Salad',  description: 'Roasted pumpkin and creamy avocado salad.', price: 513.05, image: '/images/salad_grilled_veg.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 60, name: 'Mediterranean Salad',   description: 'Classic Mediterranean salad with olives, feta and tomatoes.', price: 513.05, image: '/images/salad_mediterranean.jpg', categoryId: 8, branchId: 1, isAvailable: true },
  { id: 61, name: 'Grill Veg. Salad',      description: 'Grilled seasonal vegetables on a bed of fresh greens.', price: 513.05, image: '/images/salad_grilled_veg.jpg', categoryId: 8, branchId: 1, isAvailable: true },

  // JUICES & SMOOTHIES
  { id: 62, name: 'Wow Special Smoothie', description: 'Our signature mixed fruit smoothie blend.', price: 260.00, image: '/images/smoothie.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 63, name: 'Creamy Avocado',       description: 'Rich and creamy avocado smoothie.', price: 321.74, image: '/images/smoothie_avocado.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 64, name: 'Creamy Mango',         description: 'Smooth and creamy mango smoothie.', price: 339.14, image: '/images/smoothie_mango.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 65, name: 'Creamy Papaya',        description: 'Fresh papaya blended to a creamy smoothie.', price: 321.74, image: '/images/smoothie_papaya.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 66, name: 'Mocha',               description: 'Rich mocha smoothie with coffee and chocolate.', price: 242.61, image: '/images/mocha.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 67, name: 'Mixed',               description: 'Seasonal mixed fruit juice.', price: 242.61, image: '/images/juice_orange.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 68, name: 'Coffee Banana',       description: 'Coffee and banana blended together.', price: 242.61, image: '/images/mocha.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 69, name: 'Shakes',              description: 'Classic milkshake in various flavors.', price: 242.61, image: '/images/milkshake.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 70, name: 'Milk Shake',          description: 'Thick and creamy milkshake.', price: 242.61, image: '/images/milkshake.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 71, name: 'Seasonal Juices',     description: 'Fresh-squeezed seasonal fruit juice.', price: 242.61, image: '/images/juice_orange.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 72, name: 'Gym Protein',         description: 'High-protein smoothie for gym enthusiasts.', price: 339.14, image: '/images/protein_shake.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 73, name: 'Gym Protein Fasting', description: 'Fasting-friendly high-protein smoothie.', price: 326.00, image: '/images/protein_shake.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 74, name: 'Pain Relief',         description: 'Special herbal smoothie blend for recovery.', price: 278.27, image: '/images/smoothie_green.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 75, name: 'Kidney Flash',        description: 'Detox smoothie blend to support kidney health.', price: 278.27, image: '/images/smoothie_green.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 76, name: 'Super Special 1',     description: 'Our super special blend #1.', price: 339.14, image: '/images/smoothie.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 77, name: 'Super Special 2',     description: 'Our super special blend #2.', price: 339.14, image: '/images/smoothie.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 78, name: 'Super Special 3',     description: 'Our super special blend #3.', price: 339.14, image: '/images/smoothie.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 79, name: 'Delux/ዴሉክስ',         description: 'Premium deluxe smoothie blend.', price: 694.79, image: '/images/smoothie.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 80, name: 'For Ladies',          description: 'Special smoothie blend designed for ladies.', price: 278.27, image: '/images/smoothie_green.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 81, name: 'For Men',             description: 'Special smoothie blend designed for men.', price: 278.27, image: '/images/smoothie_green.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 82, name: 'Banana Flax',         description: 'Banana and flaxseed healthy smoothie.', price: 275.27, image: '/images/smoothie_mango.jpg', categoryId: 9, branchId: 1, isAvailable: true },
  { id: 83, name: 'Multi Vitamin',       description: 'Vitamin-rich multi-fruit smoothie.', price: 321.74, image: '/images/juice_orange.jpg', categoryId: 9, branchId: 1, isAvailable: true },

  // HOT DRINKS
  { id: 84, name: 'Tea',                description: 'Classic hot tea.', price: 60.00,  image: '/images/tea.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 85, name: 'Coffee',             description: 'Fresh brewed Ethiopian coffee.', price: 112.18, image: '/images/coffee.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 86, name: 'Macchiato',          description: 'Ethiopian-style macchiato.', price: 112.18, image: '/images/coffee.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 87, name: 'Cafe Latte/Milk',    description: 'Smooth cafe latte with steamed milk.', price: 164.35, image: '/images/latte.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 88, name: 'Fasting Macchiato', description: 'Dairy-free macchiato for fasting days.', price: 173.05, image: '/images/coffee.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 89, name: 'Cappuccino',         description: 'Classic Italian cappuccino.', price: 173.05, image: '/images/cappuccino.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 90, name: 'Flavored Tea',       description: 'Aromatic flavored herbal tea.', price: 112.18, image: '/images/tea.jpg', categoryId: 10, branchId: 1, isAvailable: true },
  { id: 91, name: 'Special Tea',        description: 'Our special blend of premium tea.', price: 216.53, image: '/images/tea.jpg', categoryId: 10, branchId: 1, isAvailable: true },

  // COLD DRINKS
  { id: 92, name: 'Soft Drink (300ml)', description: 'Chilled soft drink, 300ml.', price: 68.70,  image: '/images/soft_drink.jpg', categoryId: 11, branchId: 1, isAvailable: true },
  { id: 93, name: 'Soft Drink (500ml)', description: 'Chilled soft drink, 500ml.', price: 86.09,  image: '/images/soft_drink.jpg', categoryId: 11, branchId: 1, isAvailable: true },
  { id: 94, name: 'Water (500ml)',      description: 'Fresh bottled water, 500ml.', price: 51.31,  image: '/images/water_bottle.jpg', categoryId: 11, branchId: 1, isAvailable: true },

  // FASTING BURGERS
  { id: 95, name: 'Red Bean Burger', description: 'Hearty red bean patty burger, fully fasting-friendly.', price: 390.44, image: '/images/burger_vegan.jpg', categoryId: 12, branchId: 1, isAvailable: true },
  { id: 96, name: 'Vegan Burger',     description: 'Plant-based burger with fresh vegetables.', price: 346.96, image: '/images/burger_vegan.jpg', categoryId: 12, branchId: 1, isAvailable: true },

  // EXTRA
  { id: 97,  name: 'Ketchup',                  description: 'Side serving of ketchup.', price: 77.40,  image: '/images/ketchup.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 98,  name: 'Mayonnaise',               description: 'Side serving of mayonnaise.', price: 77.40,  image: '/images/sauce.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 99,  name: 'Takeaway Box',             description: 'Takeaway packaging box.', price: 25.22, image: '/images/takeaway_box.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 100, name: 'Slice of Cheese',          description: 'Extra slice of cheese.', price: 77.40, image: '/images/cheese_slice.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 101, name: 'Extra Pizza Tuna/Chicken', description: 'Extra tuna or chicken topping for pizza.', price: 173.05, image: '/images/pizza2.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 102, name: 'Pizza Takeaway Box',       description: 'Takeaway box for pizza.', price: 42.61,  image: '/images/takeaway_box.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 103, name: 'Extra Cheese For Pizza',   description: 'Extra cheese topping for pizza.', price: 173.05, image: '/images/cheese_slice.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 104, name: 'Juice Takeaway Cup',       description: 'Takeaway cup for juice.', price: 25.22,  image: '/images/takeaway_cup.jpg', categoryId: 13, branchId: 1, isAvailable: true },
  { id: 105, name: 'Hot Drinks Takeaway Cup',  description: 'Takeaway cup for hot drinks.', price: 25.22, image: '/images/takeaway_cup.jpg', categoryId: 13, branchId: 1, isAvailable: true },
]

// ─── Users ───────────────────────────────────────────────────────────────────
export const mockUsers = [
  { id: 1, name: 'Super Admin', email: 'superadmin@wowburger.com', role: 'superadmin', branchId: null,  isActive: true },
  { id: 2, name: 'Bole Manager',      email: 'bole@wowburger.com',       role: 'admin',      branchId: 1,    isActive: true },
  { id: 3, name: 'Kazanchis Manager', email: 'kazanchis@wowburger.com',  role: 'admin',      branchId: 2,    isActive: true },
]

// ─── Orders ──────────────────────────────────────────────────────────────────
export const mockOrders = [
  {
    id: 1001,
    branchId: 1,
    customerName: 'Abebe Bekele',
    phone: '+251911000001',
    type: 'dine-in',
    tableNumber: '5',
    items: [
      { productId: 1, productName: 'Wow Special Burger', price: 738.27, quantity: 2 },
      { productId: 48, productName: 'French Fries', price: 346.96, quantity: 1 },
    ],
    subtotal: 1823.50,
    vatAmount: 273.53,
    total: 2097.03,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 1002,
    branchId: 1,
    customerName: 'Tigist Haile',
    phone: '+251911000002',
    type: 'takeaway',
    tableNumber: null,
    items: [
      { productId: 11, productName: 'Wow Special Pizza', price: 781.74, quantity: 1 },
      { productId: 92, productName: 'Soft Drink (300ml)', price: 68.70, quantity: 2 },
    ],
    subtotal: 919.14,
    vatAmount: 137.87,
    total: 1057.01,
    status: 'preparing',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
]
