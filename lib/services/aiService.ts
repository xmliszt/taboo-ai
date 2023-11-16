import ILevel from '../types/level.type';
import _, { uniqueId } from 'lodash';
import { CONSTANTS } from '../constants';
import { formatResponseTextIntoArray } from '../utilities';
import IWord from '../types/word.type';
import moment from 'moment';
import { DateUtils } from '../utils/dateUtils';
import { Run } from 'openai/resources/beta/threads/runs/runs';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages';
import IEvaluation from '../types/evaluation.type';

/**
 * Ask the AI for a list of taboo words for a given target word.
 * @param {string} targetWord The target word to generate taboo words for.
 * @returns {Promise<IWord>} The taboo words generated.
 */
export async function askAITabooWordsForTarget(
  targetWord: string
): Promise<IWord> {
  const target = _.toLower(_.trim(targetWord));
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: [
        {
          role: 'user',
          content: `Generate 5-8 words related to '${target}', in American English. Avoid plural and duplicates. Insert the words in an comma separated array: [word1, word2, ...]`,
        },
      ],
      temperature: 1,
      maxToken: 100,
    }),
    cache: 'no-store',
  });
  const json = await response.json();
  const text = json.response;
  const variations = formatResponseTextIntoArray(text, target);
  return {
    target: target,
    taboos: variations,
    isVerified: false,
    updatedAt: moment().format(DateUtils.formats.wordUpdatedAt),
  };
}

/**
 * Ask AI to generate taboo words for a given topic based on the difficulty.
 * @param {string} topic The topic to generate taboo words for.
 * @param {number} difficulty The difficulty of the taboo words.
 * @returns {Promise<IWord>} The taboo words generated.
 */
export async function askAIForCreativeTopic(
  topic: string,
  difficulty: number
): Promise<ILevel | undefined> {
  let difficultyString = '';
  switch (difficulty) {
    case 1:
      difficultyString = 'well-known';
      break;
    case 2:
      difficultyString = 'known by some';
      break;
    case 3:
      difficultyString = 'rare';
      break;
    default:
      difficultyString = 'well-known';
      break;
  }
  const respone = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: [
        {
          role: 'user',
          content: `Generate a list of ${CONSTANTS.numberOfQuestionsPerGame} words in the topic of ${topic} that are ${difficultyString}. In American English. Insert the words generated in an array: [word1, word2, ...]`,
        },
      ],
      temperature: 0.8,
      maxToken: 50,
    }),
  });
  const json = await respone.json();
  const text = json.response;
  if (text) {
    const words = formatResponseTextIntoArray(text);
    return {
      id: uniqueId(topic),
      name: topic,
      difficulty: difficulty,
      words: words,
      isVerified: true,
      popularity: 0,
      isAIGenerated: true,
    };
  } else {
    return;
  }
}

/**
 * Start a new conversation with the AI.
 * @param userMessage The message to start the conversation with.
 * @returns The runId and threadId of the conversation.
 */
export async function startNewConversation(
  userMessage: string
): Promise<{ runId: string; threadId: string }> {
  const response = await fetch('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  });
  // Getting repsonse in terms of {run_id: "", thread_id: ""}
  const json = await response.json();
  const runId = json.run_id;
  const threadId = json.thread_id;
  return { runId, threadId };
}

/**
 * Continue a running conversation
 * @param {string} userMessage The message to continue the conversation with.
 * @param {string} threadId The threadId of the conversation.
 * @returns {Promise<{runId: string, threadId: string}>} The runId and threadId of the conversation.
 */
export const continueConversation = async (
  userMessage: string,
  threadId: string
): Promise<{ runId: string; threadId: string }> => {
  const response = await fetch('/api/conversation?thread_id=' + threadId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  });
  // Getting repsonse in terms of {run_id: "", thread_id: ""}
  const json = await response.json();
  return { runId: json.run_id, threadId: json.thread_id };
};

/**
 * Check the status of a conversation Run and return the status and required action.
 * @param {string} runId The runId of the conversation.
 * @param {string} threadId The threadId of the conversation.
 * @returns {Promise<{status: Run['status'], requiredAction: Run.RequiredAction | null}>} The status and required action of the conversation.
 */
export async function checkRunStatusAndCallActionIfNeeded(
  runId: string,
  threadId: string
): Promise<{
  status: Run['status'];
  requiredAction: Run.RequiredAction | null;
}> {
  const respone = await fetch(
    '/api/conversation/status?run_id=' + runId + '&thread_id=' + threadId
  );
  // Getting response in form of {status: RunStatus, required_action: object | null}
  const json = await respone.json();
  const status = json.status;
  const requiredAction = json.required_actions;
  return { status, requiredAction };
}

/**
 * Retrieve the message list from a thread.
 * @param {string} threadId The threadId of the conversation.
 * @returns {Promise<ThreadMessage[]>} The list of messages in the thread.
 */
export async function getMessagesFromThread(
  threadId: string
): Promise<ThreadMessage[]> {
  const response = await fetch(
    '/api/conversation/messages?thread_id=' + threadId
  );
  const json = await response.json();
  return json;
}

/**
 * Start an evaluation session
 * @param {IEvaluation} evaluation The evaluation to start.
 * @returns {Promise<{runId: string, threadId: string}>} The runId and threadId of the evaluation.
 */
export async function startNewEvaluation(
  evaluation: IEvaluation
): Promise<{ runId: string; threadId: string }> {
  const response = await fetch('/api/evaluation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evaluation),
  });
  // Get the run_id and thread_id from resposne
  const json = await response.json();
  const runId = json.run_id;
  const threadId = json.thread_id;
  return { runId, threadId };
}

/**
 * Accept the evaluation. This is the completion step for the AI to move a Run into completed status
 * @param {string} runId The runId of the evaluation.
 * @param {string} threadId The threadId of the evaluation.
 * @param {EvaluationOutput[]} outputs The outputs of the evaluation.
 * @returns {Promise<void>} This call does not have any return expected.
 */
type EvaluationOutput = { call_id: string; output: string };
export async function completeEvaluation(
  runId: string,
  threadId: string,
  outputs: EvaluationOutput[]
) {
  await fetch(
    '/api/evaluation/complete?run_id=' + runId + '&thread_id=' + threadId,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outputs }),
    }
  );
}
