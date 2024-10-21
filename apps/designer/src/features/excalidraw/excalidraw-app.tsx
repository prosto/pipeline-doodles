"use client";

import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { findReact } from "@repo/find-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

import type {
  App,
  Theme,
  ExcalidrawImperativeAPI,
  ExcalidrawModuleType,
} from "./types";

export interface ExcalidrawAppProps {
  connect: (
    app: App,
    api: ExcalidrawImperativeAPI,
    moduleExports: ExcalidrawModuleType,
  ) => void;
  disconnect: () => void;
}

export function ExcalidrawApp({
  connect,
  disconnect,
}: ExcalidrawAppProps): JSX.Element {
  const { theme } = useTheme();
  const elementId = useId();

  const [imperativeAPI, setImperativeAPI] = useState<ExcalidrawImperativeAPI>();

  useEffect(() => {
    const app = findExcalidrawAppById(elementId);

    if (!imperativeAPI || !app) {
      return;
    }

    void import("@excalidraw/excalidraw").then((exports) => {
      connect(app, imperativeAPI, exports);
    });

    return () => {
      disconnect();
    };
  }, [elementId, imperativeAPI, connect, disconnect]);

  return (
    <div className="tw-h-full tw-w-full" id={elementId}>
      <Excalidraw
        excalidrawAPI={setImperativeAPI}
        theme={theme as Theme}
        validateEmbeddable
      >
        <MainMenu />
      </Excalidraw>
    </div>
  );
}

export default ExcalidrawApp;

function findExcalidrawAppById(excalidrawContainerId: string): App | null {
  const excalidrawContainer = document.getElementById(excalidrawContainerId);
  const excalidrawAppComponent = excalidrawContainer?.getElementsByClassName(
    "excalidraw-container",
  );

  if (excalidrawAppComponent && excalidrawAppComponent.length === 1) {
    return findReact(excalidrawAppComponent[0]);
  }

  return null;
}
