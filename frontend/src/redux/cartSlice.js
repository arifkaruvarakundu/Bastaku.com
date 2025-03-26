import {createSlice} from '@reduxjs/toolkit';

const initialState ={
    cartItems: JSON.parse(localStorage.getItem('cart')) || [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addToCart : (state, action)=> {
            const {variant, quantity} = action.payload;
            const existingItemIndex = state.cartItems.findIndex(item=> item.id === variant.id)
            if (existingItemIndex >-1){
                state.cartItems[existingItemIndex].quantity += quantity;
            }
            else{
                state.cartItems.push({variant, quantity});
            }
            
            localStorage.setItem('cart', JSON.stringify(state.cartItems))
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.variant.id !== action.payload.id);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        },
        setCart: (state, action) =>{
            state.cartItems = action.payload;
            localStorage.setItem('cart', JSON.stringify(state.cartItems))
        }
    },
})

export const {addToCart, removeFromCart, setCart} = cartSlice.actions;
export default cartSlice.reducer;