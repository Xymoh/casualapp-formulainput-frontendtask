import FormulaInput from "./components/FormulaInput";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#F9FAFB]">
      <div className="w-full max-w-3xl p-8 rounded-xl shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Formula Input
        </h1>
        <FormulaInput />
      </div>
    </div>
  );
}

export default App;
