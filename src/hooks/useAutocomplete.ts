import { useQuery } from "@tanstack/react-query";

export interface AutocompleteItem {
  id: string;
  name: string;
  category: string;
  value: string | number;
}

const fetchSuggestions = async (query: string): Promise<AutocompleteItem[]> => {
  try {
    const response = await fetch(
      "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: AutocompleteItem[] = await response.json();

    if (!query) return data;

    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
};

export function useAutocomplete(query: string) {
  return useQuery({
    queryKey: ["autocomplete", query],
    queryFn: () => fetchSuggestions(query),
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false
  });
}
