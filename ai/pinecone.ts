import { Pinecone } from '@pinecone-database/pinecone';
import { config } from 'dotenv';
import { openai } from '@ai-sdk/openai';

config({
  path: '.env.local',
});

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not defined');
}

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const indexName = 'mentalhealth'; // Your index name

async function indexDocument(id: string, content: string) {
  const response = await (openai as any).embeddings.create({
    input: content,
    model: 'text-embedding-ada-002',
  });

  const embedding = response.data[0].embedding;

  const index = pinecone.Index(indexName);

  await index.namespace('ns1').upsert([
    {
      id,
      values: embedding,
      metadata: { content },
    },
  ]);

  console.log(`Document with id: ${id} indexed successfully.`);
}

export { indexDocument };

async function queryRelevantDocuments(query: string) {
  const response = await (openai as any).embeddings.create({
    input: query,
    model: 'text-embedding-ada-002',
  });

  const embedding = response.data[0].embedding;

  const index = pinecone.Index(indexName);

  const queryResponse = await index.namespace('ns1').query({
    topK: 5, 
    vector: embedding,
    includeValues: false,
    includeMetadata: true,
  });

  console.log(`Query results for "${query}":`, queryResponse.matches);
  return queryResponse.matches;
}

export { queryRelevantDocuments };
