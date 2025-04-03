import { StreamData } from 'ai';

import { runAgent } from '@/ai/agent';
import { models } from '@/ai/models';
import { auth } from '@/app/(auth)/auth';
import {
  getChatById,
  saveChat,
  saveMessages,
} from '@/db/queries';
import { generateUUID } from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    message,
    modelId,
  }: { id: string; message: string; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const userMessage = {
    role: 'user',
    content: message,
    id: generateUUID(),
    createdAt: new Date(),
  };

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ 
      message: {
        role: 'user',
        content: message,
      }
    });
    await saveChat({ id, userId: session.user.id, title });
  }

  // Salvar a mensagem do usuário
  await saveMessages({
    messages: [
      { ...userMessage, chatId: id },
    ],
  });

  // Preparar streaming de dados
  const streamingData = new StreamData();

  // Executar o agente com onFinish para lidar com a resposta completa
  const result = await runAgent({
    model: model.apiIdentifier,
    prompt: message,
    streamingData,
    maxSteps: 5,
    chatId: id,
    userId: session.user.id,
  });

  // O salvamento da resposta será feito através da função runAgent
  // que já tem o onFinish configurado para fechar o streaming

  return result.toDataStreamResponse({
    data: streamingData,
  });
} 