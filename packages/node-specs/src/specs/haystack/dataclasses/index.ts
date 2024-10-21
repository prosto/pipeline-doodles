import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as ByteStream } from "./byte_stream.schema";
import { schema as ChatMessage } from "./chat_message.schema";
import { schema as Document } from "./document.schema";
import { schema as StreamingChunk } from "./streaming_chunk.schema";

export const schemas = [ByteStream, Document, ChatMessage, StreamingChunk];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/dataclasses"),
  title: "Data Objects",
  schemas,
});
