export type AiGenerateResult = {
  text: string;
};

type OllamaGenerateResponse =
  | {
      response: string;
      done?: boolean;
    }
  | {
      error: string;
    };

export async function generateWithOllama({
  prompt,
  signal,
}: {
  prompt: string;
  signal?: AbortSignal;
}): Promise<AiGenerateResult> {
  const res = await fetch('/ollama/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      model: 'llama3.1:8b',
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error('AI request failed');
  }

  const data = (await res.json()) as OllamaGenerateResponse;
  if ('error' in data) {
    throw new Error(data.error);
  }

  return { text: (data.response ?? '').trim() };
}
