from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import openai
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from datasets import load_dataset
import uuid
from charset_normalizer import from_path

def detect_encoding(file_path):
    result = from_path(file_path).best()
    return result.encoding if result else "utf-8"


load_dotenv('.env.local')

openai.api_key = os.getenv('OPENAI_API_KEY')
pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_environment = 'us-east1-gcp'

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


def process_and_upload_book_to_pinecone(file_path, chunk_size=1000, chunk_overlap=200):
    """
    Processa um livro (arquivo de texto) dividindo-o em chunks menores,
    gera embeddings e faz upload para o Pinecone.
    
    Args:
        file_path (str): Caminho do arquivo do livro em formato texto.
        chunk_size (int): Tamanho de cada chunk de texto.
        chunk_overlap (int): Quantidade de sobreposição entre chunks.
    """
    # Verifica se o arquivo existe
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"O arquivo {file_path} não foi encontrado.")
    
    # Detecta o encoding do arquivo
    encoding = detect_encoding(file_path)
    print(f"Usando encoding: {encoding} para o arquivo: {file_path}")
    
    # Lê o conteúdo do livro
    with open(file_path, 'r', encoding=encoding) as file:
        book_text = file.read()
    
    # Divide o texto em chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.split_text(book_text)
    
    vectors = []
    for idx, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        vector_id = str(uuid.uuid4())  # Cria um ID único para cada chunk
        vectors.append({'id': vector_id, 'values': embedding})
        
        # Faz o upload em lotes de 100 embeddings
        if len(vectors) >= 100:
            index.upsert(vectors=vectors)
            vectors = []
    
    # Faz o upload dos vetores restantes
    if vectors:
        index.upsert(vectors=vectors)
    
    print(f"Upload do livro {file_path} concluído com sucesso!")
