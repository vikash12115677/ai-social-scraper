import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    theme: localStorage.getItem('theme') || 'dark',
    scrapeStatus: null,
    notifications: [],
    unreadCount: 0,
    translationModal: { open: false, post: null, translation: null },
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setScrapeStatus: (state, action) => { state.scrapeStatus = action.payload; },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    markNotificationsRead: (state) => { state.unreadCount = 0; },
    openTranslationModal: (state, action) => {
      state.translationModal = { open: true, post: action.payload, translation: null };
    },
    closeTranslationModal: (state) => {
      state.translationModal = { open: false, post: null, translation: null };
    },
    setTranslation: (state, action) => {
      state.translationModal.translation = action.payload;
    },
  },
});

export const {
  toggleSidebar, toggleTheme, setScrapeStatus,
  addNotification, markNotificationsRead,
  openTranslationModal, closeTranslationModal, setTranslation,
} = uiSlice.actions;

export default uiSlice.reducer;
