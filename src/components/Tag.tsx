import { useState, useRef } from "react";
import useFormulaStore from "../store/formulaStore";

interface TagProps {
  name: string;
  id: string;
}

const Tag = ({ name, id }: TagProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setSelectedTag, deleteTag, autocompleteData } = useFormulaStore();

  const handleTagClick = () => {
    setSelectedTag(id);
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Delete") {
      deleteTag(id);
    } else if (option === "Properties") {
      const tagData = autocompleteData.find((item) => item.name === name);
      if (tagData) {
        console.log("Tag Properties:", tagData);
      } else {
        console.log("No properties found for this tag");
      }
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        className="bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 
                  px-3 py-1.5 rounded-md flex items-center cursor-pointer transition-colors 
                  duration-150 font-medium text-base"
        onClick={handleTagClick}
      >
        <span>{name}</span>
        <span className="ml-1.5 text-xs text-blue-500">▾</span>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md z-10 border border-gray-200"
        >
          <div className="py-1">
            <div
              className="px-4 py-2 hover:bg-red-50 cursor-pointer text-sm text-red-600"
              onClick={() => handleOptionClick("Delete")}
            >
              Delete
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
              onClick={() => handleOptionClick("Properties")}
            >
              Properties
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tag;
