import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/converters/txt"),
  title: "TextFileToDocument",
  description:
    'Converts text files to Documents.\n\nUsage example:\n```python\nfrom haystack.components.converters.txt import TextFileToDocument\n\nconverter = TextFileToDocument()\nresults = converter.run(sources=["sample.txt"])\ndocuments = results["documents"]\nprint(documents[0].content)\n# \'This is the content from the txt file.\'\n```',
  type: "object",
  __pyType: "TextFileToDocument",
  __pyModule: "haystack.components.converters.txt",
  __nodeType: "component",
  __defaultName: "txt-converter",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        encoding: {
          type: "string",
          default: "utf-8",
          __pyType: "str",
          description:
            "The encoding of the text files.\nNote that if the encoding is specified in the metadata of a source ByteStream,\nit will override this value.",
        },
      },
      required: ["encoding"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        sources: {
          type: "array",
          items: {
            anyOf: [
              {
                type: "string",
              },
              {
                $ref: "/haystack/dataclasses/byte-stream",
              },
            ],
          },
          __pyType:
            "typing.List[typing.Union[str, pathlib.Path, haystack.dataclasses.byte_stream.ByteStream]]",
          description: "List of HTML file paths or ByteStream objects.",
        },
        // meta: {
        //   anyOf: [
        //     {
        //       type: "object",
        //       additionalProperties: true,
        //     },
        //     {
        //       type: "array",
        //       items: {
        //         type: "object",
        //         additionalProperties: true,
        //       },
        //     },
        //   ],
        //   default: null,
        //   __pyType:
        //     "typing.Union[typing.Dict[str, typing.Any], typing.List[typing.Dict[str, typing.Any]], NoneType]",
        //   description:
        //     "Optional metadata to attach to the Documents.\nThis value can be either a list of dictionaries or a single dictionary.\nIf it's a single dictionary, its content is added to the metadata of all produced Documents.\nIf it's a list, the length of the list must match the number of sources, because the two lists will be zipped.\nIf `sources` contains ByteStream objects, their `meta` will be added to the output Documents.",
        // },
      },
      required: ["sources"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: "/haystack/dataclasses/document",
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
  },
};
