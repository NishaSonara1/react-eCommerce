import { configureStore } from '@reduxjs/toolkit';
import { Product } from '../Products';

// Define the cart state interface
export interface CartState {
  items: Product[];
}

// Define the root state
export interface RootState {
  cart: CartState;
}

// Initial state
const initialState: CartState = {
  items: [],
};

// Create a simple reducer
const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'cart/addToCart':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case 'cart/updateQuantity':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'cart/removeFromCart':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'cart/clearCart':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

// Action creators
export const addToCart = (product: Product) => ({
  type: 'cart/addToCart',
  payload: product,
});

export const updateQuantity = (id: number, quantity: number) => ({
  type: 'cart/updateQuantity',
  payload: { id, quantity },
});

export const removeFromCart = (id: number) => ({
  type: 'cart/removeFromCart',
  payload: id,
});

export const clearCart = () => ({
  type: 'cart/clearCart',
});

// Create the store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Export the types
export type AppDispatch = typeof store.dispatch;
