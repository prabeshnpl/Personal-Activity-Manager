// src/components/GlobalError.jsx
import { useErrorStore } from "../../../stores/errorStore";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ErrorMessage = () => {
  const { error, clearError } = useErrorStore();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    clearError();
  }, [location.pathname]);

  useEffect(() => {
    if (error) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        // clear after fade-out finishes
        setTimeout(() => clearError(), 500);
      }, 3500); // 3.5s visible

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 p-4 
                  shadow transition-opacity 
                  duration-500 ease-in-out flex justify-center items-center
                  mb-4 bg-red-100 border w-1/6 z-70
                  border-red-400 text-red-700 rounded-lg
                  ${visible ? "opacity-100" : "opacity-0"}`}
    >
      
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorMessage;