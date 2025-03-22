interface FormulaResultProps {
  result: string | number | null;
  error: string | null;
}

const FormulaResult = ({ result, error }: FormulaResultProps) => {
  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
        <p className="text-sm font-medium">Error: {error}</p>
      </div>
    );
  }

  if (result === null || result === undefined) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
      <div className="flex items-baseline">
        <p className="text-sm text-gray-500 font-medium mr-2">Result:</p>
        <p className="text-xl font-bold text-gray-800">{result}</p>
      </div>
    </div>
  );
};

export default FormulaResult;
