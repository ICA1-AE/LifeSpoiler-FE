export interface SelectedOptions {
  custom: boolean;
  [key: string]: boolean;
}

export interface FormData {
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
  metadata: {
    characterName: string;
    genre: string;
  } | null;
  captions: { [key: number]: string };
  novel: string;
}