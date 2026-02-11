// region imports

import {FoodEntry} from "./FoodEntry";

// endregion

// region exports

export class WeekEntry {
  // region private variables

  private readonly m_startDate: Date;

  private readonly m_endDate: Date;

  private readonly m_foods: FoodEntry[];

  // endregion

  // region public methods

  constructor(startDate: Date, endDate: Date, foods: Set<FoodEntry>) {
    this.m_startDate = startDate;
    this.m_endDate = endDate;
    this.m_foods = [...foods];
    this.m_foods.sort(
      (first, second) => first.name.localeCompare(second.name)
    );
  }

  // endregion

  // region public properties

  get startDate() {
    return this.m_startDate;
  }

  get endDate() {
    return this.m_endDate;
  }

  /**
   * All foods consumed in the week, sorted by name.
   */
  get foods(): FoodEntry[] {
    return this.m_foods;
  }

  // endregion
}

// endregion
