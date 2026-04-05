// CE <-> Buddhist Era conversion helpers
// HosXP vstdate is stored as CE (e.g. 2024-01-15)
// Thai UI shows Buddhist Era (BE) = CE + 543

export function ceToBe(year: number): number {
  return year + 543
}

export function beToCe(year: number): number {
  return year - 543
}

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
]

export function getThaiMonthFull(monthIndex: number): string {
  return THAI_MONTHS_FULL[monthIndex] ?? ''
}

export function getThaiMonthShort(monthIndex: number): string {
  return THAI_MONTHS_SHORT[monthIndex] ?? ''
}

export function formatQty(qty: number): string {
  return qty.toLocaleString('th-TH', { maximumFractionDigits: 2 })
}
