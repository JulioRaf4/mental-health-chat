import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai'; 
import { index } from './pinecone'; 

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
    value: string,
  ): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  };

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
  
    const queryResponse = await index.query({
      vector: userQueryEmbedded,
      topK: 4,
      includeMetadata: true,
    });
  
    return queryResponse.matches.map(match => ({
      content: match.metadata?.content ?? '',
      similarity: match.score,
    }));
  };
