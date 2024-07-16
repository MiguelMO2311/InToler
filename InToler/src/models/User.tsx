import { EnumValues } from "zod";

type User = {
    user_id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    foodPreferencies: EnumValues;
    photo: string;
    allergies: string;
    intolerances:string;
}

export type { User };