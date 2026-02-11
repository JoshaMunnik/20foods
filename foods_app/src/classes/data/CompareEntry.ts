// region imports

import {FoodEntry} from "./FoodEntry";
import {Text} from "../support/Text";

// endregion

// region exports

/**
 * Represents a compare entry that contains the original value, the normalized value for comparison,
 * and the associated food entry.
 *
 * The original value can be the name of the food or one of its synonyms.
 */
export class CompareEntry {
  // region private variables

  private readonly m_normalized: string;

  private readonly m_original: string;

  private readonly m_food: FoodEntry;

  // endregion

  // region public methods

  constructor(original: string, food: FoodEntry) {
    this.m_original = Text.normalizeName(original);
    this.m_normalized = Text.normalizeForComparison(original);
    this.m_food = food;
  }

  // endregion

  // region public properties

  get normalized() {
    return this.m_normalized;
  }

  get original() {
    return this.m_original;
  }

  get food() {
    return this.m_food;
  }

  // endregion
}

// endregion