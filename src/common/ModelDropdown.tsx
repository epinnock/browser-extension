import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';
import modelData from '../assets/json/models.json';

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
      {modelData.map((model) => (
        <option key={model.name} value={model.name}>
          {model.displayName}
        </option>
      ))}
    </Select>
  );
};

export default ModelDropdown;

