import { create } from 'zustand';

interface ViewState {
  currentView: 'table' | 'kanban' | 'calendar' | 'timeline';
  setView: (view: 'table' | 'kanban' | 'calendar' | 'timeline') => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'table', // Default view is table
  setView: (view) => set({ currentView: view }),
}));
