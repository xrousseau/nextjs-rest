import { GetStaticProps, NextPage } from 'next';
import { Article, getAllArticlesForHome } from '../lib/api-rest';
import Head from 'next/head';
import Link from 'next/link';
import { Entry } from 'contentful';

type IndexProps = {
  articles: Entry<Article>[];
};

const Index: NextPage<IndexProps> = ({ articles }) => {
  return (
    <>
      <Head>
        <title>Contentful live preview example with Next.js and Rest</title>
      </Head>
      {articles.map((article) => (
        <Link href={`/articles/${article.fields.slug}`} key={article.sys.id}>
          <>{article.fields.title}</>
        </Link>
      ))}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ draftMode = false }) => {
  const articles = await getAllArticlesForHome(draftMode);
  return {
    props: { articles, draftMode },
  };
};

export default Index;
