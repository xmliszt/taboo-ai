import _ from 'lodash';

/** For handling transform data into display string, properly formatted */
export class DisplayUtils {
  static getLevelName(levelName: string): string {
    return levelName.replace(/(\w+'*\w+)/g, _.upperFirst);
  }
}
