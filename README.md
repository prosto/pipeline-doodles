# Haystack Designer

## Notice

**This is work in progress and was published for visibility purpose. This project will be open-sources eventually but its main components and implementation details might change in future.**

## Introduction

`haystack-designer` is a single page web application which allows building [Haystack](https://docs.haystack.deepset.ai/docs/intro) pipelines visually using low-code approach.

Its main purpose is to compose components into a connected graph which can be converted to a representation (e.g. [Haystack Pipeline](https://docs.haystack.deepset.ai/docs/serialization)) ready for running in a backend. As of now the plan to use a Backend API which can run the graph and report its execution steps back to UI. Potential backend could be same as implemented in [ray-haystack](https://github.com/prosto/ray-haystack) repository.

Please notice the following key features of the app:

- Components should define its initial, input and output parameters using json schemas. Existing schemas could be found in [node-specs](/packages/node-specs/src/specs/) package
- Components can be dragged into UI canvas and will render as pre-defined UI element
- UI canvas is an integrated [excalidraw](https://github.com/excalidraw/excalidraw) library which provides all drawing features of the Excalidraw. So in addition to component rendering one could enhance the graph with available drawing primitives (e.g. explanation notes, supporting diagrams)
- Once added to canvas component can be configured in a dedicated configuration panel. Based on json schema representation of the component UI forms are automatically generated with validation rules as per schema.
- Once configuration is saved it should be possible to open pipeline definition from the app menu
- **Later it will be possible to run pipeline directly from the app**

https://github.com/user-attachments/assets/233c3478-23f1-4fd7-ab67-da52622e41a2

## Install

Make sure you have `NodeJS` (>=18) and [pnpm](https://pnpm.io/installation) installed on you local.

After cloning the repo, run the following:

```shell
# Install project's dependencies
pnpm install

# Start the app
pnpm dev
```
