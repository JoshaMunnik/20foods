import { WeekEntry } from "../../classes/data/WeekEntry";
import {CompareEntry} from "../../classes/data/CompareEntry";

class ApplicationData {
  // region private variables

  private m_selectedWeek: WeekEntry | null = null;

  private m_compareEntries: CompareEntry[] = [];

  // endregion

  // region public methods

  removeCompareEntry(entry: CompareEntry): void {
    const index = this.m_compareEntries.indexOf(entry);
    if (index > -1) {
      this.m_compareEntries.splice(index, 1);
    }
  }

  // endregion

  // region public properties

  get selectedWeek(): WeekEntry | null {
    return this.m_selectedWeek;
  }

  set selectedWeek(value: WeekEntry | null) {
    this.m_selectedWeek = value;
  }

  get compareEntries(): CompareEntry[] {
    return this.m_compareEntries;
  }

  set compareEntries(value: CompareEntry[]) {
    this.m_compareEntries = value;
  }

  // endregion
}

export const applicationData = new ApplicationData();
