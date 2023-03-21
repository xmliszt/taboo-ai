import IDailyLevel from '../../../types/dailyLevel.interface';
import {
  insertDailyLevel,
  selectDailyLevel,
} from '../../database/levelRespository';
import dateFormat from 'dateformat';

const submitNewDailyLevel = async (
  level: IDailyLevel
): Promise<IDailyLevel> => {
  const newLevel = await insertDailyLevel(level);
  return newLevel.level;
};

const getDailyLevel = async (): Promise<IDailyLevel> => {
  const level = await selectDailyLevel(dateFormat(new Date(), 'dd-mm-yyyy'));
  return level.level;
};

export { submitNewDailyLevel, getDailyLevel };
