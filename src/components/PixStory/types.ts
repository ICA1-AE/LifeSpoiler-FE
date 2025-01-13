export interface SelectedOptions {
  custom: boolean;
  [key: string]: boolean;
}

export interface FormData {
  characterName: string;
  gender: string;
  genre: string;
}

export interface EditorState {
  input: string;
  suggestions: string[];
  customText: string;
  selectedOptions: SelectedOptions;
}

export interface NovelResponse {
  captions: { [key: number]: string };
  novel: string;
}

export interface PixStoryData {
  metadata: FormData | null;
  captions: { [key: number]: string };
  novel: string;
}