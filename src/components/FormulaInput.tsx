/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

import useFormulaStore from "../store/formulaStore";
import { useAutocomplete } from "../hooks/useAutocomplete";
import Autocomplete from "./Autocomplete";
import Tag from "./Tag";
import FormulaResult from "./FormulaResults";

const FormulaInput = () => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedSuggestion, setHighlightedSuggestion] =
    useState<string>("");

  const {
    items,
    inputValue,
    cursorPosition,
    calculatedResult,
    calculationError,
    setInputValue,
    addTag,
    addOperator,
    addNumber,
    setCursorPosition,
    removeItemAtCursor,
    calculateResult,
    setAutocompleteData,
  } = useFormulaStore();

  const { data: autocompleteItems = [] } = useAutocomplete(inputValue);

  const suggestions = autocompleteItems.map((item) => item.name);

  useEffect(() => {
    if (autocompleteItems?.length) {
      setAutocompleteData(autocompleteItems);
    }
  }, [autocompleteItems?.length, setAutocompleteData]);

  useEffect(() => {
    calculateResult();
  }, [items, calculateResult]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowAutocomplete(true);
  };

  const commitCurrentNumber = () => {
    if (currentNumber) {
      addNumber(currentNumber);
      setCurrentNumber("");
      return true;
    }
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle special keys
    switch (e.key) {
      case "Backspace":
        if (inputValue === "") {
          if (currentNumber) {
            setCurrentNumber(currentNumber.slice(0, -1));
          } else {
            e.preventDefault();
            removeItemAtCursor();
          }
        }
        break;
      case "ArrowLeft":
        if (inputValue === "" && cursorPosition > 0) {
          commitCurrentNumber();
          e.preventDefault();
          setCursorPosition(cursorPosition - 1);
        }
        break;
      case "ArrowRight":
        if (inputValue === "" && cursorPosition < items.length) {
          commitCurrentNumber();
          e.preventDefault();
          setCursorPosition(cursorPosition + 1);
        }
        break;
      case "Enter":
        if (showAutocomplete && suggestions.length > 0) {
          commitCurrentNumber();
          e.preventDefault();
          // Use the highlighted suggestion instead of always the first one
          handleSelectSuggestion(highlightedSuggestion || suggestions[0]);
        } else if (currentNumber) {
          commitCurrentNumber();
        }
        break;
      case "Escape":
        if (showAutocomplete) {
          e.preventDefault();
          setShowAutocomplete(false);
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
      case "(":
      case ")":
        commitCurrentNumber();
        e.preventDefault();
        addOperator(e.key);
        setShowAutocomplete(true);
        inputRef.current?.focus();
        break;
      case ".":
        if (inputValue === "" && !currentNumber.includes(".")) {
          e.preventDefault();
          setCurrentNumber(currentNumber === "" ? "0." : currentNumber + ".");
        }
        break;
      default:
        if (/^[0-9]$/.test(e.key) && inputValue === "") {
          e.preventDefault();
          setCurrentNumber(currentNumber + e.key);
        }
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    commitCurrentNumber();
    addTag(suggestion);
    setInputValue("");
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleItemClick = (index: number) => {
    commitCurrentNumber();
    setCursorPosition(index);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    commitCurrentNumber();
    setCursorPosition(items.length);
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

  // Helper function to render cursor at the right position
  const renderCursorAtPosition = (index: number) => {
    return (
      index === cursorPosition &&
      isFocused &&
      inputValue === "" &&
      !currentNumber && (
        <span className="h-5 w-0.5 bg-blue-500 animate-pulse mx-0.5"></span>
      )
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative">
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className={clsx(
            "flex items-center flex-wrap p-4 border-2 rounded-lg bg-white formula-container",
            "transition-all duration-150 ease-in-out",
            "shadow-md hover:shadow-lg",
            isFocused
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-gray-300"
          )}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {renderCursorAtPosition(index)}

              <div
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
            </React.Fragment>
          ))}

          {renderCursorAtPosition(items.length)}

          {currentNumber && (
            <span className="text-gray-800 font-mono text-lg mx-1.5 my-1">
              {currentNumber}
            </span>
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx(
              "flex-grow min-w-[10rem] outline-none border-none py-2 px-1 text-gray-800 text-lg",
              inputValue === "" ? "caret-transparent" : ""
            )}
            placeholder={
              items.length === 0 && !currentNumber
                ? "Enter your formula..."
                : ""
            }
          />
        </div>

        {showAutocomplete && suggestions.length > 0 && (
          <Autocomplete
            suggestions={suggestions}
            onSelect={handleSelectSuggestion}
            onHighlight={setHighlightedSuggestion}
            onEscape={() => setShowAutocomplete(false)}
          />
        )}
      </div>

      <FormulaResult result={calculatedResult} error={calculationError} />
    </div>
  );
};

export default FormulaInput;
