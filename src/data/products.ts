import productCar1 from "@/assets/product-car-1.jpg";
import productPhrase1 from "@/assets/product-phrase-1.jpg";
import productMinimal1 from "@/assets/product-minimal-1.jpg";
import productLifestyle1 from "@/assets/product-lifestyle-1.jpg";
import productCustom1 from "@/assets/product-custom-1.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  materials: string[];
  isPromo?: boolean;
  promoDiscount?: number;
  stockCount?: number;
}

export const products: Product[] = [
  {
    id: "porsche-911-gt3",
    name: "PORSCHE 911 GT3 RS",
    category: "Carros",
    categorySlug: "carros",
    price: 289,
    image: productCar1,
    description: "Perfil lateral icônico do Porsche 911 GT3 RS em fotografia P&B de alta definição. Presença absoluta na parede.",
    sizes: ["30x40cm", "40x60cm", "60x90cm", "80x120cm"],
    materials: ["Alumínio Premium", "MDF Alta Densidade"],
    isPromo: true,
    promoDiscount: 15,
    stockCount: 3,
  },
  {
    id: "hustle-typography",
    name: "HUSTLE",
    category: "Frases",
    categorySlug: "frases",
    price: 219,
    image: productPhrase1,
    description: "Tipografia bold em fundo negro. Para quem vive o que acredita. Statement puro.",
    sizes: ["30x40cm", "40x60cm", "60x90cm"],
    materials: ["Alumínio Premium", "MDF Alta Densidade"],
  },
  {
    id: "abstract-geometric",
    name: "GEOMETRIA ABSTRATA",
    category: "Minimalistas",
    categorySlug: "minimalistas",
    price: 249,
    image: productMinimal1,
    description: "Composição geométrica abstrata em tons de cinza e preto. Minimalismo com presença.",
    sizes: ["40x40cm", "60x60cm", "80x80cm"],
    materials: ["Alumínio Premium", "MDF Alta Densidade"],
  },
  {
    id: "urban-night",
    name: "URBAN NIGHT",
    category: "Lifestyle",
    categorySlug: "lifestyle",
    price: 269,
    image: productLifestyle1,
    description: "Fotografia urbana noturna com iluminação dramática. Cultura de rua capturada em alumínio.",
    sizes: ["30x40cm", "40x60cm", "60x90cm"],
    materials: ["Alumínio Premium", "MDF Alta Densidade"],
  },
  {
    id: "custom-collage",
    name: "COLLAGE PESSOAL",
    category: "Personalizados",
    categorySlug: "personalizados",
    price: 349,
    image: productCustom1,
    description: "Sua história em um quadro. Collage personalizado com suas melhores fotos em acabamento premium.",
    sizes: ["40x40cm", "60x60cm", "80x80cm"],
    materials: ["Alumínio Premium", "MDF Alta Densidade"],
  },
];

export const categories = [
  { name: "VELOCIDADE", slug: "carros", image: productCar1, tagline: "Para quem vive velocidade" },
  { name: "FRASES", slug: "frases-lifestyle", image: productPhrase1, tagline: "Para quem não aceita o comum" },
  { name: "ANIME", slug: "anime", image: productCustom1, tagline: "Para mentes que sonam" },
  { name: "AESTHETIC", slug: "aesthetic", image: productMinimal1, tagline: "Para ambientes com personalidade" },
  { name: "MINIMALISTA", slug: "minimalista", image: productLifestyle1, tagline: "Para mentes ambiciosas" },
  { name: "NATURAL", slug: "natural", image: productCar1, tagline: "Para quem busca equilíbrio" },
];

