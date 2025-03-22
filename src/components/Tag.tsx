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
        className="bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 
            px-3 py-1.5 rounded-md flex items-center cursor-pointer transition-colors 
            duration-150 font-medium text-base"
        onClick={handleTagClick}
      >
        <span>{name}</span>
        <span className="ml-1.5 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
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
