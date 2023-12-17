import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';
import modelData from '../assets/json/models.json';

const ModelDropdown = () => {
  const { selectedModel, updateSettings } = useAppState((state) => ({
    selectedModel: state.settings.selectedModel,
    updateSettings: state.settings.actions.update,
  }));



  return (
    // Chakra UI Select component
    <Select
      value={selectedModel || ''}
      onChange={(e) => updateSettings({ selectedModel: e.target.value })}
    >
      {modelData.map((model) => (
        <option key={model.name} value={model}>
          {model.displayName}
        </option>
      ))}
    </Select>
  );
};

export default ModelDropdown;

