import { useTreeItemContext } from "../../providers";
import type { FormFieldRenderer } from "../types";

import arrayNumberRenderer from "./form-field-array-number";
import booleanRenderer from "./form-field-boolean";
import enumRenderer from "./form-field-enum";
import numberRenderer from "./form-field-number";
import stringRenderer from "./form-field-string";
import textareaRenderer from "./form-field-textarea";

const renderers: FormFieldRenderer[] = [
  enumRenderer,
  booleanRenderer,
  textareaRenderer,
  numberRenderer,
  stringRenderer,
  arrayNumberRenderer,
];

const defaultRender = stringRenderer;

export function FormFieldRender(): JSX.Element {
  const {
    state: { renderProps },
  } = useTreeItemContext();

  const matchingRenderer = renderers.find(({ predicate }) =>
    predicate(renderProps),
  );

  return matchingRenderer
    ? matchingRenderer.component()
    : defaultRender.component();
}
