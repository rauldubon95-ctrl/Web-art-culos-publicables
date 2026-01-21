import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        {/* ELIMINADO: <Header /> (El viejo título "Blog.") */}
        {/* ELIMINADO: <Alert /> (La barra de "Preview mode" que estorbaba) */}
        
        <article className="mb-32 pt-8"> {/* Agregué pt-8 para separar un poco del menú */}
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Cuadernos Abiertos`; // <--- CAMBIO: Puse el nombre real

  const ogImages =
    post.ogImage?.url
      ? [post.ogImage.url]
      : post.coverImage
        ? [post.coverImage]
        : [];

  return {
    title,
    openGraph: {
      title,
      images: ogImages,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}