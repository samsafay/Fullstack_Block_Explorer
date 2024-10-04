import { Format, FormatToggleState } from "@/components/BlockCard";
import { useState } from "react";

export const useFormatToggle = () => {
  const [format, setFormat] = useState<FormatToggleState>({
    number: Format.Hex,
    size: Format.Hex,
    gasLimit: Format.Hex,
    timestamp: Format.Hex,
  });

  const toggleFormat = (field: keyof FormatToggleState) => {
    setFormat(prev => ({
      ...prev,
      [field]: field === "timestamp"
        ? (prev[field] === Format.Hex ? Format.Time : Format.Hex)
        : (prev[field] === Format.Hex ? Format.Dec : Format.Hex),
    }));
  };

  return { format, toggleFormat };
}