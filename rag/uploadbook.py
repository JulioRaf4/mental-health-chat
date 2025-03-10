import os
import uuid
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from charset_normalizer import from_path
from services.pinecone_service import PineconeService
from services.openai_service import OpenAIService

load_dotenv('.env.local')

def detect_encoding(file_path):
    """
    Detecta o encoding de um arquivo.
    
    Args:
        file_path (str): Caminho do arquivo.
        
    Returns:
        str: Encoding detectado.
    """
    result = from_path(file_path).best()
    return result.encoding if result else "utf-8"

def process_and_upload_book_to_pinecone(file_path, chunk_size=1000, chunk_overlap=200, batch_size=100):
    """
    Processa um livro (arquivo de texto) dividindo-o em chunks menores,
    gera embeddings e faz upload para o Pinecone.
    
    Args:
        file_path (str): Caminho do arquivo do livro em formato texto.
        chunk_size (int, optional): Tamanho de cada chunk de texto. Padrão é 1000.
        chunk_overlap (int, optional): Quantidade de sobreposição entre chunks. Padrão é 200.
        batch_size (int, optional): Tamanho do lote para upload. Padrão é 100.
    """
    pinecone_service = PineconeService()
    openai_service = OpenAIService()
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"O arquivo {file_path} não foi encontrado.")
    
    encoding = detect_encoding(file_path)
    print(f"Usando encoding: {encoding} para o arquivo: {file_path}")
    
    with open(file_path, 'r', encoding=encoding) as file:
        book_text = file.read()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.split_text(book_text)
    
    vectors = []
    for idx, chunk in enumerate(chunks):
        embedding = openai_service.create_embedding(chunk)
        vector_id = str(uuid.uuid4())  
        vectors.append({'id': vector_id, 'values': embedding})
        
        if len(vectors) >= batch_size:
            pinecone_service.upsert(vectors)
            vectors = []
    
    if vectors:
        pinecone_service.upsert(vectors)
    
    print(f"Upload do livro {file_path} concluído com sucesso!")

if __name__ == "__main__":
    # Exemplo de uso
    # process_and_upload_book_to_pinecone("caminho/para/seu/livro.txt")
