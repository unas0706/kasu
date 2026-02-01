export const categories = [
  {
    id: 1,
    name: "Premium Popcorn",
    icon: "fa-popcorn",
    description: "Freshly popped popcorn with gourmet flavors",
    image:
      "https://images.unsplash.com/photo-1570136608986-8de0b433d0a5?auto=format&fit=crop&w=500",
  },
  {
    id: 2,
    name: "Signature Drinks",
    icon: "fa-glass-whiskey",
    description: "Crafted beverages & mocktails",
    image:
      "https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=500",
  },
  {
    id: 3,
    name: "Gourmet Snacks",
    icon: "fa-utensils",
    description: "Artisanal snacks & finger foods",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500",
  },
  {
    id: 4,
    name: "Value Combos",
    icon: "fa-gift",
    description: "Curated meal experiences",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=500",
  },
  {
    id: 5,
    name: "Desserts",
    icon: "fa-ice-cream",
    description: "Sweet treats & indulgence",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500",
  },
  {
    id: 6,
    name: "Coffee Bar",
    icon: "fa-mug-hot",
    description: "Premium coffee & hot beverages",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500",
  },
];

export const menuItems = {
  1: [
    {
      id: 101,
      name: "Truffle Butter Popcorn",
      price: 12.99,
      description: "Gourmet popcorn with black truffle butter and parmesan",
      icon: "fa-popcorn",
      badge: "Chef's Special",
      image:
        "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=500",
    },
    {
      id: 102,
      name: "Caramel Almond Crunch",
      price: 10.99,
      description: "Caramel coated popcorn with roasted almonds",
      icon: "fa-candy-cane",
      badge: "Best Seller",
    },
    {
      id: 103,
      name: "Spicy Cheesy Delight",
      price: 11.99,
      description: "Aged cheddar with jalapeño kick",
      icon: "fa-cheese",
      badge: "Spicy",
    },
    {
      id: 104,
      name: "Sweet & Savory Mix",
      price: 13.99,
      description: "Perfect blend of caramel and cheese popcorn",
      icon: "fa-bowl-food",
    },
  ],
  2: [
    {
      id: 201,
      name: "Berry Mojito",
      price: 6.99,
      description: "Fresh berries with mint and lime",
      icon: "fa-glass-martini-alt",
      badge: "Refreshing",
    },
    {
      id: 202,
      name: "Sparkling Lemonade",
      price: 5.99,
      description: "House-made sparkling lemonade",
      icon: "fa-glass-whiskey",
    },
    {
      id: 203,
      name: "Crafted Iced Tea",
      price: 5.49,
      description: "Artisanal blend with peach notes",
      icon: "fa-glass-water",
      badge: "Organic",
    },
    {
      id: 204,
      name: "Virgin Mojito",
      price: 6.49,
      description: "Classic mint and lime refresher",
      icon: "fa-glass-whiskey-soda",
    },
  ],
  3: [
    {
      id: 301,
      name: "Truffle Nachos",
      price: 9.99,
      description: "Crispy tortilla chips with truffle cheese sauce",
      icon: "fa-utensils",
      badge: "Premium",
    },
    {
      id: 302,
      name: "Artisan Pretzels",
      price: 8.99,
      description: "Soft pretzel bites with beer cheese dip",
      icon: "fa-bread-slice",
    },
    {
      id: 303,
      name: "Crispy Chicken Bites",
      price: 10.99,
      description: "Buttermilk fried chicken with honey mustard",
      icon: "fa-drumstick-bite",
      badge: "Hot",
    },
    {
      id: 304,
      name: "Loaded Fries",
      price: 8.49,
      description: "Crispy fries with cheese, bacon, and chives",
      icon: "fa-bacon",
    },
  ],
  4: [
    {
      id: 401,
      name: "Movie Night Combo",
      price: 24.99,
      description: "2 popcorns + 4 drinks + nachos",
      icon: "fa-users",
      badge: "Family Favorite",
    },
    {
      id: 402,
      name: "Date Night Package",
      price: 18.99,
      description: "Popcorn + 2 drinks + dessert",
      icon: "fa-heart",
      badge: "Romantic",
    },
    {
      id: 403,
      name: "Solo Indulgence",
      price: 14.99,
      description: "Popcorn + drink + snack",
      icon: "fa-user",
      badge: "Value",
    },
    {
      id: 404,
      name: "Ultimate Feast",
      price: 34.99,
      description: "Everything for the true movie lover",
      icon: "fa-crown",
      badge: "Premium",
    },
  ],
  5: [
    {
      id: 501,
      name: "Chocolate Lava Cake",
      price: 7.99,
      description: "Warm chocolate cake with molten center",
      icon: "fa-cookie-bite",
      badge: "Hot",
    },
    {
      id: 502,
      name: "Berry Cheesecake",
      price: 6.99,
      description: "New York style with berry compote",
      icon: "fa-cheese",
    },
    {
      id: 503,
      name: "Ice Cream Sundae",
      price: 5.99,
      description: "Vanilla ice cream with hot fudge and nuts",
      icon: "fa-ice-cream",
    },
  ],
  6: [
    {
      id: 601,
      name: "Caramel Macchiato",
      price: 4.99,
      description: "Espresso with caramel and steamed milk",
      icon: "fa-mug-hot",
      badge: "Signature",
    },
    {
      id: 602,
      name: "Hot Chocolate Supreme",
      price: 5.49,
      description: "Rich Belgian chocolate with whipped cream",
      icon: "fa-mug-hot",
    },
    {
      id: 603,
      name: "Chai Latte",
      price: 4.49,
      description: "Spiced tea with steamed milk",
      icon: "fa-mug-hot",
    },
  ],
};

// const presentTime = new Date().toLocaleTimeString([], {
//   hour: "2-digit",
//   minute: "2-digit",
// });

// export const screens = [
//   {
//     id: 1,
//     name: "Screen 1",
//     type: "Dolby Atmos",
//     time: presentTime,
//   },
//   { id: 2, name: "Screen 2", type: "Dolby Atmos", time: presentTime },
//   { id: 3, name: "Screen 3", type: "Dolby Atmos", time: presentTime },
// ];

// export const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
// export const seatsPerRow = 12;

// src/data/data.js
const presentTime = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

// Enhanced Screen Configuration with dynamic seat layouts
export const screens = [
  {
    id: 1,
    name: "Screen 1",
    type: "Dolby Atmos",
    time: presentTime,
    seatLayout: {
      rows: [
        { letter: "A", seats: 20, type: "premium", priceMultiplier: 1.5 },
        { letter: "B", seats: 20, type: "premium", priceMultiplier: 1.5 },
        { letter: "C", seats: 18, type: "standard", priceMultiplier: 1.0 },
        { letter: "D", seats: 18, type: "standard", priceMultiplier: 1.0 },
        { letter: "E", seats: 16, type: "standard", priceMultiplier: 1.0 },
        { letter: "F", seats: 16, type: "standard", priceMultiplier: 1.0 },
        { letter: "G", seats: 14, type: "economy", priceMultiplier: 0.9 },
        { letter: "H", seats: 14, type: "economy", priceMultiplier: 0.9 },
      ],
    },
  },
  {
    id: 2,
    name: "Screen 2",
    type: "IMAX",
    time: presentTime,
    seatLayout: {
      rows: [
        { letter: "A", seats: 22, type: "premium", priceMultiplier: 1.8 },
        { letter: "B", seats: 22, type: "premium", priceMultiplier: 1.8 },
        { letter: "C", seats: 20, type: "premium", priceMultiplier: 1.5 },
        { letter: "D", seats: 20, type: "premium", priceMultiplier: 1.5 },
        { letter: "E", seats: 18, type: "standard", priceMultiplier: 1.0 },
        { letter: "F", seats: 18, type: "standard", priceMultiplier: 1.0 },
        { letter: "G", seats: 16, type: "standard", priceMultiplier: 1.0 },
        { letter: "H", seats: 16, type: "standard", priceMultiplier: 1.0 },
      ],
    },
  },
  {
    id: 3,
    name: "Screen 3",
    type: "4DX",
    time: presentTime,
    seatLayout: {
      rows: [
        { letter: "A", seats: 16, type: "vip", priceMultiplier: 2.0 },
        { letter: "B", seats: 16, type: "vip", priceMultiplier: 2.0 },
        { letter: "C", seats: 14, type: "premium", priceMultiplier: 1.5 },
        { letter: "D", seats: 14, type: "premium", priceMultiplier: 1.5 },
        { letter: "E", seats: 12, type: "standard", priceMultiplier: 1.0 },
        { letter: "F", seats: 12, type: "standard", priceMultiplier: 1.0 },
      ],
    },
  },
  {
    id: 4,
    name: "Screen 4",
    type: "Standard",
    time: presentTime,
    seatLayout: {
      rows: [
        { letter: "A", seats: 24, type: "standard", priceMultiplier: 1.0 },
        { letter: "B", seats: 24, type: "standard", priceMultiplier: 1.0 },
        { letter: "C", seats: 24, type: "standard", priceMultiplier: 1.0 },
        { letter: "D", seats: 24, type: "standard", priceMultiplier: 1.0 },
        { letter: "E", seats: 24, type: "standard", priceMultiplier: 1.0 },
        { letter: "F", seats: 24, type: "economy", priceMultiplier: 0.8 },
        { letter: "G", seats: 24, type: "economy", priceMultiplier: 0.8 },
      ],
    },
  },
  {
    id: 5,
    name: "Screen 5",
    type: "3D Digital",
    time: presentTime,
    seatLayout: {
      rows: [
        { letter: "A", seats: 18, type: "premium", priceMultiplier: 1.3 },
        { letter: "B", seats: 18, type: "premium", priceMultiplier: 1.3 },
        { letter: "C", seats: 20, type: "standard", priceMultiplier: 1.0 },
        { letter: "D", seats: 20, type: "standard", priceMultiplier: 1.0 },
        { letter: "E", seats: 22, type: "economy", priceMultiplier: 0.9 },
        { letter: "F", seats: 22, type: "economy", priceMultiplier: 0.9 },
      ],
    },
  },
];
