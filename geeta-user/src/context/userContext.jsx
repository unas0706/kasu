import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const userContext = createContext();

const API = "http://localhost:5000/api";
// const API = " https://kasu-4z4t.onrender.com/api";

export const UserProvider = ({ children }) => {
  const [categories, setCategories] = useState(null);
  const [menuItems, setMenuItems] = useState(null);
  const [tax, setTax] = useState();

  function transformMenu(apiData) {
    const { categories, items } = apiData;

    const uiCategories = categories.map((cat, index) => ({
      id: cat._id,
      name: cat.name,
      //   icon: iconMap[cat.name] || "fa-utensils",
      description: cat.description,
      //   image: imageMap[cat.name] || imageMap["Snacks"],
      _id: cat._id,
    }));

    const menuItems = {};

    uiCategories.forEach((cat) => {
      const filteredItems = items.filter(
        (item) => item.category._id === cat._id,
      );

      menuItems[cat.id] = filteredItems.map((item, idx) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        // icon: iconMap[cat.name] || "fa-utensils",
        badge: item.stock < 40 ? "Popular" : undefined,
        image:
          item.image ||
          "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=500",
      }));
    });

    return {
      categories: uiCategories.map(({ _id, ...rest }) => rest),
      menuItems,
    };
  }

  const getMenu = async () => {
    try {
      const response = await axios.get(`${API}/customer/menu`);
      setTax(response.data.taxRate);
      console.log(response.data);

      const menu = transformMenu(response.data);
      setCategories(menu.categories);
      setMenuItems(menu.menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const placeOrder = async (order) => {
    try {
      const response = await axios.post(`${API}/orders`, order);
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <userContext.Provider value={{ menuItems, categories, placeOrder }}>
      {children}
    </userContext.Provider>
  );
};
export const useUser = () => {
  return useContext(userContext);
};
