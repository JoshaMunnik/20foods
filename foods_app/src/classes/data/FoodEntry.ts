import {Text} from '../support/Text';

class FoodEntry {
  // region private variables

  private readonly m_name: string;

  private readonly m_category: string;

  private readonly m_synonyms: string[];

  // endregion

  // region public methods

  constructor(row: string[]) {
    this.m_name = Text.normalizeName(row[0]);
    this.m_category = Text.normalizeName(row[1]);
    this.m_synonyms = (row.length > 2 ? row[2] : '')
      // split on one or more non-letter non-space chars
      .split(/[^\p{L} ]+/u)
      .map(synonym => Text.normalizeName(synonym))
      // filter out empty strings
      .filter(Boolean);
  }

  // endregion

  // region public properties

  get name() {
    return this.m_name;
  }

  get category() {
    return this.m_category;
  }

  get synonyms() {
    return this.m_synonyms;
  }

  // endregion
}

export {FoodEntry}