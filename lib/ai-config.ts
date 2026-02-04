import { openai } from "@ai-sdk/openai"

// Configuracao do modelo AI usando o Vercel AI Gateway
// No v0, o AI Gateway e configurado automaticamente
export function model(modelId: string) {
  // Remove o prefixo do provider se existir (ex: "openai/gpt-4o-mini" -> "gpt-4o-mini")
  const cleanModelId = modelId.includes("/") ? modelId.split("/")[1] : modelId
  
  return openai(cleanModelId)
}
