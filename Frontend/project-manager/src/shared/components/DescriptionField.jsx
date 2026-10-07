import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { Label } from "@/components/ui/label";

export const DescriptionField = ({
  id,
  label = "Description",
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  helperText = "Formatting: **bold**, *italic*, - bullets, 1. numbered, line breaks.",
}) => {
  return (
    <div className="space-y-2 flex flex-col h-full">
      <Label htmlFor={id}>{label}</Label>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 flex-1 overflow-hidden flex flex-col">
        <MDEditor
          value={value ?? ""}
          onChange={(val) => onChange(val ?? "")}
          preview="edit"
          height={Math.max(rows * 32, 180)}
          textareaProps={{
            id,
            placeholder,
            disabled,
            rows,
            style: { resize: "vertical" },
          }}
          data-color-mode="light"
        />
      </div>

      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
