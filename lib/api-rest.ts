import { Entry, createClient, EntryFieldTypes, EntrySys } from 'contentful';


type ArticleFields = {
  title: string;
  slug: string;
  introduction: string;
  prerequisites: string;
  body: string;
  categories: string[];
};



export type Article = {
  contentTypeId: 'article';
  fields: ArticleFields;
  sys: EntrySys;
};

const clientDelivery = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const clientPreview = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
});

async function fetchEntry(query: object, draftMode = false): Promise<Entry<Article>> {
  const client = draftMode ? clientPreview : clientDelivery;
  const entries = await client.getEntries<Article>(query);
  return entries.items[0];
}

async function fetchEntries(query: object, draftMode = false): Promise<Entry<Article>[]> {
  const client = draftMode ? clientPreview : clientDelivery;
  const entries = await client.getEntries<Article>(query);
  return entries.items;
}

export async function getArticle(slug: string, draftMode = false): Promise<Entry<Article>> {
  const entry = await fetchEntry(
    {
      'fields.slug': slug,
      content_type: 'article',
    },
    draftMode
  );
  return entry;
}

export async function getAllArticlesWithSlug(): Promise<Entry<Article>[]> {
  const entries = await fetchEntries({
    'fields.slug[exists]': true,
    content_type: 'article',
  });
  return entries;
}

export async function getAllArticlesForHome(draftMode = false): Promise<Entry<Article>[]> {
  const entries = await fetchEntries(
    {
      content_type: 'article',
    },
    draftMode
  );
  return entries;
}
