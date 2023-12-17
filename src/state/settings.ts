import { MyStateCreator } from './store';
import { Model } from '../api/ResponseProvider';


export type SettingsSlice = {
  openAIKey: string | null;
  geminiKey: string | null;
  selectedModel: Model|null;
  showSettings: boolean;
  actions: {
    update: (values: Partial<SettingsSlice>) => void;
  };
};
export const createSettingsSlice: MyStateCreator<SettingsSlice> = (set) => ({
  openAIKey: null,
  selectedModel: null,
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
