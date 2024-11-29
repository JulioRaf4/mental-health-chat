import os
import openai
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from datasets import load_dataset

load_dotenv(dotenv_path='.env.local')

openai.api_key = os.getenv('OPENAI_API_KEY')
pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_environment = os.getenv('PINECONE_ENVIRONMENT') 

if not openai.api_key or not pinecone_api_key:
    raise ValueError("API keys para OpenAI ou Pinecone não estão configuradas corretamente no arquivo .env.")

pc = Pinecone(api_key=pinecone_api_key)

index_name = 'mentalhealth'

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1536, 
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )       

index = pc.Index(index_name)

def embed_text(text):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def upload_huggingface_dataset_to_pinecone(dataset_name, split='train'):
    dataset = load_dataset(dataset_name, split=split)

    vectors = []
    for item in dataset:
        if 'text' in item:
            embedding = embed_text(item['text'])
            vectors.append({'id': str(item['id']), 'values': embedding})

        if len(vectors) >= 100:
            index.upsert(vectors=vectors)
            vectors = []  

    if vectors:
        index.upsert(vectors=vectors)

    print(f"Upload concluído para o dataset: {dataset_name}, split: {split}")

dataset_name = 'Amod/mental_health_counseling_conversations'  
upload_huggingface_dataset_to_pinecone(dataset_name)
