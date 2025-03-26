import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage as default
import authReducer from './authSlice';
import cartReducer from './cartSlice';

const persistConfig = {
  key: 'root',
  storage,
};

// Wrap the auth reducer with persistReducer to ensure persistence
const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer, // Use the persisted reducer
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore specific Redux Persist actions
      },
    }),
});

export const persistor = persistStore(store); // Export persistor for the <PersistGate> wrapper

export default store;
