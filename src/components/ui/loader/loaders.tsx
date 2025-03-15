import React from 'react';

// Spinner circular simple
type Size = "sm" | "md" | "lg" | "xl";
type Color = "blue" | "green" | "red" | "yellow" | "purple" | "gray";

export const SpinnerLoader = ({ size = "md", color = "blue" }: { size?: Size, color?: Color }) => {
  const sizeClasses: Record<Size, string> = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };
  
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500"
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizeClasses[size] || sizeClasses.md}
        ${colorClasses[color] || colorClasses.blue}
        animate-spin rounded-full border-t-4 border-b-4 border-solid border-opacity-25
      `}></div>
    </div>
  );
};

// Loader con pulsos
export const PulseLoader = ({ count = 3, color = "blue" }: { count?: number, color?: Color }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500"
  };
  
  return (
    <div className="flex space-x-2 items-center">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i}
          className={`
            ${colorClasses[color] || colorClasses.blue}
            h-2 w-2 rounded-full animate-pulse
          `}
          style={{ 
            animationDelay: `${i * 0.15}s` 
          }}
        ></div>
      ))}
    </div>
  );
};

// Barra de progreso indeterminada
export const ProgressLoader = ({ color = "blue", height = "h-1" }: { color?: Color, height?: string }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500"
  };
  
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
      <div 
        className={`
          ${colorClasses[color] || colorClasses.blue}
          ${height} w-full animate-progress-indeterminate
        `}
      ></div>
    </div>
  );
};

// Definir la animación en tu CSS global o con styled-components
// Necesitas añadir esto a tu archivo CSS o tailwind.config.js:
/*
@keyframes progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

// En tailwind.config.js:
theme: {
  extend: {
    animation: {
      'progress-indeterminate': 'progress-indeterminate 1.5s infinite ease-in-out',
    },
  },
},
*/

// Loader con texto
export const TextLoader = ({ text = "Cargando", color = "blue" }: { text?: string, color?: Color }) => {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    gray: "text-gray-500"
  };
  
  return (
    <div className="flex items-center space-x-2">
      <SpinnerLoader size="sm" color={color} />
      <span className={`font-medium ${colorClasses[color] || colorClasses.blue}`}>
        {text}...
      </span>
    </div>
  );
};

// Loader de pantalla completa (overlay)
export const FullScreenLoader = ({ bgOpacity = "bg-opacity-50", color = "blue" }: { bgOpacity?: string, color?: Color }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black ${bgOpacity} z-50`}>
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        <SpinnerLoader size="lg" color={color} />
        <p className="mt-4 text-gray-700 font-medium">Cargando...</p>
      </div>
    </div>
  );
};

// Componente principal que exporta todos los loaders
const Loader = ({ 
  type = "spinner", 
  color = "blue", 
  size = "md",
  text = "Cargando"
}: { 
  type?: "spinner" | "pulse" | "progress" | "text" | "fullscreen", 
  color?: Color, 
  size?: Size,
  text?: string 
}) => {
  switch (type) {
    case "pulse":
      return <PulseLoader color={color} />;
    case "progress":
      return <ProgressLoader color={color} />;
    case "text":
      return <TextLoader text={text} color={color} />;
    case "fullscreen":
      return <FullScreenLoader color={color} />;
    case "spinner":
    default:
      return <SpinnerLoader size={size} color={color} />;
  }
};

export default Loader;