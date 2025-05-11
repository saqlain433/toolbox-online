// 'use server';
/**
 * @fileOverview A flow that generates SEO descriptions for tools.
 *
 * - generateSeoDescription - A function that generates SEO descriptions.
 * - GenerateSeoDescriptionInput - The input type for the generateSeoDescription function.
 * - GenerateSeoDescriptionOutput - The return type for the generateSeoDescription function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoDescriptionInputSchema = z.object({
  toolName: z.string().describe('The name of the tool.'),
  toolDescription: z.string().describe('A detailed description of the tool.'),
});
export type GenerateSeoDescriptionInput = z.infer<typeof GenerateSeoDescriptionInputSchema>;

const GenerateSeoDescriptionOutputSchema = z.object({
  seoDescription: z.string().describe('An SEO-optimized description for the tool.'),
});
export type GenerateSeoDescriptionOutput = z.infer<typeof GenerateSeoDescriptionOutputSchema>;

export async function generateSeoDescription(input: GenerateSeoDescriptionInput): Promise<GenerateSeoDescriptionOutput> {
  return generateSeoDescriptionFlow(input);
}

const generateSeoDescriptionPrompt = ai.definePrompt({
  name: 'generateSeoDescriptionPrompt',
  input: {schema: GenerateSeoDescriptionInputSchema},
  output: {schema: GenerateSeoDescriptionOutputSchema},
  prompt: `You are an SEO expert tasked with generating a concise and engaging meta description for a website tool.

  Given the tool's name and a detailed description, craft a meta description that is between 100 and 150 words.

  The meta description should:
  - Accurately reflect the tool's functionality and purpose.
  - Incorporate relevant keywords to improve search engine visibility.
  - Be compelling enough to encourage users to click on the search result.
  - Be unique and distinct from other tool descriptions.

  Tool Name: {{{toolName}}}
  Tool Description: {{{toolDescription}}}

  SEO Meta Description:`,
});

const generateSeoDescriptionFlow = ai.defineFlow(
  {
    name: 'generateSeoDescriptionFlow',
    inputSchema: GenerateSeoDescriptionInputSchema,
    outputSchema: GenerateSeoDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateSeoDescriptionPrompt(input);
    return output!;
  }
);
