import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Action,
  isPending,
  ThunkDispatch,
  isFulfilled,
} from "@reduxjs/toolkit";
import { Axios } from "../../axios/config";
import { ServerError } from "../../types/error.types";
import { isAxiosError } from "axios";
import { AppDispatch, RootState, store } from "../store";
import { IFoodCart, ServerResponseICart } from "../../types/cart.types";
import toast from "react-hot-toast";
interface RejectedAction extends Action {
  payload: ServerError;
}

interface initialState {
  loading: boolean;
  cart: IFoodCart[];
  totalPrice: number;
  askClean: boolean;
  error: ServerError | null;
}
interface ServerResponse {
  cart: ServerResponseICart;
  success: boolean;
  message: string;
}

const initialState: initialState = {
  loading: false,
  cart: [],
  totalPrice: 0,
  askClean: false,
  error: null,
};

// * ============================================================================
// ? user fetchCartByUserId
export const fetchCartByUserId = createAsyncThunk<
  ServerResponse,
  void,
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>(
  "cart/fetchCartByUserId",
  async (_, thunkApi) => {
    const response = await Axios.get(`/cart/get`)
      .then(async (res) => {
        return res.data;
      })
      .catch((err: ServerError) => {
        if (isAxiosError(err)) {
          return thunkApi.rejectWithValue(err.response?.data as ServerError);
        }
      });
    return response;
  },
  {
    condition: (args, { getState }) => {
      const { cartState } = getState();
      const { cart } = cartState;
      if (cart.length === 0) {
        return true;
      }
      return false;
    },
  },
);
// * ============================================================================
// ? clean and Add to Cart
export const clearAndAddToCart = createAsyncThunk<
  ServerResponse,
  {
    foodId: string;
    restaurantId: string;
    quantity: number;
  },
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/clearAndAddToCart", async (food, thunkApi) => {
  const response = await Axios.post("/cart/clearandaddtocart", food)
    .then((res) => res.data)
    .catch((err) => {
      if (isAxiosError(err)) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    });
  return response;
});

// * ============================================================================
// ? clean   Cart
export const clearCart = createAsyncThunk<
  ServerResponse,
  void,
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/clearCart", async (food, thunkApi) => {
  const response = await Axios.post("/cart/clear", food)
    .then((res) => res.data)
    .catch((err) => {
      if (isAxiosError(err)) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    });
  return response;
});

// * ============================================================================
// ? Add to Cart
export const addToCart = createAsyncThunk<
  ServerResponse,
  {
    foodId: string;
    quantity: number;
  },
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/addToCart", async (food, thunkApi) => {
  const response = await Axios.post("/cart/add", food)
    .then((res) => res.data)
    .catch((err) => {
      if (isAxiosError(err)) {
        return thunkApi.rejectWithValue(err.response?.data);
      }
    });
  return response;
});
// * ============================================================================
// ? set ask clean
export const setAskClean = createAsyncThunk<
  void,
  void,
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/setAskClean", async (food, thunkApi) => {});

// * ============================================================================

// ? update cart by id
export const updateCartById = createAsyncThunk<
  ServerResponse,
  { foodId: string; quantity: number },
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>(
  "cart/updateCartById",
  async (cart, thunkApi) => {
    const response = await Axios.patch(`/cart/setquantity`, { ...cart })
      .then((res) => res.data)
      .catch((err) => {
        if (isAxiosError(err)) {
          return thunkApi.rejectWithValue(err.response?.data);
        }
      });
    return response;
  },
  {
    condition: (args, { getState }) => {
      const { cartState } = getState();
      const { cart } = cartState;
      const { quantity } = args;
      if (quantity >= 1) {
        return true;
      }
      return false;
    },
  },
);

// * ============================================================================
// ? delete food by  id
export const deleteCartFoodById = createAsyncThunk<
  ServerResponse,
  string,
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/deleteCartFoodById", async (id, thunkApi) => {
  const response = await Axios.delete(`/cart/delfood/${id}`)
    .then(async (res) => {
      return res.data;
    })
    .catch((err: ServerError) => {
      if (isAxiosError(err)) {
        return thunkApi.rejectWithValue(err.response?.data as ServerError);
      }
    });
  return response;
});

// * ============================================================================
// ? Logout
export const ResetCart = createAsyncThunk<
  void,
  void,
  {
    rejectValue: ServerError;
    state: RootState;
    dispatch: AppDispatch;
  }
>("cart/reset", async (id, thunkApi) => {});

// * ============================================================================

/**
 * isRejectedAction type guard function that checks if the action is rejected
 * @param action - action object
 * @returns boolean
 */
function isRejectedAction(action: AnyAction): action is RejectedAction {
  action.type;
  return (
    (action.type as string).startsWith("cart") &&
    action.type.endsWith("rejected")
  );
}

// * ============================================================================

export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartByUserId.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        state.cart = action.payload.cart.foods;
        state.totalPrice = action.payload.cart?.totalPrice;
        state.askClean = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        if (action.payload.cart.foods) state.cart = action.payload.cart.foods;
        state.askClean = false;
        state.totalPrice = action.payload?.cart?.totalPrice;
      })
      .addCase(updateCartById.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        state.cart = action.payload.cart.foods;
        state.askClean = false;
        state.totalPrice = action.payload.cart.totalPrice;
      })
      .addCase(deleteCartFoodById.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        state.cart = action.payload.cart.foods;
        state.totalPrice = action.payload.cart?.totalPrice;
      })
      .addCase(clearAndAddToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        state.cart = action.payload.cart.foods;
        state.totalPrice = action.payload.cart.totalPrice;
        state.askClean = false;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cart) return;
        state.cart = action.payload.cart.foods;
        state.totalPrice = action.payload.cart.totalPrice;
        state.askClean = false;
      })
      .addCase(ResetCart.fulfilled, (state, action) => {
        state = initialState;
      })
      .addCase(setAskClean.fulfilled, (state, action) => {
        state.askClean = false;
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = false;
        const emojiRegex =
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

        if (emojiRegex.test(action.payload.message)) {
          toast(action.payload.message);
        } else if (
          action.payload.message != "Food already added to your cart"
        ) {
          toast.error(action.payload.message);
        }

        state.error = action.payload;
      })
      .addMatcher(isPending, (state, action: AnyAction) => {
        if (action.type.startsWith("cart")) {
          state.loading = true;
        }
      });
  },
});

export default cartReducer.reducer;
