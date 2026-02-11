// region imports

import {FoodEntry} from "../../classes/data/FoodEntry";
import {CompareEntry} from "../../classes/data/CompareEntry";
import {Text} from "../../classes/support/Text";

// endregion

// region local types

class FoodData {
  // region private variables

  /**
   * The list of food entries loaded from the input data.
   */
  private m_foodEntries: FoodEntry[] = [];

  /**
   * Compare items sorted by normalized name length in descending order
   */
  private m_compareItemsByLength: CompareEntry[] = [];

  /**
   * Compare items sorted by original name in ascending order.
   */
  private m_compareItemsByOriginal: CompareEntry[] = [];

  // endregion

  // region public methods

  constructor() {
  }

  import(rows: string[][]) {
    this.processRows(rows);
    this.buildCompareItems();
    this.sortCompareItems();
  }

  /**
   * Finds a food entry by its original name.
   *
   * @param name
   *
   * @return The food entry with the given name, or null if no such food entry exists.
   */
  findForName(name: string): FoodEntry | null {
    return this.m_foodEntries.find(entry => entry.name === name) || null;
  }

  /**
   * Returns the list of compare items sorted by original value.
   */
  getList(): CompareEntry[] {
    return this.m_compareItemsByOriginal;
  }

  /**
   * Processes the input text and return all compare items that match any of the
   * compare original values found in the input text.
   *
   * @param text
   *
   * @return A list of compare items that match any of the original values found in the input text.
   */
  processText(text: string): CompareEntry[] {
    const result: CompareEntry[] = [];
    let normalizedText = Text.normalizeForComparison(text);
    this.m_compareItemsByLength.forEach(compareItem => {
      if (normalizedText.includes(compareItem.normalized)) {
        result.push(compareItem);
        normalizedText = normalizedText.replaceAll(compareItem.normalized, '');
      }
    });
    return result;
  }

  // endregion

  // region private methods

  private processRows(rows: string[][]) {
    this.m_foodEntries = [];
    rows.forEach((row) => {
      if (row.length > 1) {
        const name = Text.normalizeName(row[0]);
        if (this.hasFood(name)) {
          console.warn(`Duplicate food name "${name}" found, skipping row: ${row}`);
        }
        this.m_foodEntries.push(new FoodEntry(row));
      }
      else {
        console.warn(`Skipping row with insufficient columns: ${row}`);
      }
    });
    console.debug(`Processed ${this.m_foodEntries.length} foods from ${rows.length} rows`);
  }

  private buildCompareItems() {
    this.m_compareItemsByLength = [];
    this.m_foodEntries.forEach(food => this.addFoodToCompareItems(food));
    this.m_compareItemsByOriginal = [...this.m_compareItemsByLength];
  }

  private addFoodToCompareItems(food: FoodEntry) {
    this.m_compareItemsByLength.push(new CompareEntry(food.name, food));
    food.synonyms.forEach(
      synonym => this.m_compareItemsByLength.push(new CompareEntry(synonym, food))
    );
  }

  private hasFood(name: string): boolean {
    return this.m_foodEntries.some(food => food.name === name);
  }

  private sortCompareItems() {
    // sort by normalized name length in descending order to ensure that longer names are
    // matched first
    this.m_compareItemsByLength.sort(
      (first, second) => second.normalized.length - first.normalized.length
    );
    // sort by original name in ascending order
    this.m_compareItemsByOriginal.sort(
      (first, second) => first.original.localeCompare(second.original)
    );
  }
}

// endregion

// region exports

export const foodData = new FoodData();

// endregion
