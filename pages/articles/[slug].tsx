import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { Entry } from 'contentful';
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { Article as ArticleType, getAllArticlesWithSlug, getArticle } from '../../lib/api-rest';

interface ArticleProps {
  article: Entry<ArticleType, undefined, string> | null;
  draftMode: boolean;
}

const Article: NextPage<ArticleProps> = ({ article }) => {
  const router = useRouter();
  const updatedArticle = useContentfulLiveUpdates(article);
  const inspectorProps = useContentfulInspectorMode({ entryId: article?.sys.id });

  if (!router.isFallback && !updatedArticle) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
 
      <h1 {...inspectorProps({ fieldId: 'title' })}>{updatedArticle?.fields.title || ''}</h1>

      <h2>introduction</h2>
      <p {...inspectorProps({ fieldId: 'introduction' })}>{updatedArticle?.fields.introduction || ''}</p>

      <h2>Prerequisites</h2>
      <p {...inspectorProps({ fieldId: 'prerequisites' })}>{updatedArticle?.fields.prerequisites || ''}</p>

      <h2>Body</h2>
      <p {...inspectorProps({ fieldId: 'body' })}>{updatedArticle?.fields.body || ''}</p>

      <h2>Categories</h2>
      <ul {...inspectorProps({ fieldId: 'categories' })}>
        {updatedArticle?.fields.categories.map((category : string, index : number) => (
          <li key={index}>{category}</li>
        ))}
      </ul>

    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode = false }) => {
  const slug = params ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : undefined;

  if (!slug) {
    return { notFound: true };
  }

  const article = await getArticle(slug, draftMode);

  return {
    props: {
      article: article ?? null,
      draftMode,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allArticles = await getAllArticlesWithSlug();
  return {
    paths: allArticles?.map((article) => `/articles/${article.fields.slug}`) ?? [],
    fallback: true,
  };
};

export default Article;
