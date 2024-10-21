import { TreeItemInputRender } from "./form-field-render";

interface TreeItemPropertyValueProps {
  className?: string;
}

export function TreeItemPropertyValue({
  className,
}: TreeItemPropertyValueProps): JSX.Element {
  return (
    <div className={className}>
      <TreeItemInputRender />
    </div>
  );
}
