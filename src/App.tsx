import FormulaInput from "./components/FormulaInput";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-3xl p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-white-800">
          Formula Input
        </h1>
        <FormulaInput />
      </div>
    </div>
  );
}

export default App;
