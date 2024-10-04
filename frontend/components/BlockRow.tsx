import { formatVal } from "@/Utils/formatters";
import { Format } from "./BlockCard";

interface FormatDisplayProps {
  label: string;
  value: number;
  formatType: Format;
  onToggle: () => void;
}

const BlockRow = ({ label, value, formatType, onToggle }: FormatDisplayProps) => (
  <p>
    <span className="font-semibold">{label}: </span>
    <button onClick={onToggle} className="text-primary hover:underline focus:outline-none">
      {formatVal(value, formatType)}
    </button>
  </p>
);

export default BlockRow;