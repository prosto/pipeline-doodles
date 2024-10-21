import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/websearch/SerperDevWebSearch"),
  title: "SerperDevWebSearch",
  description:
    'Uses [Serper](https://serper.dev/) to search the web for relevant documents.\n\nSee the [Serper Dev website](https://serper.dev/) for more details.\n\nUsage example:\n```python\nfrom haystack.components.websearch import SerperDevWebSearch\nfrom haystack.utils import Secret\n\nwebsearch = SerperDevWebSearch(top_k=10, api_key=Secret.from_token("test-api-key"))\nresults = websearch.run(query="Who is the boyfriend of Olivia Wilde?")\n\nassert results["documents"]\nassert results["links"]\n```',
  type: "object",
  __pyType: "SerperDevWebSearch",
  __pyModule: "haystack.components.websearch.serper_dev",
  __nodeType: "component",
  __defaultName: "serper_dev",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        api_key: {
          $ref: schemaId("/haystack/utils/auth/secret"),
          __pyModule: "haystack.components.websearch.serper_dev",
          __pyType: "Secret",
          description: "API key for the Serper API.",
        },
        top_k: {
          type: "integer",
          default: 10,
          __pyType: "typing.Optional[int]",
          description: "Number of documents to return.",
        },
        allowed_domains: {
          type: "array",
          items: {
            type: "string",
          },
          default: null,
          __pyType: "typing.Optional[typing.List[str]]",
          description: "List of domains to limit the search to.",
        },
        search_params: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "Additional parameters passed to the Serper API.\nFor example, you can set 'num' to 20 to increase the number of search results.\nSee the [Serper website](https://serper.dev/) for more details.",
        },
      },
      required: ["api_key"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        query: {
          type: "string",
          __pyType: "str",
          description: "Search query.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: schemaId("/haystack/dataclasses/document"),
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
        },
        links: {
          type: "array",
          items: {
            type: "string",
          },
          __pyType: "typing.List[str]",
        },
      },
      required: ["documents", "links"],
      additionalProperties: false,
    },
  },
};
