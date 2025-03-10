"""
Script para fazer upload de dados do Hugging Face para o Pinecone.
"""
import os
from dotenv import load_dotenv
from datasets import load_dataset
from services.pinecone_service import PineconeService
from services.openai_service import OpenAIService

# Carrega as variáveis de ambiente
load_dotenv(dotenv_path='.env.local')

def upload_huggingface_dataset_to_pinecone(dataset_name, split='train', batch_size=100):
    """
    Faz upload de um dataset do Hugging Face para o Pinecone.
    
    Args:
        dataset_name (str): Nome do dataset no Hugging Face.
        split (str, optional): Split do dataset a ser usado. Padrão é 'train'.
        batch_size (int, optional): Tamanho do lote para upload. Padrão é 100.
    """
    pinecone_service = PineconeService()
    openai_service = OpenAIService()
    
    dataset = load_dataset(dataset_name, split=split)
    
    vectors = []
    for item in dataset:
        if 'text' in item:
            embedding = openai_service.create_embedding(item['text'])
            vectors.append({'id': str(item['id']), 'values': embedding})
        
        if len(vectors) >= batch_size:
            pinecone_service.upsert(vectors)
            vectors = []
    

    if vectors:
        pinecone_service.upsert(vectors)
    
    print(f"Upload concluído para o dataset: {dataset_name}, split: {split}")

if __name__ == "__main__":
    dataset_name = 'Amod/mental_health_counseling_conversations'
    upload_huggingface_dataset_to_pinecone(dataset_name)
