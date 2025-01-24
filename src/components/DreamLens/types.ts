export interface SelectedOptions {
  custom: boolean;
  [key: string]: boolean;
}

export interface FormData {
  dream: string;
  customText: string;
  selectedSuggestions: string[];
  selectedOptions: SelectedOptions;
}

export interface EditorState {
  input: string;
  suggestions: string[];
  customText: string;
  selectedOptions: SelectedOptions;
  jobTitle?: string;
  jobActions?: string[];
}

export interface CreateStoryModalData {
  userName: string;
}

export interface StoryResponse {
  story: string;
}

export interface DreamLensImage {
  url: string;
  revisedPrompt: string;
}

export interface DreamLensData {
  userName: string;
  jobTitle: string;
  selectedActions: string[];
  images: DreamLensImage[];
  story: string;
}