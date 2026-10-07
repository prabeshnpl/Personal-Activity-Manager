// src/components/GlobalError.jsx
import { useErrorStore } from "../../../stores/errorStore";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ErrorMessage = () => {
  const { error, clearError } = useErrorStore();
  const location = useLocation();

  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      clearError();
    }, 3500);

    return () => clearTimeout(timer);
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 p-4 
                  shadow transition-opacity 
                  duration-500 ease-in-out flex justify-center items-center
                  mb-4 bg-red-100 border w-1/6 z-70
                  border-red-400 text-red-700 rounded-lg
                  opacity-100`}
    >
      
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorMessage;
