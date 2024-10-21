import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/builders/prompt_builder"),
  title: "PromptBuilder",
  description:
    'Renders a prompt filling in any variables so that it can send it to a Generator.\n\nThe prompt uses Jinja2 template syntax.\nThe variables in the default template are used as PromptBuilder\'s input and are all optional.\nIf they\'re not provided, they\'re replaced with an empty string in the rendered prompt.\nTo try out different prompts, you can replace the prompt template at runtime by\nproviding a template for each pipeline run invocation.\n\n### Usage examples\n\n#### On its own\n\nThis example uses PromptBuilder to render a prompt template and fill it with `target_language`\nand `snippet`. PromptBuilder returns a prompt with the string "Translate the following context to Spanish.\nContext: I can\'t speak Spanish.; Translation:".\n```python\nfrom haystack.components.builders import PromptBuilder\n\ntemplate = "Translate the following context to {{ target_language }}. Context: {{ snippet }}; Translation:"\nbuilder = PromptBuilder(template=template)\nbuilder.run(target_language="spanish", snippet="I can\'t speak spanish.")\n```\n\n#### In a Pipeline\n\nThis is an example of a RAG pipeline where PromptBuilder renders a custom prompt template and fills it\nwith the contents of the retrieved documents and a query. The rendered prompt is then sent to a Generator.\n```python\nfrom haystack import Pipeline, Document\nfrom haystack.utils import Secret\nfrom haystack.components.generators import OpenAIGenerator\nfrom haystack.components.builders.prompt_builder import PromptBuilder\n\n# in a real world use case documents could come from a retriever, web, or any other source\ndocuments = [Document(content="Joe lives in Berlin"), Document(content="Joe is a software engineer")]\nprompt_template = """\n    Given these documents, answer the question.\n    Documents:\n    {% for doc in documents %}\n        {{ doc.content }}\n    {% endfor %}\n\n    Question: {{query}}\n    Answer:\n    """\np = Pipeline()\np.add_component(instance=PromptBuilder(template=prompt_template), name="prompt_builder")\np.add_component(instance=OpenAIGenerator(api_key=Secret.from_env_var("OPENAI_API_KEY")), name="llm")\np.connect("prompt_builder", "llm")\n\nquestion = "Where does Joe live?"\nresult = p.run({"prompt_builder": {"documents": documents, "query": question}})\nprint(result)\n```\n\n#### Changing the template at runtime (prompt engineering)\n\nYou can change the prompt template of an existing pipeline, like in this example:\n```python\ndocuments = [\n    Document(content="Joe lives in Berlin", meta={"name": "doc1"}),\n    Document(content="Joe is a software engineer", meta={"name": "doc1"}),\n]\nnew_template = """\n    You are a helpful assistant.\n    Given these documents, answer the question.\n    Documents:\n    {% for doc in documents %}\n        Document {{ loop.index }}:\n        Document name: {{ doc.meta[\'name\'] }}\n        {{ doc.content }}\n    {% endfor %}\n\n    Question: {{ query }}\n    Answer:\n    """\np.run({\n    "prompt_builder": {\n        "documents": documents,\n        "query": question,\n        "template": new_template,\n    },\n})\n```\nTo replace the variables in the default template when testing your prompt,\npass the new variables in the `variables` parameter.\n\n#### Overwriting variables at runtime\n\nTo overwrite the values of variables, use `template_variables` during runtime:\n```python\nlanguage_template = """\nYou are a helpful assistant.\nGiven these documents, answer the question.\nDocuments:\n{% for doc in documents %}\n    Document {{ loop.index }}:\n    Document name: {{ doc.meta[\'name\'] }}\n    {{ doc.content }}\n{% endfor %}\n\nQuestion: {{ query }}\nPlease provide your answer in {{ answer_language | default(\'English\') }}\nAnswer:\n"""\np.run({\n    "prompt_builder": {\n        "documents": documents,\n        "query": question,\n        "template": language_template,\n        "template_variables": {"answer_language": "German"},\n    },\n})\n```\nNote that `language_template` introduces variable `answer_language` which is not bound to any pipeline variable.\nIf not set otherwise, it will use its default value \'English\'.\nThis example overwrites its value to \'German\'.\nUse `template_variables` to overwrite pipeline variables (such as documents) as well.',
  type: "object",
  __pyType: "PromptBuilder",
  __pyModule: "haystack.components.builders.prompt_builder",
  __nodeType: "component",
  __defaultName: "prompt-builder",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        template: {
          type: "string",
          format: "long-string",
          __pyType: "str",
          description:
            "A prompt template that uses Jinja2 syntax to add variables. For example:\n`\"Summarize this document: {{ documents[0].content }}\\nSummary:\"`\nIt's used to render the prompt.\nThe variables in the default template are input for PromptBuilder and are all optional,\nunless explicitly specified.\nIf an optional variable is not provided, it's replaced with an empty string in the rendered prompt.",
        },
        required_variables: {
          type: "array",
          items: {
            type: "string",
          },
          default: null,
          __pyType: "typing.Optional[typing.List[str]]",
          description:
            "List variables that must be provided as input to PromptBuilder.\nIf a variable listed as required is not provided, an exception is raised. Optional.",
        },
        variables: {
          type: "array",
          items: {
            type: "string",
          },
          default: null,
          __pyType: "typing.Optional[typing.List[str]]",
          description:
            "List input variables to use in prompt templates instead of the ones inferred from the\n`template` parameter. For example, to use more variables during prompt engineering than the ones present\nin the default template, you can provide them here.",
        },
      },
      required: ["template"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        template: {
          type: "string",
          default: null,
          __pyType: "typing.Optional[str]",
          description:
            "An optional string template to overwrite PromptBuilder's default template. If None, the default template\nprovided at initialization is used.",
        },
        template_variables: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "An optional dictionary of template variables to overwrite the pipeline variables.",
        },
      },
      required: [],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          __pyType: "<class 'str'>",
        },
      },
      required: ["prompt"],
      additionalProperties: false,
    },
  },
};
