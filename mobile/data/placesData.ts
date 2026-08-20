export const CATEGORIES = [
  { id: "all", name: "Todos", icon: "grid-outline" },
  { id: "academico", name: "Acadêmico", icon: "school-outline" },
  { id: "administrativo", name: "Administrativo", icon: "business-outline" },
  { id: "agricola", name: "Agrícola", icon: "leaf-outline" },
  { id: "alimentacao", name: "Alimentação", icon: "restaurant-outline" },
  { id: "alojamento", name: "Alojamento", icon: "bed-outline" },
  { id: "animais", name: "Animais", icon: "paw-outline" },
  { id: "biblioteca", name: "Biblioteca", icon: "library-outline" },
  { id: "comercio", name: "Comércio", icon: "storefront-outline" },
  { id: "esporte", name: "Esporte", icon: "basketball-outline" },
  { id: "hospedagem", name: "Hospedagem", icon: "home-outline" },
  { id: "lazer", name: "Lazer", icon: "happy-outline" },
  { id: "saude", name: "Saúde", icon: "medical-outline" },
  { id: "seguranca", name: "Segurança", icon: "shield-outline" },
  { id: "servico", name: "Serviço", icon: "construct-outline" },
  { id: "teatro", name: "Teatro", icon: "film-outline" },
];

export const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    academico: "school-outline",
    administrativo: "business-outline",
    agricola: "leaf-outline",
    alimentacao: "restaurant-outline",
    alojamento: "bed-outline",
    animais: "paw-outline",
    biblioteca: "library-outline",
    comercio: "storefront-outline",
    esporte: "basketball-outline",
    hospedagem: "home-outline",
    lazer: "happy-outline",
    saude: "medical-outline",
    seguranca: "shield-outline",
    servico: "construct-outline",
    teatro: "film-outline",
  };
  return iconMap[category.toLowerCase()] || "location-outline";
};

export const PLACES_DATA: any[] = [];
