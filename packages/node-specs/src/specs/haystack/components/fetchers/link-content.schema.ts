import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/fetchers/link-content"),
  title: "LinkContentFetcher",
  description:
    "LinkContentFetcher is a component for fetching and extracting content from URLs. It supports handling various content types, retries on failures, and automatic user-agent rotation for failed web requests.",
  __pyType: "LinkContentFetcher",
  __pyModule: "haystack.components.fetchers.link_content",
  __nodeType: "component",
  __defaultName: "fetcher",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        raise_on_failure: {
          type: "boolean",
          __pyType: "bool",
          description:
            "If True, raises an exception if it fails to fetch a single URL. For multiple URLs, it logs errors and returns the content it successfully fetched. Default is True.",
          default: true,
        },
        user_agents: {
          description:
            "A list of user agents for fetching content. If None, a default user agent is used.",
          type: "array",
          __pyType: "Optional[List[str]]",
          items: {
            type: "string",
          },
          default: ["haystack/LinkContentFetcher/2.0"],
        },
        retry_attempts: {
          description:
            "Specifies how many times you want it to retry to fetch the URL's content. Default is 2.",
          type: "integer",
          __pyType: "int",
          minimum: 0,
          default: 2,
        },
        timeout: {
          description: "Timeout in seconds for the request. Default is 3.",
          type: "integer",
          __pyType: "int",
          minimum: 0,
          default: 3,
        },
      },
      required: ["raise_on_failure", "retry_attempts", "timeout"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        urls: {
          type: "array",
          __pyType: "List[str]",
          items: {
            type: "string",
            format: "uri",
          },
          description: "A list of URLs to fetch content from.",
        },
      },
      required: ["urls"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        streams: {
          type: "array",
          __pyType: "List[ByteStream]",
          items: {
            $ref: "/haystack/dataclasses/byte-stream",
          },
          description:
            "A lists of ByteStream objects representing the extracted content.",
        },
      },
      required: ["streams"],
      additionalProperties: false,
    },
  },
};
