export type City = {
  id: string;
  name: string;
  available?: boolean;
};

export const cities: City[] = [
  { id: "le-havre", name: "Le Havre", available: true },
  { id: "rouen", name: "Rouen" },
  { id: "caen", name: "Caen" },
  { id: "paris", name: "Paris" },
];

export const defaultCityId = "le-havre";

export function getCityById(cityId: string) {
  return cities.find((city) => city.id === cityId) ?? cities[0];
}
