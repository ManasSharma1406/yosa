export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

export interface ClassSession {
    id: string;
    number: string;
    title: string;
    time: string;
    level: string;
    description: string;
}

export interface Instructor {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
}

export interface Testimonial {
    id: string;
    text: string;
    author: string;
    role?: string;
    image: string;
    countryCode?: string;
}