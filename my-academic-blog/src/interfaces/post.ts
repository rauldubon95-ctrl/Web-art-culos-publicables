import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  
  // ✅ PROPIEDADES NUEVAS AGREGADAS (Solución del error)
  type?: string;     // Define si es 'editorial', 'articulo', 'ensayo', etc.
  section?: string;  // Define la categoría (ej: 'Tecnología y Sociedad')
};
