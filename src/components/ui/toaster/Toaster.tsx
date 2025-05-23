"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

// Componente de Toast basado en el diseño de la aplicación
const Toast = ({ 
  id, 
  title, 
  description, 
  variant = "default" 
}: { 
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000); // Autocierre después de 5 segundos

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-error-50 border-error-500 text-error-700";
      case "success":
        return "bg-success-50 border-success-500 text-success-700";
      default:
        return "bg-gray-50 border-gray-300 text-gray-700";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "destructive":
        return "text-error-500";
      case "success":
        return "text-success-500";
      default:
        return "text-brand-500";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
        );
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  return (
    <div className={`flex w-full max-w-xs p-4 mb-4 rounded-lg shadow-md border-l-4 ${getVariantStyles()}`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getIconStyles()}`}>
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 p-1.5 focus:ring-2 focus:ring-gray-300 rounded-lg"
        onClick={() => removeToast(id)}
        aria-label="Close"
      >
        <span className="sr-only">Cerrar</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
