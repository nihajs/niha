import { marked } from "marked";
import dompurify from "dompurify";
import { JSDOM } from "jsdom";

marked.setOptions({
    breaks: true,
    gfm: true
});

export const markedBench = (file: string) => {
  const dirty = marked.parse(file) as string;
  const window = new JSDOM("").window;
  const DOMPurify = dompurify(window);
  return DOMPurify.sanitize(dirty, { FORBID_ATTR: ["style"] });
}
