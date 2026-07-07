import { getArkanaByNumber } from '../numerology/arkana';
import type { ArkanaInfo } from '../numerology/types';

export function getRandomDailyCard(): ArkanaInfo {
  // Gunakan tanggal hari ini sebagai seed agar kartu sama sepanjang hari
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Pilih kartu Major Arcana (nomor 0-21)
  const cardNumber = seed % 22;
  return getArkanaByNumber(cardNumber);
}