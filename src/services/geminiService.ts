import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  conditions: string[]; // e.g., "Diabetes", "Hígado Graso", "Niño", "Adulto"
  goals: string[];
}

export interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string; // Low glycemic focus
  fats: string; // Healthy fats focus
  fiber: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  nutritionalInfo: NutritionalInfo;
  prepTime: string;
  recommendedTime: string; // e.g., "07:30 AM"
  suggestedDrink: string;
  nutritionalValueExplanation: string;
  motivationalQuote: string;
}

export interface DailyMenu {
  day: number;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snacks: Recipe[];
  };
}

export interface WeeklyPlan {
  weekNumber: number;
  days: DailyMenu[];
  shoppingList: { item: string; category: string; amount: string }[];
}

export async function generateWeeklyPlan(family: FamilyMember[], weekNumber: number): Promise<WeeklyPlan> {
  const familyDescription = family.map(m => `${m.name} (${m.age} años, condiciones: ${m.conditions.join(", ")})`).join("; ");
  
  const recipeSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            amount: { type: Type.STRING }
          },
          required: ["item", "amount"]
        }
      },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      nutritionalInfo: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.STRING },
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          fats: { type: Type.STRING },
          fiber: { type: Type.STRING }
        },
        required: ["calories", "protein", "carbs", "fats", "fiber"]
      },
      prepTime: { type: Type.STRING },
      recommendedTime: { type: Type.STRING },
      suggestedDrink: { type: Type.STRING },
      nutritionalValueExplanation: { type: Type.STRING },
      motivationalQuote: { type: Type.STRING }
    },
    required: ["title", "description", "ingredients", "instructions", "nutritionalInfo", "prepTime", "recommendedTime", "suggestedDrink", "nutritionalValueExplanation", "motivationalQuote"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Genera un plan de alimentación semanal (5 días) para una familia en Santa Cruz, Bolivia. 
    Contexto familiar: ${familyDescription}. 
    Semana número: ${weekNumber} (de un ciclo de 4 semanas).
    
    REQUISITOS ESTRICTOS:
    1. Ingredientes fáciles de conseguir en mercados de Santa Cruz, Bolivia (ej: yuca, arroz, pollo, verduras locales). Sin ingredientes raros.
    2. Adaptado para Diabetes y Hígado Graso (bajo índice glucémico, grasas saludables).
    3. Cantidades exactas para 5 personas.
    4. Incluir bebidas sugeridas (infusiones, jugos naturales sin azúcar).
    5. Explicación nutricional y frase motivadora por receta.
    6. Lista de compras consolidada.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                meals: {
                  type: Type.OBJECT,
                  properties: {
                    breakfast: recipeSchema,
                    lunch: recipeSchema,
                    dinner: recipeSchema,
                    snacks: {
                      type: Type.ARRAY,
                      items: recipeSchema
                    }
                  },
                  required: ["breakfast", "lunch", "dinner", "snacks"]
                }
              },
              required: ["day", "meals"]
            }
          },
          shoppingList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                category: { type: Type.STRING },
                amount: { type: Type.STRING }
              },
              required: ["item", "category", "amount"]
            }
          }
        },
        required: ["weekNumber", "days", "shoppingList"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
