/*eslint prefer-named-capture-group: "off" -- provide regex as suggested in lodash documentation*/

import { template as _template } from "lodash-es";

type TemplateExecutor = ReturnType<typeof _template>;

const templateCache = new Map<string, TemplateExecutor>();

const templateSettings = {
  escape: /\{\{-([\s\S]+?)\}\}/g, // Jinja style expression (with escape)
  evaluate: /\{%([\s\S]+?)%\}/g, // Jinja style statement
  interpolate: /\{\{=([\s\S]+?)\}\}/g, // Jinja style expression
};

const rawValueReturn = /\{\{>([\s\S]+?)\}\}/g; // Jinja style expression

export function template(str: string, data?: Record<string, unknown>): string {
  const normalizedStr = tweakTemplateStr(str);
  const compileFromCache = templateCache.get(normalizedStr);

  if (!compileFromCache) {
    const compile = _template(normalizedStr, templateSettings);
    templateCache.set(normalizedStr, compile);
    return compile(data);
  }

  return compileFromCache(data);
}

function tweakTemplateStr(str: string): string {
  if (str.match(rawValueReturn)) {
    return str.replace("{{>", "{{return ");
  }
  return str;
}
