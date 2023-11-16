import { initializeApp } from 'firebase-admin/app';
import { firestore as adminFirestore } from 'firebase-admin';
import { firestore } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

initializeApp();
const db = adminFirestore();

/**
 * Triggered when a new game is added to a user.
 * This will update the user's gamePlayedCount under its
 * document in the users collection. Path: users/{userId}.
 * A new game is considered added to a user when the user
 * completes a game.
 */
exports.onUserGameAdded = firestore
  .document('users/{userId}/games/{gameId}')
  .onCreate((snapshot, context) => {
    logger.info('onUserGameAdded', snapshot, context);
    db.doc(`users/${context.params.userId}`).update({
      gamePlayedCount: adminFirestore.FieldValue.increment(1),
    });
  });

/**
 * Triggered when a new level is added to a user.
 * This will update the user's levelPlayedCount under its
 * document in the users collection. Path: users/{userId}.
 * A new level is considered added to a user when the user
 * attempts the level for the first time.
 */
exports.onUserLevelAdded = firestore
  .document('users/{userId}/levels/{levelId}')
  .onCreate((snapshot, context) => {
    logger.info('onUserLevelAdded', snapshot, context);
    db.doc(`users/${context.params.userId}`).update({
      levelPlayedCount: adminFirestore.FieldValue.increment(1),
    });
  });
