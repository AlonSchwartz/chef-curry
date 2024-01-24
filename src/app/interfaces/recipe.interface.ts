export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: (string | string[])[];
    instructions: (string | string[])[];
    date?: Date | String;
    shareableHash?: string;
}