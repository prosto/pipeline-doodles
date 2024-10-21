import type { JsonWithMetadata } from "@repo/json-schema";
import type { FormEvent, PropsWithChildren } from "react";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { UncontrolledTreeEnvironment, Tree } from "react-complex-tree";

import { Form } from "@repo/ui/components";
import { useForm } from "@repo/ui/form";
import { useSingleton } from "@repo/ui/hooks";

import { useSchemaEditorStore } from "./hooks";
import { SchemaEditorProvider } from "./providers";
import { schemaEditorStoreFactory } from "./store";
import type { SchemaEditorStoreFactory } from "./store/schema-editor-store";
import type { SchemaEditorStore, TopLevelSchema } from "./store/types";
import { TreeItemSchemaRender } from "./tree-item-render/tree-item-render";
import { TreeItemsContainer } from "./tree-items-container";

interface JsonSchemaFormProps {
  onSubmitting?: (value: boolean) => void;
  onSubmitValues?: (values: Record<string, JsonWithMetadata>) => void;
  schemas: TopLevelSchema[];
  settings?: SchemaEditorStoreFactory["settings"];
}

export interface SchemaEditorHandle {
  submitForm: () => void;
  getStore: () => SchemaEditorStore;
}

export const JsonSchemaForm = forwardRef<
  SchemaEditorHandle,
  PropsWithChildren<JsonSchemaFormProps>
>((props, ref) => {
  const { onSubmitValues, onSubmitting, schemas, settings, children } = props;

  const editorStore = useSingleton(() =>
    schemaEditorStoreFactory({ settings }),
  );

  const {
    state: {
      context: {
        schemaValidation,
        schemaTree: {
          actions: { getTopLevelItems, getJsonWithMetadata },
        },
      },
    },
    actions: { loadEditorSchemas },
  } = editorStore;

  useEffect(() => {
    void loadEditorSchemas({ schemas });
  }, [schemas, loadEditorSchemas]);

  const formElement = useRef<HTMLFormElement>(null);

  const form = useForm({
    mode: "onSubmit",
  });
  const { handleSubmit, formState, reset } = form;

  const submitHandler = useCallback(
    (evt?: FormEvent<HTMLFormElement>) => {
      onSubmitting?.(true);

      async function onValid(): Promise<void> {
        const topLevelNames = getTopLevelItems().map((item) => item.index);

        await Promise.all(
          topLevelNames.map((name) =>
            schemaValidation.validateSchemaValues({
              name: String(name),
            }),
          ),
        );

        const jsonValues = Object.fromEntries(
          topLevelNames.map((name) => [name, getJsonWithMetadata(name)]),
        );

        onSubmitValues?.(jsonValues);
        onSubmitting?.(false);
      }

      function onInvalid(): void {
        onSubmitting?.(false);
      }

      void handleSubmit(onValid, onInvalid)(evt);
    },

    [
      handleSubmit,
      schemaValidation,
      getTopLevelItems,
      getJsonWithMetadata,
      onSubmitValues,
      onSubmitting,
    ],
  );

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset(undefined, {
        keepValues: true,
        keepErrors: false,
      });
    }
  }, [formState, reset]);

  useImperativeHandle(
    ref,
    () => ({
      submitForm() {
        if (formElement.current) {
          submitHandler();
        }
      },

      getStore() {
        return editorStore;
      },
    }),
    [submitHandler, editorStore],
  );

  return (
    <Form {...form}>
      <form onSubmit={submitHandler} ref={formElement}>
        <SchemaEditorProvider editorStore={editorStore}>
          <SchemaTreeItemsMemo />
        </SchemaEditorProvider>

        {children}
      </form>
    </Form>
  );
});
JsonSchemaForm.displayName = "JsonSchemaForm";

export const JsonSchemaFormMemo = memo(JsonSchemaForm);

function SchemaTreeItems(): JSX.Element {
  const editorStore = useSchemaEditorStore();

  const { context, rootIndex } = editorStore.state;
  const {
    dataProvider: { dataProvider },
    treeViewState: { viewState, changeHandlers },
  } = context;

  const treeId = useId();

  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      {...changeHandlers}
      canSearch={false}
      canSearchByStartingTyping={false}
      getItemTitle={() => "title"}
      renderItem={TreeItemSchemaRender}
      renderItemsContainer={TreeItemsContainer}
      viewState={{
        [treeId]: viewState,
      }}
    >
      <Tree
        rootItem={rootIndex}
        treeId={treeId}
        treeLabel="Schema Json Editor"
      />
    </UncontrolledTreeEnvironment>
  );
}

const SchemaTreeItemsMemo = memo(SchemaTreeItems);
