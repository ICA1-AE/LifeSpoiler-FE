export interface SelectedOptions {
  custom: boolean;
  [key: string]: boolean;
}

export interface FormData {
  dream: string;
  customText: string;
  selectedSuggestions: string[];
}

export interface EditorState {
  input: string;
  suggestions: string[];
  customText: string;
  selectedOptions: SelectedOptions;
}