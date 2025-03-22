interface FormulaResultProps {
  result: string | number | null;
  error: string | null;
}

const FormulaResult = ({ result, error }: FormulaResultProps) => {
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 transition-all">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (result === null || result === undefined) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg transition-all">
      <div className="flex items-baseline">
        <p className="text-sm text-gray-500 font-medium mr-2">Result:</p>
        <p className="text-xl font-bold text-gray-800">{result}</p>
      </div>
    </div>
  );
};

export default FormulaResult;
