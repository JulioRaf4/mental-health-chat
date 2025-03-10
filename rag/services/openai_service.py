import os
import openai

class OpenAIService:
    def __init__(self, api_key=None):
        """
        Inicializa o serviço da OpenAI.
        
        Args:
            api_key (str, optional): Chave de API da OpenAI. Se não fornecida, será buscada nas variáveis de ambiente.
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        
        if not self.api_key:
            raise ValueError("API key para OpenAI não está configurada corretamente.")
        
        openai.api_key = self.api_key
    
    def create_embedding(self, text, model="text-embedding-ada-002"):
        """
        Cria um embedding para o texto fornecido.
        
        Args:
            text (str): Texto para criar o embedding.
            model (str, optional): Modelo de embedding a ser usado. Padrão é "text-embedding-ada-002".
            
        Returns:
            list: Vetor de embedding.
        """
        response = openai.Embedding.create(
            input=text,
            model=model
        )
        return response['data'][0]['embedding']
    
    def create_chat_completion(self, messages, model="gpt-3.5-turbo", temperature=0.7, max_tokens=None):
        """
        Cria uma conclusão de chat usando a API da OpenAI.
        
        Args:
            messages (list): Lista de mensagens para a conversa.
            model (str, optional): Modelo a ser usado. Padrão é "gpt-3.5-turbo".
            temperature (float, optional): Temperatura para a geração. Padrão é 0.7.
            max_tokens (int, optional): Número máximo de tokens a serem gerados.
            
        Returns:
            dict: Resposta da API.
        """
        params = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }
        
        if max_tokens:
            params["max_tokens"] = max_tokens
        
        return openai.ChatCompletion.create(**params) 