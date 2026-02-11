// region local constants

const START_DAY_OF_WEEK_STORAGE_KEY: string = 'startDayOfWeek';

// region local types

class Settings {
  // region private variables

  private m_startDayOfWeek: number;

  // endregion

  // region public methods

  constructor() {
    this.m_startDayOfWeek = parseInt(localStorage.getItem(START_DAY_OF_WEEK_STORAGE_KEY) || '0');
  }

  // endregion

  // region public properties

  get startDayOfWeek() {
    return this.m_startDayOfWeek;
  }

  set startDayOfWeek(value: number) {
    this.m_startDayOfWeek = value;
    localStorage.setItem(START_DAY_OF_WEEK_STORAGE_KEY, value.toString());
  }

  // endregion
}

// region exports

export const settings = new Settings();

// endregion