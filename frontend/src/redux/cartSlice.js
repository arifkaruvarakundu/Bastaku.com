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
            const existingItem = state.cartItems.find(item=> item.variant.id === variant.id)
            if (existingItem){
                existingItem.quantity += quantity;
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

        updateCartItemQuantity: (state, action) => {
            const { variantId, newQuantity } = action.payload;

            const item = state.cartItems.find(item => item.variant.id === variantId);
            if (item) {
                item.quantity = newQuantity; // ✅ Only update the specific item
            }

            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },

        setCart: (state, action) =>{
            state.cartItems = action.payload;
            localStorage.setItem('cart', JSON.stringify(state.cartItems))
        }
    },
})

export const {addToCart, removeFromCart, setCart} = cartSlice.actions;
export default cartSlice.reducer;