import { Provider } from "@angular/core";
import { provideHighlightOptions } from "ngx-highlightjs";

export function provideCustomHighlightOptions(): Provider[] {
  return [
    provideHighlightOptions({
      coreLibraryLoader: () => import("highlight.js/lib/core"),
      lineNumbersLoader: () => import("ngx-highlightjs/line-numbers"),
      languages: {
        c: () => import("highlight.js/lib/languages/c"),
        cpp: () => import("highlight.js/lib/languages/cpp"),
        sql: () => import("highlight.js/lib/languages/sql"),
        xml: () => import("highlight.js/lib/languages/xml"),
        yaml: () => import("highlight.js/lib/languages/yaml"),
        php: () => import("highlight.js/lib/languages/php"),
        makefile: () => import("highlight.js/lib/languages/makefile"),
        json: () => import("highlight.js/lib/languages/json"),
        plaintext: () => import("highlight.js/lib/languages/plaintext"),
        javascript: () => import("highlight.js/lib/languages/javascript"),
        typescript: () => import("highlight.js/lib/languages/typescript"),
        bash: () => import("highlight.js/lib/languages/bash"),
        css: () => import("highlight.js/lib/languages/css"),
        scss: () => import("highlight.js/lib/languages/scss"),
      },
    }),
  ];
}
