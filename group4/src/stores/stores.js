// src/store/cartStore.js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],

 addToCart: (product) =>
  set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        ),
      };
    } else {
      return {
        cart: [
          ...state.cart,
          { ...product, quantity: product.quantity || 1 },
        ],
      };
    }
  }),

  increaseQuantity: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0), // tự xóa nếu =0
    })),

  removeFromCart: (id) =>
    set((state) => ({
      ...state,
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));
