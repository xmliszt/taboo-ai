'use client';

export const CONSTANTS = {
  numberOfQuestionsPerGame: 5,
  eventKeys: {
    signUpSuccess: 'onSignUpSuccess',
    recoverySuccess: 'onRecoverySuccess',
    targetChanged: 'onTargetChanged',
    scoreComputed: 'onScoreComputed',
    noScoreAvailable: 'onNoScoreAvailable',
    fetchLevelError: 'onFetchLevelError',
    alreadyAttemptedLevel: 'onAlreadyAttemptedLevel',
    notYourScore: 'onNotYourScore',
  },
  errors: {
    overloaded:
      'Taboo AI is currently overloaded with other requests. Please try again later.',
    aiModeFail:
      'Taboo AI is unable to generate the list of words related to the topic',
    aiJudgeFail:
      'We apologize for the inconvenience, but it seems that Taboo AI is currently unable to connect to the AI judging service. Therefore, we have provided an average score of 50 for the game. We kindly suggest that you try again later by not submitting the current game and revisiting the game level. Thank you for your patience and understanding.',
  },
  mask: 'XXXXXXXXXXX',
  featurePopupString: 'v2.1', // The current feature release version
};
