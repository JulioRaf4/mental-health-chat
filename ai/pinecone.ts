import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { config } from 'dotenv';

config({
  path: '.env.local',
});

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not defined');
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

export const index = pc.index('mentalhealth');
