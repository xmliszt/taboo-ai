import IDailyLevel from '../../../types/dailyLevel.interface';
import {
  insertDailyLevel,
  selectDailyLevel,
  selectDailyLevelByName,
} from '../../database/levelRespository';

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

export { submitNewDailyLevel, getDailyLevel, getDailyLevelByName };
