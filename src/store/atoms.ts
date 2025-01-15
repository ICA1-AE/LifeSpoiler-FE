import { atom } from 'recoil';

export const openAIKeyState = atom<string>({
  key: 'openAIKeyState',
  default: '',
});

export const userNameState = atom<string>({
  key: 'userNameState',
  default: '',
});