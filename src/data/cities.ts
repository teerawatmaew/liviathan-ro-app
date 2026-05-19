import type { CityData } from '@/types'

/**
 * รายชื่อเมืองทั้งหมดในเกม Ragnarok Online
 *
 * region:
 *   rune-midgarts — ราชอาณาจักร Rune-Midgarts (ทวีปหลัก ฝั่งตะวันตก)
 *   schwarzwald   — สาธารณรัฐ Schwarzwald (ทวีปหลัก ฝั่งตะวันออก)
 *   arunafeltz    — รัฐ Arunafeltz (ทวีปหลัก ฝั่งใต้)
 *   new-world     — โลกใหม่ (Midgard Continent 2)
 *   issgard       — ทวีป Issgard EP19 (Land of Snow Flowers)
 *   other         — เมืองธีมพิเศษ / เกาะ / มิติอื่น
 */
export const cities: CityData[] = [
  // ── Rune-Midgarts Kingdom ────────────────────────────────────────────────
  { id: 'prontera',   name: 'Prontera',   region: 'rune-midgarts' },
  { id: 'izlude',     name: 'Izlude',     region: 'rune-midgarts' },
  { id: 'geffen',     name: 'Geffen',     region: 'rune-midgarts' },
  { id: 'morroc',     name: 'Morroc',     region: 'rune-midgarts' },
  { id: 'payon',      name: 'Payon',      region: 'rune-midgarts' },
  { id: 'alberta',    name: 'Alberta',    region: 'rune-midgarts' },
  { id: 'aldebaran',  name: 'Aldebaran',  region: 'rune-midgarts' },
  { id: 'lutie',      name: 'Lutie',      region: 'rune-midgarts' },
  { id: 'comodo',     name: 'Comodo',     region: 'rune-midgarts' },
  { id: 'umbala',     name: 'Umbala',     region: 'rune-midgarts' },
  { id: 'niflheim',   name: 'Niflheim',   region: 'rune-midgarts' },
  { id: 'jawaii',     name: 'Jawaii',     region: 'rune-midgarts' },

  // ── Schwarzwald Republic ─────────────────────────────────────────────────
  { id: 'yuno',        name: 'Yuno',        region: 'schwarzwald' },
  { id: 'einbroch',    name: 'Einbroch',    region: 'schwarzwald' },
  { id: 'einbech',     name: 'Einbech',     region: 'schwarzwald' },
  { id: 'lighthalzen', name: 'Lighthalzen', region: 'schwarzwald' },
  { id: 'hugel',       name: 'Hugel',       region: 'schwarzwald' },

  // ── Arunafeltz States ────────────────────────────────────────────────────
  { id: 'rachel',  name: 'Rachel',  region: 'arunafeltz' },
  { id: 'veins',   name: 'Veins',   region: 'arunafeltz' },

  // ── New World ────────────────────────────────────────────────────────────
  { id: 'manuk',      name: 'Manuk',      region: 'new-world' },
  { id: 'splendide',  name: 'Splendide',  region: 'new-world' },
  { id: 'mora',       name: 'Mora',       region: 'new-world' },
  { id: 'el_dicastes', name: 'El Dicastes', region: 'new-world' },
  { id: 'eclage',     name: 'Eclage',     region: 'new-world' },

  // ── Issgard (EP19 — Land of Snow Flowers) ────────────────────────────────
  { id: 'ice_castle', name: 'Ice Castle', region: 'issgard' },

  // ── Other (themed / island / special dimension) ──────────────────────────
  { id: 'amatsu',    name: 'Amatsu',    region: 'other' },
  { id: 'gonryun',   name: 'Gonryun',   region: 'other' },
  { id: 'louyang',   name: 'Louyang',   region: 'other' },
  { id: 'ayothaya',  name: 'Ayothaya',  region: 'other' },
  { id: 'moscovia',  name: 'Moscovia',  region: 'other' },
  { id: 'dewata',    name: 'Dewata',    region: 'other' },
  { id: 'malangdo',  name: 'Malangdo',  region: 'other' },
  { id: 'lasagna',   name: 'Lasagna',   region: 'other' },
]

/** กรองเฉพาะเมืองของ region ที่ระบุ */
export function getCitiesByRegion(region: CityData['region']) {
  return cities.filter((c) => c.region === region)
}
