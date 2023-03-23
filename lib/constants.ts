'use client';

export const CONSTANTS = {
  numberOfQuestionsPerGame: 5,
  eventKeys: {
    signUpSuccess: 'onSignUpSuccess',
    recoverySuccess: 'onRecoverySuccess',
    targetChanged: 'onTargetChanged',
    scoreComputed: 'onScoreComputed',
  },
  errors: {
    overloaded:
      'Taboo AI is currently overloaded with other requests. Please try again later.',
    aiModeFail:
      'Taboo AI is unable to generate the list of words related to the topic',
  },
};
