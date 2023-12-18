type GoogleAIError = {
  class: string;
  message: string;
};

/**
 * Try to parse an error as a GoogleAIError.
 * GoogleAIError has message in the format of "[{class}] Error: {message}""
 * For example: "[GoogleGenerativeAI Error]: Text not available. Response was blocked due to SAFETY".
 * If we cannot parse the error, we throw the error out.
 * @param error: Error
 * @returns GoogleAIError
 */
export function tryParseErrorAsGoogleAIError(error: Error): GoogleAIError {
  const message = error.message;
  const regex = /\[(?<class>.+) Error\]: (?<message>.+)/;
  const match = message.match(regex);
  if (!match?.groups) {
    throw error;
  }
  const { class: className, message: errorMessage } = match.groups;
  return {
    class: className,
    message: errorMessage,
  };
}
