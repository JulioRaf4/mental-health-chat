import { customModel } from '@/ai';
import { StreamData, streamText, tool } from 'ai';
import { z } from 'zod';
import { saveMessages } from '@/db/queries';
import { generateUUID, sanitizeResponseMessages } from '@/lib/utils';

/**
 * Tool para buscar informações na web
 */
const webSearchTool = tool({
  description: 'Search the web for information on a given query',
  parameters: z.object({
    query: z.string().describe('The search query'),
  }),
  execute: async ({ query }) => {
    // TODO: Implementar a busca na web
    // Simulando uma busca na web
    console.log(`Searching the web for: ${query}`);
    return `Results for "${query}" from web search (simulated response)`;
  },
});

/**
 * Tool para obter data e hora atual
 */
const dateTimeTool = tool({
  description: 'Get the current date and time',
  parameters: z.object({}),
  execute: async () => {
    const now = new Date();
    return `Current date and time: ${now.toLocaleString()}`;
  },
});

/**
 * Todos os tools disponíveis para o agente
 */
export const agentTools = {
  webSearch: webSearchTool,
  getDateTime: dateTimeTool,
};

// Definindo os tipos de ferramentas que podem ser usadas
export type AgentToolNames = keyof typeof agentTools;

/**
 * Sistema prompt para o agente
 */
export const agentSystemPrompt = `
You are a helpful agent that can use various tools to assist the user.
When the user asks a question or makes a request, analyze it carefully and determine which tool would be most helpful.
Think step by step about how to solve the user's problem using the available tools.
Important guidelines:
1. Be concise but thorough in your responses
2. Explain your reasoning when using tools
3. If you can't find an answer or solve a problem, explain why
4. Only use tools when necessary - if a question can be answered directly, do so
5. If multiple steps are needed, walk through each step clearly
`;

/**
 * Executa o agente usando o modelo selecionado
 */
export async function runAgent({
  model,
  prompt,
  streamingData,
  maxSteps = 5,
  chatId,
  userId,
}: {
  model: string;
  prompt: string;
  streamingData: StreamData;
  maxSteps?: number;
  chatId?: string;
  userId?: string;
}) {
  return streamText({
    model: customModel(model),
    system: agentSystemPrompt,
    prompt,
    maxTokens: 1024,
    temperature: 0.7,
    maxSteps,
    tools: agentTools,
    experimental_activeTools: ['webSearch', 'getDateTime'] as AgentToolNames[],
    onFinish: async ({ response }) => {
      // Salvar a mensagem do agente no banco de dados se temos chatId e userId
      if (chatId && userId) {
        try {
          const responseMessagesWithoutIncompleteToolCalls = 
            sanitizeResponseMessages(response.messages);
            
          // Salvar todas as mensagens do assistente
          const messagesToSave = responseMessagesWithoutIncompleteToolCalls
            .filter(msg => msg.role === 'assistant')
            .map(message => ({
              id: generateUUID(),
              chatId: chatId,
              role: message.role,
              content: message.content,
              createdAt: new Date(),
            }));
            
          if (messagesToSave.length > 0) {
            await saveMessages({
              messages: messagesToSave
            });
            console.log("Agent response saved to database");
          }
        } catch (error) {
          console.error("Failed to save agent response:", error);
        }
      }
      
      streamingData.close();
    },
  });
}
 