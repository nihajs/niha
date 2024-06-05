import { VFile } from 'remark-rehype/lib';

export const prepareRemarkBench = async () => {
  const rehypeStringify = (await import('rehype-stringify')).default
  const rehypeSanitize = (await import('rehype-sanitize')).default
  const remarkParse = (await import('remark-parse')).default
  const remarkRehype = (await import('remark-rehype')).default
  const {unified} = await import('unified')
  return async (file: string): Promise<VFile> => {
    return unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(file)
  }
}
