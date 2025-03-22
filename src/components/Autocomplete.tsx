/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  onHighlight?: (suggestion: string) => void;
  onEscape?: () => void;
}

const Autocomplete = ({
  suggestions,
  onSelect,
  onHighlight,
  onEscape,
}: AutocompleteProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Reset only when suggestions list first appears or is completely different
    setSelectedIndex(0);
    if (suggestions.length > 0 && onHighlight) {
      onHighlight(suggestions[0]);
    }
  }, [suggestions.length === 0]); // Only reset when suggestions go from empty to non-empty

  // Update highlighted suggestion when selection changes
  useEffect(() => {
    if (
      suggestions.length > 0 &&
      onHighlight &&
      selectedIndex < suggestions.length
    ) {
      onHighlight(suggestions[selectedIndex]);
    }
  }, [selectedIndex, suggestions, onHighlight]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % suggestions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [suggestions.length, onEscape]);

  return (
    <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-10 border border-gray-200 overflow-hidden">
      <ul className="max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={`px-4 py-2 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-none ${
              index === selectedIndex ? "bg-blue-100" : "hover:bg-blue-50"
            }`}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <span className="font-medium">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
