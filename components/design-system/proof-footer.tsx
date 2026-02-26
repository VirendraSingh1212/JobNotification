import { Check, Square } from "lucide-react";

interface ChecklistItem {
  label: string;
  checked: boolean;
}

interface ProofFooterProps {
  items?: ChecklistItem[];
}

const defaultItems: ChecklistItem[] = [
  { label: "UI Built", checked: false },
  { label: "Logic Working", checked: false },
  { label: "Test Passed", checked: false },
  { label: "Deployed", checked: false },
];

export function ProofFooter({ items = defaultItems }: ProofFooterProps) {
  return (
    <footer className="border-t border-border bg-card py-6 px-6 lg:px-10">
      <div className="flex flex-wrap items-center gap-6 lg:gap-10">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.checked ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground" />
            )}
            <span
              className={`text-sm ${
                item.checked ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </footer>
  );
}
