// region imports

import {FoodEntry} from "./FoodEntry";
import {CompareEntry} from "./CompareEntry";
import {foodData} from "../../singletons/data/foodData";

// endregion

// region local types

// used for storing and retrieving history entries as strings
type StorageData = {
  foodName: string;
  consumedName: string;
  date: string;
}

// endregion

// region exports

export class HistoryEntry {
  // region private variables

  private readonly m_food: FoodEntry;

  private readonly m_consumedName: string;

  private readonly m_date: Date;

  // endregion

  // region public methods

  /**
   * Creates a new history entry from the given compare entry. The date of the history entry is set
   * to the current date and time.
   *
   * @param compareEntry
   *
   * @return A new history entry with the food and original name from the compare entry,
   *   and the current date.
   */
  static createFromInput(compareEntry: CompareEntry): HistoryEntry
  {
    return new HistoryEntry(compareEntry.food, compareEntry.original, new Date());
  }

  /**
   * Creates a new history entry from the given storage data string. The storage data string should
   * be a JSON string that contains the food name, the consumed name, and the date in ISO format.
   * The food entry is looked up from the food data using the food name. If the food entry is
   * not found, an error is thrown. The date is parsed from the ISO string.
   *
   * @param data
   *
   * @return A new history entry with the food, consumed name, and date from the storage data.
   */
  static createFromStorage(data: string): HistoryEntry
  {
    const storageData: StorageData = JSON.parse(data);
    const food = foodData.findForName(storageData.foodName);
    if (food == null) {
      throw new Error(`Food with name "${storageData.foodName}" not found in food data.`);
    }
    return new HistoryEntry(food, storageData.consumedName, new Date(storageData.date));
  }

  /**
   * Converts this history entry to a JSON string that can be stored in local storage.
   * The JSON string contains the food name, the consumed name, and the date in ISO format.
   *
   * Use {@link createFromStorage} to convert the JSON string back to a history entry.
   *
   * @return A JSON string representation of this history entry that can be stored in local storage.
   */
  toJson(): string {
    const data: StorageData = {
      foodName: this.m_food.name,
      consumedName: this.m_consumedName,
      date: this.m_date.toISOString()
    };
    return JSON.stringify(data);
  }

  // endregion

  // region public properties

  get food() {
    return this.m_food;
  }

  get consumedName() {
    return this.m_consumedName;
  }

  get date() {
    return this.m_date;
  }

  // endregion

  // region private methods

  /**
   * Creates a new history entry with the given food consumed name, and date. This constructor
   * is private because history entries should only be created using the static factory methods
   * {@link createFromInput} and {@link createFromStorage}.
   *
   * @param food
   * @param consumedName
   * @param date
   *
   * @private
   */
  private constructor(food: FoodEntry, consumedName: string, date: Date) {
    this.m_consumedName = consumedName;
    this.m_date = date;
    this.m_food = food;
  }

  // endregion
}

// endregion
