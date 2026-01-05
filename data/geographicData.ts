/**
 * Données géographiques pour l'application
 * RDC en priorité, ensuite alphabétique
 */

export interface City {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  cities: City[];
}

const COUNTRIES_DATA: Country[] = [
  {
    id: "cd",
    code: "CD",
    name: "République Démocratique du Congo (RDC)",
    cities: [
      { id: "kinshasa", name: "Kinshasa" },
      { id: "lubumbashi", name: "Lubumbashi" },
      { id: "goma", name: "Goma" },
      { id: "kisangani", name: "Kisangani" },
      { id: "bukavu", name: "Bukavu" },
      { id: "kolwezi", name: "Kolwezi" },
      { id: "kasumbalesa", name: "Kasumbalesa" },
      { id: "beni", name: "Beni" },
      { id: "bunia", name: "Bunia" },
      { id: "kikwit", name: "Kikwit" },
      { id: "tshikapa", name: "Tshikapa" },
      { id: "mbuji-mayi", name: "Mbuji-Mayi" },
      { id: "kalemie", name: "Kalemie" },
      { id: "manono", name: "Manono" },
      { id: "kabinda", name: "Kabinda" },
      { id: "bandundu", name: "Bandundu" },
      { id: "kasai", name: "Kasai" },
      { id: "uvira", name: "Uvira" },
    ],
  },
  {
    id: "ao",
    code: "AO",
    name: "Angola",
    cities: [
      { id: "luanda", name: "Luanda" },
      { id: "huambo", name: "Huambo" },
      { id: "benguela", name: "Benguela" },
      { id: "lobito", name: "Lobito" },
    ],
  },
  {
    id: "bj",
    code: "BJ",
    name: "Bénin",
    cities: [
      { id: "cotonou", name: "Cotonou" },
      { id: "porto-novo", name: "Porto-Novo" },
      { id: "parakou", name: "Parakou" },
    ],
  },
  {
    id: "bw",
    code: "BW",
    name: "Botswana",
    cities: [
      { id: "gaborone", name: "Gaborone" },
      { id: "francistown", name: "Francistown" },
    ],
  },
  {
    id: "bf",
    code: "BF",
    name: "Burkina Faso",
    cities: [
      { id: "ouagadougou", name: "Ouagadougou" },
      { id: "bobo-dioulasso", name: "Bobo-Dioulasso" },
    ],
  },
  {
    id: "bi",
    code: "BI",
    name: "Burundi",
    cities: [
      { id: "bujumbura", name: "Bujumbura" },
      { id: "gitega", name: "Gitega" },
    ],
  },
  {
    id: "cm",
    code: "CM",
    name: "Cameroun",
    cities: [
      { id: "douala", name: "Douala" },
      { id: "yaounde", name: "Yaoundé" },
      { id: "bamenda", name: "Bamenda" },
    ],
  },
  {
    id: "cv",
    code: "CV",
    name: "Cap-Vert",
    cities: [
      { id: "praia", name: "Praia" },
      { id: "mindelo", name: "Mindelo" },
    ],
  },
  {
    id: "cf",
    code: "CF",
    name: "Centrafrique",
    cities: [
      { id: "bangui", name: "Bangui" },
      { id: "berberati", name: "Berbérati" },
    ],
  },
  {
    id: "km",
    code: "KM",
    name: "Comores",
    cities: [
      { id: "moroni", name: "Moroni" },
      { id: "mutsamudu", name: "Mutsamudu" },
    ],
  },
  {
    id: "cg",
    code: "CG",
    name: "Congo",
    cities: [
      { id: "brazzaville", name: "Brazzaville" },
      { id: "pointe-noire", name: "Pointe-Noire" },
    ],
  },
  {
    id: "dj",
    code: "DJ",
    name: "Djibouti",
    cities: [
      { id: "djibouti", name: "Djibouti" },
      { id: "tadjourah", name: "Tadjourah" },
    ],
  },
  {
    id: "eg",
    code: "EG",
    name: "Égypte",
    cities: [
      { id: "cairo", name: "Le Caire" },
      { id: "alexandria", name: "Alexandrie" },
      { id: "giza", name: "Giza" },
    ],
  },
  {
    id: "gq",
    code: "GQ",
    name: "Guinée équatoriale",
    cities: [
      { id: "malabo", name: "Malabo" },
      { id: "bata", name: "Bata" },
    ],
  },
  {
    id: "er",
    code: "ER",
    name: "Érythrée",
    cities: [
      { id: "asmara", name: "Asmara" },
      { id: "massawa", name: "Massawa" },
    ],
  },
  {
    id: "et",
    code: "ET",
    name: "Éthiopie",
    cities: [
      { id: "addis-ababa", name: "Addis-Abeba" },
      { id: "dire-dawa", name: "Dire Dawa" },
    ],
  },
  {
    id: "ga",
    code: "GA",
    name: "Gabon",
    cities: [
      { id: "libreville", name: "Libreville" },
      { id: "port-gentil", name: "Port-Gentil" },
    ],
  },
  {
    id: "gm",
    code: "GM",
    name: "Gambie",
    cities: [
      { id: "banjul", name: "Banjul" },
      { id: "serekunda", name: "Serekunda" },
    ],
  },
  {
    id: "gh",
    code: "GH",
    name: "Ghana",
    cities: [
      { id: "accra", name: "Accra" },
      { id: "kumasi", name: "Kumasi" },
      { id: "sekondi-takoradi", name: "Sekondi-Takoradi" },
    ],
  },
  {
    id: "gn",
    code: "GN",
    name: "Guinée",
    cities: [
      { id: "conakry", name: "Conakry" },
      { id: "kindia", name: "Kindia" },
    ],
  },
  {
    id: "gw",
    code: "GW",
    name: "Guinée-Bissau",
    cities: [
      { id: "bissau", name: "Bissau" },
      { id: "bafata", name: "Bafata" },
    ],
  },
  {
    id: "ke",
    code: "KE",
    name: "Kenya",
    cities: [
      { id: "nairobi", name: "Nairobi" },
      { id: "mombasa", name: "Mombasa" },
      { id: "kisumu", name: "Kisumu" },
    ],
  },
  {
    id: "ls",
    code: "LS",
    name: "Lesotho",
    cities: [
      { id: "maseru", name: "Maseru" },
      { id: "leribe", name: "Leribe" },
    ],
  },
  {
    id: "lr",
    code: "LR",
    name: "Liberia",
    cities: [
      { id: "monrovia", name: "Monrovia" },
      { id: "gbarnga", name: "Gbarnga" },
    ],
  },
  {
    id: "ly",
    code: "LY",
    name: "Libye",
    cities: [
      { id: "tripoli", name: "Tripoli" },
      { id: "benghazi", name: "Benghazi" },
    ],
  },
  {
    id: "mg",
    code: "MG",
    name: "Madagascar",
    cities: [
      { id: "antananarivo", name: "Antananarivo" },
      { id: "toliara", name: "Toliara" },
    ],
  },
  {
    id: "mw",
    code: "MW",
    name: "Malawi",
    cities: [
      { id: "lilongwe", name: "Lilongwe" },
      { id: "blantyre", name: "Blantyre" },
    ],
  },
  {
    id: "ml",
    code: "ML",
    name: "Mali",
    cities: [
      { id: "bamako", name: "Bamako" },
      { id: "segou", name: "Ségou" },
    ],
  },
  {
    id: "mr",
    code: "MR",
    name: "Mauritanie",
    cities: [
      { id: "nouakchott", name: "Nouakchott" },
      { id: "nouadhibou", name: "Nouadhibou" },
    ],
  },
  {
    id: "mu",
    code: "MU",
    name: "Maurice",
    cities: [
      { id: "port-louis", name: "Port-Louis" },
      { id: "curepipe", name: "Curepipe" },
    ],
  },
  {
    id: "ma",
    code: "MA",
    name: "Maroc",
    cities: [
      { id: "casablanca", name: "Casablanca" },
      { id: "rabat", name: "Rabat" },
      { id: "fes", name: "Fès" },
      { id: "marrakech", name: "Marrakech" },
    ],
  },
  {
    id: "mz",
    code: "MZ",
    name: "Mozambique",
    cities: [
      { id: "maputo", name: "Maputo" },
      { id: "beira", name: "Beira" },
    ],
  },
  {
    id: "na",
    code: "NA",
    name: "Namibie",
    cities: [
      { id: "windhoek", name: "Windhoek" },
      { id: "walvis-bay", name: "Walvis Bay" },
    ],
  },
  {
    id: "ne",
    code: "NE",
    name: "Niger",
    cities: [
      { id: "niamey", name: "Niamey" },
      { id: "maradi", name: "Maradi" },
    ],
  },
  {
    id: "ng",
    code: "NG",
    name: "Nigéria",
    cities: [
      { id: "lagos", name: "Lagos" },
      { id: "abuja", name: "Abuja" },
      { id: "kano", name: "Kano" },
    ],
  },
  {
    id: "rw",
    code: "RW",
    name: "Rwanda",
    cities: [
      { id: "kigali", name: "Kigali" },
      { id: "gitarama", name: "Gitarama" },
    ],
  },
  {
    id: "st",
    code: "ST",
    name: "São Tomé-et-Príncipe",
    cities: [
      { id: "sao-tome", name: "São Tomé" },
      { id: "santo-antonio", name: "Santo António" },
    ],
  },
  {
    id: "sn",
    code: "SN",
    name: "Sénégal",
    cities: [
      { id: "dakar", name: "Dakar" },
      { id: "thiès", name: "Thiès" },
    ],
  },
  {
    id: "sc",
    code: "SC",
    name: "Seychelles",
    cities: [
      { id: "victoria", name: "Victoria" },
      { id: "anse-royale", name: "Anse Royale" },
    ],
  },
  {
    id: "sl",
    code: "SL",
    name: "Sierra Leone",
    cities: [
      { id: "freetown", name: "Freetown" },
      { id: "bo", name: "Bo" },
    ],
  },
  {
    id: "so",
    code: "SO",
    name: "Somalie",
    cities: [
      { id: "mogadishu", name: "Mogadiscio" },
      { id: "hargeisa", name: "Hargeisa" },
    ],
  },
  {
    id: "za",
    code: "ZA",
    name: "Afrique du Sud",
    cities: [
      { id: "johannesburg", name: "Johannesburg" },
      { id: "cape-town", name: "Le Cap" },
      { id: "durban", name: "Durban" },
      { id: "pretoria", name: "Pretoria" },
    ],
  },
  {
    id: "ss",
    code: "SS",
    name: "Soudan du Sud",
    cities: [
      { id: "juba", name: "Juba" },
      { id: "wau", name: "Wau" },
    ],
  },
  {
    id: "sd",
    code: "SD",
    name: "Soudan",
    cities: [
      { id: "khartoum", name: "Khartoum" },
      { id: "omdurman", name: "Omdurman" },
    ],
  },
  {
    id: "sz",
    code: "SZ",
    name: "Eswatini",
    cities: [
      { id: "mbabane", name: "Mbabane" },
      { id: "manzini", name: "Manzini" },
    ],
  },
  {
    id: "tz",
    code: "TZ",
    name: "Tanzanie",
    cities: [
      { id: "dar-es-salaam", name: "Dar es-Salaam" },
      { id: "dodoma", name: "Dodoma" },
    ],
  },
  {
    id: "tg",
    code: "TG",
    name: "Togo",
    cities: [
      { id: "lome", name: "Lomé" },
      { id: "sokode", name: "Sokodé" },
    ],
  },
  {
    id: "tn",
    code: "TN",
    name: "Tunisie",
    cities: [
      { id: "tunis", name: "Tunis" },
      { id: "sfax", name: "Sfax" },
    ],
  },
  {
    id: "ug",
    code: "UG",
    name: "Ouganda",
    cities: [
      { id: "kampala", name: "Kampala" },
      { id: "jinja", name: "Jinja" },
    ],
  },
  {
    id: "zm",
    code: "ZM",
    name: "Zambie",
    cities: [
      { id: "lusaka", name: "Lusaka" },
      { id: "ndola", name: "Ndola" },
    ],
  },
  {
    id: "zw",
    code: "ZW",
    name: "Zimbabwe",
    cities: [
      { id: "harare", name: "Harare" },
      { id: "bulawayo", name: "Bulawayo" },
    ],
  },
];

// Nationalités (avec RDC en premier)
export const NATIONALITIES = [
  "Congolaise (RDC)",
  "Angolaise",
  "Béninoise",
  "Botswanaise",
  "Burkinabé",
  "Burundaise",
  "Camerounaise",
  "Capverdienne",
  "Centrafricaine",
  "Comorienne",
  "Congolaise (Brazzaville)",
  "Djiboutienne",
  "Égyptienne",
  "Équatoguinéenne",
  "Érythréenne",
  "Éthiopienne",
  "Gabonaise",
  "Gambienne",
  "Ghanéenne",
  "Guinéenne",
  "Guinéenne-Bissauienne",
  "Kenyane",
  "Lesothane",
  "Libérienne",
  "Libyenne",
  "Malgache",
  "Malawienne",
  "Malienne",
  "Mauritanienne",
  "Mauricienne",
  "Marocaine",
  "Mozambicaine",
  "Namibienne",
  "Nigérienne",
  "Nigériane",
  "Rwandaise",
  "Santoméienne",
  "Sénégalaise",
  "Seychelloise",
  "Sierra-Léonaise",
  "Somalienne",
  "Sud-Africaine",
  "Sud-Soudanaise",
  "Soudanaise",
  "Swazie",
  "Tanzanienne",
  "Togolaise",
  "Tunisienne",
  "Ougandaise",
  "Zambienne",
  "Zimbabwéenne",
];

export const getCountriesList = (): Country[] => COUNTRIES_DATA;

export const getCountryById = (id: string): Country | undefined => {
  return COUNTRIES_DATA.find((c) => c.id === id);
};

export const getCitiesByCountry = (countryId: string): City[] => {
  const country = getCountryById(countryId);
  return country ? country.cities : [];
};
