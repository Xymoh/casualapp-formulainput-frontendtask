import { create } from "zustand";

import { AutocompleteItem } from "../hooks/useAutocomplete";
import { calculateFormula, buildTagValueMap } from "../utils/calculateFormula";

type ItemType = "tag" | "operator" | "number" | "text";

export interface FormulaItem {
  id: string;
  type: ItemType;
  value: string;
}

interface FormulaState {
  items: FormulaItem[];
  inputValue: string;
  cursorPosition: number;
  selectedTag: string | null;
  calculatedResult: number | string | null;
  calculationError: string | null;
  autocompleteData: AutocompleteItem[];
  addTag: (tag: string) => void;
  addOperator: (operator: string) => void;
  addNumber: (number: string) => void;
  deleteTag: (id: string) => void;
  setInputValue: (value: string) => void;
  setCursorPosition: (position: number) => void;
  removeItemAtCursor: () => void;
  setSelectedTag: (id: string | null) => void;
  calculateResult: () => void;
  setAutocompleteData: (data: AutocompleteItem[]) => void;
}

const useFormulaStore = create<FormulaState>((set) => ({
  items: [],
  inputValue: "",
  cursorPosition: 0,
  selectedTag: null,
  calculatedResult: null,
  calculationError: null,
  autocompleteData: [],
  addTag: (tag) =>
    set((state) => {
      const newItem = {
        id: crypto.randomUUID(),
        type: "tag" as ItemType,
        value: tag,
      };
      const newItems = [
        ...state.items.slice(0, state.cursorPosition),
        newItem,
        ...state.items.slice(state.cursorPosition),
      ];
      return { items: newItems, cursorPosition: state.cursorPosition + 1 };
    }),
  addOperator: (operator) =>
    set((state) => {
      const newItem = {
        id: crypto.randomUUID(),
        type: "operator" as ItemType,
        value: operator,
      };
      const newItems = [
        ...state.items.slice(0, state.cursorPosition),
        newItem,
        ...state.items.slice(state.cursorPosition),
      ];
      return { items: newItems, cursorPosition: state.cursorPosition + 1 };
    }),
  addNumber: (number) =>
    set((state) => {
      const newItem = {
        id: crypto.randomUUID(),
        type: "number" as ItemType,
        value: number,
      };
      const newItems = [
        ...state.items.slice(0, state.cursorPosition),
        newItem,
        ...state.items.slice(state.cursorPosition),
      ];
      return { items: newItems, cursorPosition: state.cursorPosition + 1 };
    }),
  deleteTag: (id) =>
    set((state) => {
      const itemIndex = state.items.findIndex((item) => item.id === id);
      if (itemIndex === -1) return state;

      const newItems = [
        ...state.items.slice(0, itemIndex),
        ...state.items.slice(itemIndex + 1),
      ];
      return {
        items: newItems,
        cursorPosition:
          itemIndex < state.cursorPosition
            ? state.cursorPosition - 1
            : state.cursorPosition,
        selectedTag: null,
      };
    }),
  setInputValue: (value) => set({ inputValue: value }),
  setCursorPosition: (position) => set({ cursorPosition: position }),
  removeItemAtCursor: () =>
    set((state) => {
      if (state.cursorPosition > 0) {
        const newItems = [
          ...state.items.slice(0, state.cursorPosition - 1),
          ...state.items.slice(state.cursorPosition),
        ];
        return { items: newItems, cursorPosition: state.cursorPosition - 1 };
      }
      return state;
    }),
  setSelectedTag: (id) => set({ selectedTag: id }),
  calculateResult: () =>
    set((state) => {
      const tagValueMap = buildTagValueMap(state.items, state.autocompleteData);
      const { result, error } = calculateFormula(state.items, tagValueMap);

      return {
        calculatedResult: result,
        calculationError: error,
      };
    }),
  setAutocompleteData: (data) => set({ autocompleteData: data }),
}));

export default useFormulaStore;
