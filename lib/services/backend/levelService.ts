import IDailyLevel from '../../../types/dailyLevel.interface';
import ILevel from '../../../types/level.interface';
import {
  fetchLevelByName,
  insertDailyLevel,
  insertLevel,
  selectDailyLevel,
  selectDailyLevelByName,
} from '../../database/levelRespository';

const getLevelByName = async (name: string): Promise<ILevel | null> => {
  const { level } = await fetchLevelByName(name);
  return level;
};

const submitNewLevel = async (level: ILevel): Promise<ILevel> => {
  const newLevel = await insertLevel(level);
  return newLevel.level;
};

const submitNewDailyLevel = async (
  level: IDailyLevel
): Promise<IDailyLevel> => {
  const newLevel = await insertDailyLevel(level);
  return newLevel.level;
};

const getDailyLevel = async (dateKey: string): Promise<IDailyLevel> => {
  const level = await selectDailyLevel(dateKey);
  return level.level;
};

const getDailyLevelByName = async (name: string): Promise<IDailyLevel> => {
  const level = await selectDailyLevelByName(name);
  return level.level;
};

export {
  submitNewLevel,
  submitNewDailyLevel,
  getLevelByName,
  getDailyLevel,
  getDailyLevelByName,
};
