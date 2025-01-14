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
  jobTitle?: string;
  jobActions?: string[];
}

export interface JobActionsResponse {
  actions: string[];
  job_title: string;
}

export interface CreateStoryModalData {
  userName: string;
  genre: string;
}

export interface StoryResponse {
  story: string;
}

export interface DreamLensData {
  userName: string;
  genre: string;
  jobTitle: string;
  story: string;
}