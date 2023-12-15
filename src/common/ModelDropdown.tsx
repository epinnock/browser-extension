import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { selectedModel, updateSettings } = useAppState((state) => ({
    selectedModel: state.settings.selectedModel,
    updateSettings: state.settings.actions.update,
  }));

  const { openAIKey } = useAppState((state) => ({
    openAIKey: state.settings.openAIKey,
  }));

  if (!openAIKey) return null;

  return (
    // Chakra UI Select component
    <Select
      value={selectedModel || ''}
      onChange={(e) => updateSettings({ selectedModel: e.target.value })}
    >
      <option value='gpt-3.5-turbo'>GPT-3.5 Turbo</option>
      <option value='gpt-3.5-turbo-16k'>GPT-3.5 Turbo (16k)</option>
      <option value='gpt-4'>GPT-4</option>
      <option value='gpt-4-1106-preview'>GPT-4 Turbo (128k)</option>
      <option value='gpt-4-vision-preview'>GPT-4 Vision Turbo (128k)</option>
      <option value='NurtureAI/OpenHermes-2.5-Mistral-7B-16k'>Open Hermes 2.5 (Local)</option>
      <option value='microsoft/Orca-2-13b'>Orca 2</option>
      <option value='TheBloke/agentlm-70B-AWQ'>AgentLM (Local)</option>
    </Select>
  );
};

export default ModelDropdown;
