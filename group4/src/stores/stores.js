
  import { create } from "zustand";
  import instance from "../services/index";
  import { endpoint } from "../services/endpoint";
  import { getAllProducts } from "../services/products";
  import { decodeFakeToken } from "../data/token";

  export const useCartStore = create((set, get) => ({
    cart: [],

    fetchCart: async (userId) => {
     
      try {
        if (!userId) {
          const token = localStorage.getItem("token")|| sessionStorage.getItem("token");
          const decoded = await decodeFakeToken(token);
          userId = decoded?.id;
        }
        
        
        const res = await instance.get(endpoint.CART + `?userId=${userId}`);
        const cartItems = res.data;

        const products = await getAllProducts();
        const productMap = new Map(products.map(p => [(p.id), p]));

        const detailedCart = cartItems.map(item => {
          const product = productMap.get((item.productId)) || {};
          return {
            ...item,
            name: product.name || 'No name',
            price: product.price || 0,
            img: product.img || '',
          };
        });

        set({ cart: detailedCart });
      } catch (err) {
        console.error("Fetch cart failed:", err);
      }
    },

    addToCart: async (item) => {
      try {
        let { userId, productId, storeId, quantity } = item;
        if (!userId) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    console.warn("No token found");
    return;
  }
  const decoded = await decodeFakeToken(token);
  userId = decoded?.id;
}
        const res = await instance.get(
          endpoint.CART + `?userId=${userId}&productId=${productId}`
        );
        const existing = res.data[0];

        const products = await getAllProducts();
        const productMap = new Map(products.map(p => [(p.id), p]));
        const product = productMap.get((productId)) || {};

        if (existing) {
          const updated = { ...existing, quantity: existing.quantity + quantity };
          await instance.patch(endpoint.CART + existing.id, updated);
          set((state) => ({
            cart: state.cart.map((i) =>
              i.id === existing.id
                ? { ...updated, name: product.name, price: product.price, img: product.img }
                : i
            ),
          }));
        } else {
          const newItemRes = await instance.post(endpoint.CART, {
            userId,
            productId,
            storeId,
            quantity,
          });
            await get().fetchCart(userId);
        }
      } catch (err) {
        console.error("Add to cart failed:", err);

      }
      
    },

    removeFromCart: async (id) => {
      try {
        await instance.delete(endpoint.CART + id);
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      } catch (err) {
        console.error("Remove from cart failed:", err);
      }
    },

    increaseQuantity: async (id) => {
      try {
        const item = get().cart.find((i) => i.id === id);
        if (!item) return;
        const updated = { ...item, quantity: item.quantity + 1 };
        await instance.patch(endpoint.CART + id, updated);
        set((state) => ({
          cart: state.cart.map((i) => (i.id === id ? updated : i)),
        }));
      } catch (err) {
        console.error("Increase quantity failed:", err);
      }
    },

    decreaseQuantity: async (id) => {
      try {
        const item = get().cart.find((i) => i.id === id);
        if (!item || item.quantity <= 1) return;
        const updated = { ...item, quantity: item.quantity - 1 };
        await instance.patch(endpoint.CART + id, updated);
        set((state) => ({
          cart: state.cart.map((i) => (i.id === id ? updated : i)),
        }));
      } catch (err) {
        console.error("Decrease quantity failed:", err);
      }
    },

    clearCart: () => {
      set({ cart: [] });
      localStorage.removeItem("cart");
    },
    clearAfterCheckout: async () => {
   try {
     const token =
      localStorage.getItem("token") || sessionStorage.getItem("token"); // ✅ Check cả 2
    const decoded = await decodeFakeToken(token);
    const userId = decoded?.id;
    if (!userId) return;
    
      const res = await instance.get(endpoint.CART + `?userId=${userId}`);
      const cartItems = res.data;

    
      await Promise.all(
        cartItems.map((item) =>
          instance.delete(endpoint.CART + item.id)
        )
      );

      
      set({ cart: [] });
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  },
  }));

