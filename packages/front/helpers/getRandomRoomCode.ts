import { customAlphabet } from "nanoid";

export const getRandomRoomCode = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  return customAlphabet(alphabet, 6)();
};
