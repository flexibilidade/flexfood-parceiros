export interface Province {
  name: string;
  cities: string[];
}

export const mozambiqueProvinces: Province[] = [
  {
    name: "Maputo Cidade",
    cities: ["Maputo"]
  },
  {
    name: "Maputo Província",
    cities: [
      "Matola",
      "Boane",
      "Marracuene",
      "Manhiça",
      "Magude",
      "Moamba",
      "Namaacha"
    ]
  },
  {
    name: "Gaza",
    cities: [
      "Xai-Xai",
      "Chókwè",
      "Chibuto",
      "Bilene",
      "Manjacaze",
      "Massingir",
      "Guijá",
      "Mabalane",
      "Chicualacuala",
      "Massangena",
      "Chigubo"
    ]
  },
  {
    name: "Inhambane",
    cities: [
      "Inhambane",
      "Maxixe",
      "Vilanculos",
      "Massinga",
      "Homoíne",
      "Inharrime",
      "Jangamo",
      "Zavala",
      "Funhalouro",
      "Panda",
      "Morrumbene",
      "Govuro"
    ]
  },
  {
    name: "Sofala",
    cities: [
      "Beira",
      "Dondo",
      "Nhamatanda",
      "Búzi",
      "Gorongosa",
      "Muanza",
      "Chemba",
      "Machanga",
      "Chibabava",
      "Marromeu"
    ]
  },
  {
    name: "Manica",
    cities: [
      "Chimoio",
      "Gondola",
      "Manica",
      "Báruè",
      "Sussundenga",
      "Macate",
      "Tambara",
      "Guro",
      "Machaze",
      "Mossurize"
    ]
  },
  {
    name: "Tete",
    cities: [
      "Tete",
      "Moatize",
      "Cahora Bassa",
      "Angónia",
      "Tsangano",
      "Macanga",
      "Changara",
      "Maravia",
      "Zumbo",
      "Magoe",
      "Mutarara",
      "Chiuta",
      "Dôa"
    ]
  },
  {
    name: "Zambézia",
    cities: [
      "Quelimane",
      "Mocuba",
      "Gurué",
      "Milange",
      "Alto Molócuè",
      "Namacurra",
      "Nicoadala",
      "Maganja da Costa",
      "Inhassunge",
      "Mopeia",
      "Chinde",
      "Luabo",
      "Morrumbala",
      "Ile",
      "Namarroi",
      "Gilé",
      "Pebane"
    ]
  },
  {
    name: "Nampula",
    cities: [
      "Nampula",
      "Nacala",
      "Ilha de Moçambique",
      "Angoche",
      "Monapo",
      "Mossuril",
      "Murrupula",
      "Ribaué",
      "Malema",
      "Meconta",
      "Mogovolas",
      "Mongincual",
      "Nacarôa",
      "Mecubúri",
      "Eráti",
      "Lalaua",
      "Rapale",
      "Fernão Veloso",
      "Larde",
      "Memba",
      "Nacala-a-Velha"
    ]
  },
  {
    name: "Cabo Delgado",
    cities: [
      "Pemba",
      "Montepuez",
      "Mueda",
      "Mocímboa da Praia",
      "Palma",
      "Macomia",
      "Quissanga",
      "Metuge",
      "Chiúre",
      "Ancuabe",
      "Balama",
      "Namuno",
      "Meluco",
      "Nangade",
      "Muidumbe",
      "Negomano"
    ]
  },
  {
    name: "Niassa",
    cities: [
      "Lichinga",
      "Cuamba",
      "Mandimba",
      "Metarica",
      "Sanga",
      "Majune",
      "Ngauma",
      "Maúa",
      "Nipepe",
      "Mecanhelas",
      "Chimbonila",
      "Muembe",
      "N'gauma",
      "Lago"
    ]
  }
];

export const getProvinceNames = (): string[] => {
  return mozambiqueProvinces.map(province => province.name);
};

export const getCitiesByProvince = (provinceName: string): string[] => {
  const province = mozambiqueProvinces.find(p => p.name === provinceName);
  return province ? province.cities : [];
};

export const getAllCities = (): string[] => {
  return mozambiqueProvinces.flatMap(province => province.cities);
};