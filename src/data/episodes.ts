import type { EpisodeData } from '@/types'

/**
 * รายการ Episode ในเกม Ragnarok Online
 *
 * ข้อมูล EP12–20 จาก iRO Wiki: https://irowiki.org/wiki/Episode
 *
 * EP12 เป็นจุดเริ่มต้นของยุค Renewal (EP1–11 เป็นยุค Pre-Renewal)
 */
export const episodes: EpisodeData[] = [
  // ── Pre-Renewal ────────────────────────────────────────────────────────────
  // (EP 1–11 ยุค Pre-Renewal — iRO wiki ไม่ได้ document episode names ไว้)
  // เพิ่มได้ในภายหลังตามต้องการ

  // ── Renewal Era ────────────────────────────────────────────────────────────
  {
    id: '12',
    episode: 12,
    sub: null,
    name: 'Nightmare of Midgard',
  },
  {
    id: '13.1',
    episode: 13,
    sub: 1,
    name: 'Ash Vacuum',
  },
  {
    id: '13.2',
    episode: 13,
    sub: 2,
    name: 'Encounter with the Unknown',
  },
  {
    id: '13.3',
    episode: 13,
    sub: 3,
    name: 'El Dicastes',
  },
  {
    id: '14.1',
    episode: 14,
    sub: 1,
    name: 'Bifrost',
  },
  {
    id: '14.2',
    episode: 14,
    sub: 2,
    name: 'Eclage',
  },
  {
    id: '14.3',
    episode: 14,
    sub: 3,
    name: 'Decisive Battle',
  },
  {
    id: '15.1',
    episode: 15,
    sub: 1,
    name: 'To Phantasmagorika!',
  },
  {
    id: '15.2',
    episode: 15,
    sub: 2,
    name: 'Memory Record',
  },
  {
    id: '16.1',
    episode: 16,
    sub: 1,
    name: 'The Royal Banquet',
  },
  {
    id: '16.2',
    episode: 16,
    sub: 2,
    name: 'Terra Gloria',
  },
  {
    id: '17.1',
    episode: 17,
    sub: 1,
    name: 'Illusion',
  },
  {
    id: '17.2',
    episode: 17,
    sub: 2,
    name: 'Legacy of the Wise One',
  },
  {
    id: '18',
    episode: 18,
    sub: null,
    name: 'Direction of Prayer',
  },
  {
    id: '19',
    episode: 19,
    sub: null,
    name: 'Issgard, Land of Snow Flowers',
  },
  {
    id: '20',
    episode: 20,
    sub: null,
    name: 'Undying',
  },
]

/** กรอง sub-episodes ทั้งหมดของ episode หลักที่ระบุ */
export function getSubEpisodes(episode: number) {
  return episodes.filter((e) => e.episode === episode && e.sub !== null)
}

/** หา episode data จาก id เช่น '13.2' */
export function getEpisodeById(id: string) {
  return episodes.find((e) => e.id === id) ?? null
}
