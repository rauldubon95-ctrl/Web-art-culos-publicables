type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div
        className="prose prose-zinc max-w-none prose-headings:scroll-mt-24"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
