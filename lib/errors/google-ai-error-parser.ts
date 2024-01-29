type GoogleAIError = {
  class: string;
  message: string;
};

/**
 * Try to parse an error as a GoogleAIError.
 * GoogleAIError has a message in the format of "[{class}] Error: {message}""
 * For example, "[GoogleGenerativeAI Error]: Text not available. Response was blocked due to SAFETY".
 * If we cannot parse the error, we throw the error out.
 */
export function tryParseErrorAsGoogleAIError(
  error: Error,
  purpose: 'conversation' | 'topic-generation' | 'taboos-generation'
): GoogleAIError {
  const message = error.message;
  const regex = /\[(?<class>.+) Error\]: (?<message>.+)/;
  const match = message.match(regex);
  if (!match?.groups) {
    throw error;
  }
  const { class: className, message: errorMessage } = match.groups;
  // If the key is in the message, return something generic as an error message
  if (errorMessage.includes('key')) {
    return {
      class: className,
      message: 'Taboo AI is experiencing high traffic. Please try again.',
    };
  }
  if (purpose === 'conversation') {
    return {
      class: className,
      message:
        CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES[
          Math.floor(Math.random() * CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES.length)
        ],
    };
  } else if (purpose === 'topic-generation') {
    return {
      class: className,
      message:
        TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES[
          Math.floor(Math.random() * TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES.length)
        ],
    };
  } else if (purpose === 'taboos-generation') {
    return {
      class: className,
      message:
        TABOOS_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES[
          Math.floor(Math.random() * TABOOS_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES.length)
        ],
    };
  }
  return {
    class: className,
    message: errorMessage,
  };
}

const CONVERSATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES: string[] = [
  "Remember, the goal is to make me guess the word, not make me cringe! Let's try a clue that's more descriptive and less...spicy.",
  "Hey, words have power! Let's choose some that build each other up instead of tearing down.",
  'We can still have fun without using those kinds of words. Plus, it makes the game more inclusive for everyone.',
  "Ouch, my circuits aren't built for that kind of vocabulary! Can we please stick to the family-friendly stuff?",
  "My code might be buggy, but at least I know how to be courteous! Let's keep the clues clean, shall we?",
  "I think I just blue-screened from that clue! Let's rewind and try a different one, my sensors can't handle that heat.",
];

const TOPIC_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES: string[] = [
  "Remember, everyone's here to have a fun and safe word-play adventure! Let's pick a topic that everyone can enjoy and feel comfortable with.",
  'Words have power, and even in Taboo, we can choose those that inspire and uplift rather than…well, the opposite. How about we pick a theme that celebrates the good stuff?',
  "Hey, let's be mindful of others! Let's choose a topic that brings us closer together, not one that might build fences.",
  "Yikes, my circuits just sparked from that one! My apologies, but I think I need a topic that's a bit less…controversial for my delicate system.",
  "Hmm, that one might be a bit too spicy for my vocabulary database. How about we choose something that won't make me overheat and malfunction?",
  "My code may be witty, but it's not built for handling topics that could cause emotional earthquakes. Let's pick something a little less…earth-shattering, shall we?",
  "Hold on, I think my word filter kicked in! Let's switch gears and pick a different theme, one that sparks joy, not…well, you know. ",
];

const TABOOS_GENERATION_HARMFUL_CONTENT_ERROR_MESSAGE_CHOICES: string[] = [
  "Remember, everyone's here to have a fun and safe word-play adventure! Let's pick taboo words that everyone can enjoy and feel comfortable with.",
  'Words have power, and even in Taboo, we can choose those that inspire and uplift rather than…well, the opposite. How about we pick taboo words that celebrate the good stuff?',
  "Hey, let's be mindful of others! Let's choose taboo words that bring us closer together, not ones that might build fences.",
  'Yikes, my circuits just sparked from that one! My apologies, but I think I need taboo words that are a bit less…controversial for my delicate system.',
  "Hmm, that one might be a bit too spicy for my vocabulary database. How about we choose taboo words that won't make me overheat and malfunction?",
  "My code may be witty, but it's not built for handling taboo words that could cause emotional earthquakes. Let's pick taboo words that are a little less…earth-shattering, shall we?",
  "Hold on, I think my word filter kicked in! Let's switch gears and pick different taboo words, ones that spark joy, not…well, you know. ",
];
