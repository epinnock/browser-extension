import { MyStateCreator } from './store';

export type SettingsSlice = {
  openAIKey: string | null;
  geminiKey: string | null;
  selectedModel: string;
  showSettings: boolean;
  actions: {
    update: (values: Partial<SettingsSlice>) => void;
  };
};
export const createSettingsSlice: MyStateCreator<SettingsSlice> = (set) => ({
  openAIKey: null,
  selectedModel: 'gpt-3.5-turbo',
  geminiKey: null,
  showSettings: false,
  actions: {
    update: (values) => {
      set((state) => {
        state.settings = { ...state.settings, ...values };
      });
    },
  },
});
