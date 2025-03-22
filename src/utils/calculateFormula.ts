/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteItem } from "../hooks/useAutocomplete";

type FormulaItem = {
  id: string;
  type: "tag" | "operator" | "number" | "text";
  value: string;
};

const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const calculateFormula = (
  items: FormulaItem[],
  tagValues: Map<string, number | string>
): { result: number | string | null; error: string | null } => {
  try {
    let expressionStr = "";

    for (const item of items) {
      if (item.type === "tag") {
        const value = tagValues.get(item.value);

        if (value === undefined) {
          return { result: null, error: `Unknown value for ${item.value}` };
        }

        if (typeof value === "string" && !isNumeric(value)) {
          return {
            result: null,
            error: `Non-numeric value for ${item.value}: ${value}`,
          };
        }

        expressionStr += `(${value})`;
      } else if (item.type === "operator") {
        expressionStr += item.value;
      } else if (item.type === "number") {
        expressionStr += item.value;
      }
    }

    if (!expressionStr) {
      return { result: null, error: null };
    }

    if (!/^[0-9+\-*/^(). ]+$/.test(expressionStr)) {
      return { result: null, error: "Invalid expression" };
    }

    expressionStr = expressionStr.replace(/\^/g, "**");

    const result = new Function(`return ${expressionStr}`)();

    const formattedResult =
      isFinite(result) && !Number.isInteger(result)
        ? parseFloat(result.toFixed(10))
        : result;

    return { result: formattedResult, error: null };
  } catch (error) {
    return { result: null, error: String(error) };
  }
};

export const buildTagValueMap = (
  items: FormulaItem[],
  autocompleteData: AutocompleteItem[]
): Map<string, number | string> => {
  const tagValueMap = new Map<string, number | string>();

  for (const item of items) {
    if (item.type === "tag") {
      const matchingItem = autocompleteData.find(
        (dataItem) => dataItem.name === item.value
      );
      if (matchingItem) {
        tagValueMap.set(item.value, matchingItem.value);
      }
    }
  }

  return tagValueMap;
};
