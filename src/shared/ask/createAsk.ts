type Prompt = typeof prompt;

export const createAsk = (prompt: Prompt) =>
  async (message: string): Promise<string> => {
    const data = await prompt(message);
    return data ?? "";
  };
