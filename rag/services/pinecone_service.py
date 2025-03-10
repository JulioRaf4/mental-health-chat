"""
Serviço para gerenciar a conexão com o Pinecone.
"""
import os
from pinecone import Pinecone, ServerlessSpec

class PineconeService:
    def __init__(self, api_key=None, index_name='mentalhealth'):
        """
        Inicializa o serviço do Pinecone.
        
        Args:
            api_key (str, optional): Chave de API do Pinecone. Se não fornecida, será buscada nas variáveis de ambiente.
            index_name (str, optional): Nome do índice do Pinecone. Padrão é 'mentalhealth'.
        """
        self.api_key = api_key or os.getenv('PINECONE_API_KEY')
        
        if not self.api_key:
            raise ValueError("API key para Pinecone não está configurada corretamente.")
        
        self.index_name = index_name
        self.client = Pinecone(api_key=self.api_key)
        self.index = self._get_or_create_index()
    
    def _get_or_create_index(self):
        """
        Obtém ou cria um índice no Pinecone.
        
        Returns:
            Index: Objeto de índice do Pinecone.
        """
        if self.index_name not in self.client.list_indexes().names():
            self.client.create_index(
                name=self.index_name,
                dimension=1536,  
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
        
        return self.client.Index(self.index_name)
    
    def upsert(self, vectors):
        """
        Insere ou atualiza vetores no índice do Pinecone.
        
        Args:
            vectors (list): Lista de vetores a serem inseridos ou atualizados.
                Cada vetor deve ser um dicionário com 'id' e 'values'.
        """
        if vectors:
            self.index.upsert(vectors=vectors)
    
    def query(self, vector, top_k=5, include_metadata=True):
        """
        Consulta o índice do Pinecone por vetores similares.
        
        Args:
            vector (list): Vetor de consulta.
            top_k (int, optional): Número de resultados a retornar. Padrão é 5.
            include_metadata (bool, optional): Se deve incluir metadados. Padrão é True.
            
        Returns:
            dict: Resultados da consulta.
        """
        return self.index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=include_metadata
        )
    
    def delete(self, ids):
        """
        Exclui vetores do índice do Pinecone.
        
        Args:
            ids (list): Lista de IDs de vetores a serem excluídos.
        """
        self.index.delete(ids=ids)
    
    def delete_all(self):
        """
        Exclui todos os vetores do índice do Pinecone.
        """
        self.index.delete(delete_all=True) 