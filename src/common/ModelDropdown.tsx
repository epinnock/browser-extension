import React from 'react';
import { Select } from '@chakra-ui/react';
import { useAppState } from '../state/store';
import modelData from '../assets/json/models.json';
const ModelDropdown = () => {


    const { selectedModel, updateSettings } = useAppState((state) => ({
      selectedModel: state.settings.selectedModel,
      updateSettings: state.settings.actions.update,
    }));

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModel = modelData.find((model) => model.name === e.target.value);
      updateSettings({ selectedModel });
    };

    return (
      // Chakra UI Select component
      <Select
        value={selectedModel?.name || ''}
        onChange={handleModelChange}
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

