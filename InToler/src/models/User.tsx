import { EnumValues } from "zod";

type User = {
    user_id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    foodPreferencies: EnumValues;
    photo: string;
}

export type { User };