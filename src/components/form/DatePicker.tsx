"use client";
import { CalenderIcon } from "@/icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date || null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <div
        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : "text-gray-400 dark:text-white/30"}>
          {value ? format(value, "dd/MM/yyyy", { locale: es }) : placeholder}
        </span>
        <CalenderIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-800 p-2">
          <DayPicker
            mode="single"
            selected={value || undefined}
            onSelect={handleDateSelect}
            locale={es}
            className="date-picker-custom"
            classNames={{
              day_selected: "bg-brand-500 text-white hover:bg-brand-600",
              day_today: "text-brand-500 font-bold",
              caption_label: "text-gray-800 dark:text-white font-medium",
              button: "hover:bg-gray-100 dark:hover:bg-gray-700",
              nav_button: "text-gray-500 dark:text-gray-400",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;