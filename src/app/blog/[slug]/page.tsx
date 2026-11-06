import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrow } from "@/components/navbar/icons";
import { Blocks } from "@/components/page/DocBlocks";
import { Breadcrumbs, CtaBand, ProductShelf, SectionHead } from "@/components/page/PageKit";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { getProducts, inCategory, withTag } from "@/lib/catalog";
import { postMetadata } from "@/lib/content-metadata";
import { absoluteMediaUrl, mediaUrl } from "@/lib/media";
import { articleSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import blog from "@/components/blog/Blog.module.css";
import page from "@/components/page/Page.module.css";

type Params = { slug: string };

// New database slugs resolve at runtime. Unknown slugs return a true 404.
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return postMetadata(post);
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const shelf = post.productTag
    ? (post.productTag.tag
        ? await withTag(post.productTag.category, post.productTag.tag)
        : await inCategory(post.productTag.category)
      ).slice(0, 4)
    : (await getProducts()).slice(0, 4);
  const more = (await getPosts()).filter((p) => p.slug !== post.slug);

  return (
    <main>
      <JsonLd
        data={articleSchema({
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          updatedAt: post.updatedAt,
          keywords: post.keywords,
          url: `${siteConfig.url}/blog/${post.slug}`,
          image: absoluteMediaUrl(post.image, siteConfig.url),
          publisher: siteConfig.name,
        })}
      />

      <header className={blog.hero}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Journal", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />
        <div className={blog.heroHeading}>
          <div className={blog.kicker}>
            <p className={blog.eyebrow}>{post.category}</p>
            <span className={blog.readingTime}>{post.readMinutes} min read</span>
          </div>
          <h1 className={blog.title}>{post.title}</h1>
        </div>
        <div className={blog.heroSummary}>
          <div className={blog.heroCopy}>
            <p className={blog.excerpt}>{post.excerpt}</p>
            <div className={blog.meta}>
              <span className={blog.author}>By {siteConfig.name}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
          <div className={blog.cover}>
            <Image src={mediaUrl(post.image)} alt={post.imageAlt} fill preload sizes="(max-width: 700px) 200px, 260px" />
          </div>
        </div>
      </header>

      <section className={blog.body}>
        <div className={page.split}>
          <aside className={page.aside} aria-label="Summary">
            <div className={blog.takeaways}>
              <p className={page.tocTitle}>Key takeaways</p>
              <ul>
                {post.takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <p className={page.tocTitle}>In this article</p>
            <ol className={page.toc}>
              {post.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={page.prose}>
            {post.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <Blocks blocks={s.body} />
              </section>
            ))}
          </article>
        </div>
      </section>

      <ProductShelf eyebrow="Shop the story" title="Frames to explore" products={shelf} href="/shop" hrefLabel="Shop all" />

      <section className={`${page.section} ${page.sectionTint}`} aria-labelledby="more-reading">
        <SectionHead eyebrow="Keep reading" title="More from the Journal" id="more-reading" />
        <ul className={page.linkCards} style={{ ["--cols" as string]: more.length }} data-reveal="stagger" suppressHydrationWarning>
          {more.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className={page.linkCard}>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span>
                  Read the article <IconArrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        tone="dark"
        title="Want advice for your own eyes?"
        text="This article is general guidance. For advice about your vision, see an eye care professional, and our team is always happy to help with frames and lenses."
        primary={{ label: "Contact our team", href: "/contact" }}
        secondary={{ label: "Lens guides", href: "/lenses" }}
      />
    </main>
  );
}
