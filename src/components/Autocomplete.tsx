interface AutocompleteProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const Autocomplete = ({ suggestions, onSelect }: AutocompleteProps) => {
  return (
    <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-10 border border-gray-200 overflow-hidden">
      <ul className="max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-none"
            onClick={() => onSelect(suggestion)}
          >
            <span className="font-medium">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
