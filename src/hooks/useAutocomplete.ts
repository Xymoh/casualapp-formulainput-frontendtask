import { useQuery } from '@tanstack/react-query';

interface AutocompleteItem {
  id: string;
  name: string;
}

const fetchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data: AutocompleteItem[] = await response.json();
    const suggestions = data.map(item => item.name);
    
    if (!query) return suggestions;
    
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

export function useAutocomplete(query: string) {
  return useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => fetchSuggestions(query),
    staleTime: 60000,
  });
}
