import dynamic from "next/dynamic";

// Since client components get prepended on server as well hence importing the excalidraw stuff dynamically
// with ssr false
export const ExcalidrawWrapper = dynamic(() => import("./excalidraw-app"), {
  ssr: false,
  loading: () => {
    if (typeof window !== "undefined") {
      window.EXCALIDRAW_ASSET_PATH = "/";
    }
    return null;
  },
});
