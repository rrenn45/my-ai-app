'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import DogImage from '@/components/dogImage';
import CalcWrapper from '@/components/calculatorWrapper';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      deploy: {
        description: 'Deploy repository to vercel',
        parameters: z.object({
          repositoryName: z
            .string()
            .describe('The name of the repository, example: vercel/ai-chatbot'),
        }),
        generate: async function* ({ repositoryName }) {
          yield <div>Cloning repository {repositoryName}...</div>; // [!code highlight:5]
          await new Promise(resolve => setTimeout(resolve, 3000));
          yield <div>Building repository {repositoryName}...</div>;
          await new Promise(resolve => setTimeout(resolve, 2000));
          return <div className="font-bold border rounded">{repositoryName} deployed!</div>;
        },
      },
      getDogImage :{
        description:"Display image of a dog specific dog breed",
        parameters:z.object({
          breed: z
          .string()
          .describe(`The name of the specific breed, example: husky, lab, pit bull`),
        }),
        generate:async function* ({breed}){
          yield <div>Fetching image of a {breed}...</div>
          return <DogImage breed={breed}/>
        }
      },
      calculator:{
        description:"Render a calculator",
        parameters: z.object({
          calcuator:z.string().describe("A calculator component")
        }),
        generate:async function* (){
          yield <div>Building calculator...</div>
          return <CalcWrapper />

        }

      }
      
    },
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}