import { initializeApp } from 'firebase-admin/app';
import {
  firestore as adminFirestore,
  database as adminDatabase,
} from 'firebase-admin';
import { firestore } from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

initializeApp();
const fs = adminFirestore();
const db = adminDatabase();

/**
 * Triggered when a new game is added to a user.
 * This will update the user's gamePlayedCount under its
 * document in the users collection. Path: users/{userId}.
 * A new game is considered added to a user when the user
 * completes a game. This will also update the `attempts`
 * field in the level document under the users `levels`
 * collection for the matching level, incrementing it by 1.
 */
exports.onUserGameAdded = firestore
  .document('users/{userId}/games/{gameId}')
  .onCreate(async (snapshot, context) => {
    logger.info('onUserGameAdded', snapshot, context);
    await fs.doc(`users/${context.params.userId}`).update({
      gamePlayedCount: adminFirestore.FieldValue.increment(1),
    });
    const levelId: string = snapshot.data()?.levelId;
    if (levelId) {
      await fs
        .doc(`users/${context.params.userId}/levels/${levelId}`)
        .set(
          { attempts: adminFirestore.FieldValue.increment(1) },
          { merge: true }
        );
    }
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
    fs.doc(`users/${context.params.userId}`).update({
      levelPlayedCount: adminFirestore.FieldValue.increment(1),
    });
  });

/**
 * Triggerred when user updates the anonymity field or nickname
 * in their user document. This will update the topScorerName
 * field in the levelStats document if the user is the top scorer
 * of the level.
 */
exports.onUserAnonymityChanged = firestore
  .document('users/{userId}')
  .onUpdate(async (snapshot, context) => {
    logger.info('onUserAnonymityChanged', snapshot, context);
    const oldUser = snapshot.before.data();
    const user = snapshot.after.data();
    const oldAnonymity: boolean = oldUser.anonymity;
    const newAnonymity: boolean = user.anonymity;
    const oldNickname = oldUser.nickname;
    const newNickname = user.nickname;
    if (oldAnonymity === newAnonymity && oldNickname === newNickname) return;

    const levelsAttemptedByUser = await fs
      .collection(`users/${context.params.userId}/levels`)
      .get();
    const levelIdsAttempted = levelsAttemptedByUser.docs.map((doc) => doc.id);
    const updates: { [key: string]: unknown } = {};
    for (const levelId of levelIdsAttempted) {
      const levelStatsRef = db.ref(`levelStats/${levelId}`);
      const levelStatsSnapshot = await levelStatsRef.get();
      if (levelStatsSnapshot.val()?.topScorer === user.email) {
        updates[levelId] = {
          topScore: levelStatsSnapshot.val()?.topScore,
          topScorer: levelStatsSnapshot.val()?.topScorer,
          topScorerName: newAnonymity ? 'Anonymous' : newNickname,
        };
      }
    }
    await db.ref('levelStats').update(updates);
  });

/**
 * Triggerred when user deletes their account.
 * This will delete the user's record from the levelStats
 * document if the user is the top scorer of the level.
 * This will also delete the user's record from the
 * users collection.
 */
exports.onUserDeleted = firestore
  .document('users/{userId}')
  .onDelete(async (snapshot, context) => {
    logger.info('onUserDeleted', snapshot, context);
    const levelsAttemptedByUser = await fs
      .collection(`users/${context.params.userId}/levels`)
      .get();
    const levelIdsAttempted = levelsAttemptedByUser.docs.map((doc) => doc.id);
    const updates: { [key: string]: unknown } = {};
    for (const levelId of levelIdsAttempted) {
      const levelStatsRef = db.ref(`levelStats/${levelId}`);
      const levelStatsSnapshot = await levelStatsRef.get();
      if (levelStatsSnapshot.val()?.topScorer === snapshot.data()?.email) {
        // Delete the record
        updates[levelId] = null;
      }
    }
    await db.ref('levelStats').update(updates);
    // Recursively delete everything in user's document
    await fs.recursiveDelete(fs.doc(`users/${context.params.userId}`));
  });

/**
 * Triggerred when user's customerId field is updated.
 */
exports.onUserCustomerIdChanged = firestore
  .document('users/{userId}')
  .onUpdate(async (snapshot, context) => {
    logger.info('onUserCustomerIdChanged', snapshot, context);
    const oldUserData = snapshot.before.data();
    const newUserData = snapshot.after.data();
    const userID = context.params.userId;
    const oldCustomerId: string = oldUserData.customerId;
    const newCustomerId: string = newUserData.customerId;
    const oldCustomerPlanType: string = oldUserData.customerPlanType;
    const newCustomerPlanType: string = newUserData.customerPlanType;

    // If nothing changed, return
    if (
      oldCustomerId === newCustomerId &&
      oldCustomerPlanType === newCustomerPlanType
    ) {
      return;
    }

    // If user has customerId and it's updated
    // save it in the '/subscriptions' collection
    if (newCustomerId) {
      await fs.doc(`subscriptions/${userID}`).set({
        email: userID,
        customerId: newCustomerId,
        customerPlanType: newCustomerPlanType,
      });
    }
  });

/**
 * Triggerred when user is created.
 */
exports.onUserCreated = firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    logger.info('onUserCreated', snapshot, context);
    const userID = context.params.userId;

    // Search for user in '/subscriptions' collection, if found, copy
    // customerId and customerPlanType to user document
    const subscriptionSnapshot = await fs.doc(`subscriptions/${userID}`).get();
    if (subscriptionSnapshot.exists) {
      const subscriptionData = subscriptionSnapshot.data();
      await fs.doc(`users/${userID}`).update({
        customerId: subscriptionData?.customerId,
        customerPlanType: subscriptionData?.customerPlanType,
      });
    }
  });
