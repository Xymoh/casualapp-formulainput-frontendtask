/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useRef } from "react";
import clsx from "clsx";

import useFormulaStore from "../store/formulaStore";
import { useAutocomplete } from "../hooks/useAutocomplete";
import Autocomplete from "./Autocomplete";
import Tag from "./Tag";

const FormulaInput = () => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    items,
    inputValue,
    setInputValue,
    addTag,
    addOperator,
    addNumber,
    setCursorPosition,
    removeItemAtCursor,
  } = useFormulaStore();

  const { data: suggestions = [] } = useAutocomplete(inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowAutocomplete(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle special keys
    switch (e.key) {
      case "Backspace":
        if (inputValue === "") {
          e.preventDefault();
          removeItemAtCursor();
        }
        break;
      case "Enter":
        if (showAutocomplete && suggestions.length > 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[0]);
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
      case "(":
      case ")":
        e.preventDefault();
        addOperator(e.key);
        break;
      default:
        if (/^[0-9]$/.test(e.key) && inputValue === "") {
          e.preventDefault();
          addNumber(e.key);
        }
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    addTag(suggestion);
    setInputValue("");
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleItemClick = (index: number) => {
    setCursorPosition(index);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    inputValue && setShowAutocomplete(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowAutocomplete(false), 200);
  };

  return (
    <div className="relative w-full mx-auto">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={clsx(
          "flex items-center flex-wrap p-4 border-2 rounded-lg bg-white",
          "transition-all duration-150 ease-in-out",
          "shadow-md hover:shadow-lg",
          isFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(index)}
            className="mx-1.5 my-1 flex-shrink-0"
          >
            {item.type === "tag" ? (
              <Tag name={item.value} id={item.id} />
            ) : item.type === "operator" ? (
              <span className="text-blue-600 font-semibold text-lg px-1">
                {item.value}
              </span>
            ) : (
              <span className="text-gray-800 font-mono text-lg">
                {item.value}
              </span>
            )}
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-grow min-w-[10rem] outline-none border-none py-2 px-1 text-gray-800 text-lg"
          placeholder={items.length === 0 ? "Enter your formula..." : ""}
        />
      </div>

      {showAutocomplete && suggestions.length > 0 && (
        <Autocomplete
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
        />
      )}
    </div>
  );
};

export default FormulaInput;
