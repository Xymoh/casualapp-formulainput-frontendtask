import { create } from 'zustand'

type ItemType = 'tag' | 'operator' | 'number' | 'text'

interface FormulaItem {
  id: string;
  type: ItemType;
  value: string;
}

interface FormulaState {
  items: FormulaItem[];
  inputValue: string;
  cursorPosition: number;
  selectedTag: string | null;
  addTag: (tag: string) => void;
  addOperator: (operator: string) => void;
  addNumber: (number: string) => void;
  setInputValue: (value: string) => void;
  setCursorPosition: (position: number) => void;
  removeItemAtCursor: () => void;
  setSelectedTag: (id: string | null) => void;
}

const useFormulaStore = create<FormulaState>((set) => ({
  items: [],
  inputValue: '',
  cursorPosition: 0,
  selectedTag: null,
  addTag: (tag) => set((state) => {
    const newItem = { id: crypto.randomUUID(), type: 'tag' as ItemType, value: tag };
    const newItems = [...state.items.slice(0, state.cursorPosition), newItem, ...state.items.slice(state.cursorPosition)];
    return { items: newItems, cursorPosition: state.cursorPosition + 1 };
  }),
  addOperator: (operator) => set((state) => {
    const newItem = { id: crypto.randomUUID(), type: 'operator' as ItemType, value: operator };
    const newItems = [...state.items.slice(0, state.cursorPosition), newItem, ...state.items.slice(state.cursorPosition)];
    return { items: newItems, cursorPosition: state.cursorPosition + 1 };
  }),
  addNumber: (number) => set((state) => {
    const newItem = { id: crypto.randomUUID(), type: 'number' as ItemType, value: number };
    const newItems = [...state.items.slice(0, state.cursorPosition), newItem, ...state.items.slice(state.cursorPosition)];
    return { items: newItems, cursorPosition: state.cursorPosition + 1 };
  }),
  setInputValue: (value) => set({ inputValue: value }),
  setCursorPosition: (position) => set({ cursorPosition: position }),
  removeItemAtCursor: () => set((state) => {
    if (state.cursorPosition > 0) {
      const newItems = [...state.items.slice(0, state.cursorPosition - 1), ...state.items.slice(state.cursorPosition)];
      return { items: newItems, cursorPosition: state.cursorPosition - 1 };
    }
    return state;
  }),
  setSelectedTag: (id) => set({ selectedTag: id }),
}));

export default useFormulaStore;
