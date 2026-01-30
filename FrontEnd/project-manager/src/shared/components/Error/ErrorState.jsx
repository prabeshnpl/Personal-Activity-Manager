import { AlertTriangle } from "lucide-react"; // or any icon library

const ErrorState = ({ 
  message = "Something went wrong while loading data.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-5 py-12 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;