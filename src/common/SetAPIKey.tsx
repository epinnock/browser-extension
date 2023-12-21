import { Button, Input, VStack, Text, Link, HStack } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { updateSettings } = useAppState((state) => ({
    updateSettings: state.settings.actions.update,
  }));
  const currentOpenAIkey = useAppState((state) => state.settings.openAIKey);
  const currentGeminikey = useAppState((state) => state.settings.geminiKey);

  const [openAIKey, setOpenAIKey] = React.useState(currentOpenAIkey);
  const [showPassword, setShowPassword] = React.useState(false);
  const [geminiKey, setGeminiKey] = React.useState(currentGeminikey);
  const [showGeminiKey, setShowGeminiKey] = React.useState(false);

  return (
    <VStack spacing={4}>
      <Text fontSize="sm">
        You'll need an API Key to run in developer mode. If you
        don't already have one available, you can create one in your{' '}
        <Link
          href="https://platform.openai.com/account/api-keys"
          color="blue"
          isExternal
        >
          OpenAI account
        </Link>
        .
        <br />
        <br />
        Fulcrum stores your API key locally and securely, and it is only used to
        communicate with the OpenAI API.
      </Text>
      <HStack w="full">
        <Input
          placeholder="OpenAI API Key"
          value={openAIKey}
          onChange={(event) => setOpenAIKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <HStack w="full">
        <Input
          placeholder="Gemini API Key"
          value={geminiKey}
          onChange={(event) => setGeminiKey(event.target.value)}
          type={showGeminiKey ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowGeminiKey(!showGeminiKey)}
          variant="outline"
        >
          {showGeminiKey ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <Button
        onClick={() => updateSettings({ openAIKey, geminiKey, showSettings:false})}
        w="full"
        disabled={!(openAIKey||geminiKey)}
        colorScheme="blue"
      >
        Save
      </Button>
    </VStack>
  );
};

export default ModelDropdown;
