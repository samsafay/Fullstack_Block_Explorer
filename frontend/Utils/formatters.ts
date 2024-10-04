import { Format } from "@/components/BlockCard";

export const formatVal = (value: number, state: Format): string => {
  switch (state) {
    case Format.Hex:
      return `0x${value.toString(16)}`;
    case Format.Dec:
      return value.toLocaleString();
    case Format.Time:
      return new Date(value * 1000).toLocaleString(); // Consider adding options for localization
    default:
      console.warn(`Unexpected format state: ${state}`);
      return value.toString(); // Fallback to a default string representation
  }
};
