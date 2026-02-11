// region local constants

import {HistoryEntry} from "../../classes/data/HistoryEntry";
import {CompareEntry} from "../../classes/data/CompareEntry";
import {WeekEntry} from "../../classes/data/WeekEntry";
import {settings} from "../main/settings";
import {FoodEntry} from "../../classes/data/FoodEntry";

const STORAGE_KEY: string = 'historyData';

// endregion

// region local type

class HistoryData {
  // region private variables

  private m_historyEntries: HistoryEntry[] = [];

  // endregion

  // region public methods

  /**
   * Initializes the history data by loading the history entries from local storage and
   * sorting them.
   * Make sure the {@link foodData} is initialized before calling this method.
   */
  initialize() {
    this.m_historyEntries = this.loadFromStorage();
    this.sortEntries();
  }

  /**
   * Adds the given compare entries to the history. This method will also save the updated history
   * and resort the history entries.
   *
   * @param entries
   */
  add(entries: CompareEntry[]) {
    entries.forEach(
      entry => this.m_historyEntries.push(HistoryEntry.createFromInput(entry))
    );
    this.sortEntries();
    this.saveToStorage(this.m_historyEntries);
  }

  /**
   * Gets the week entry for the current week.
   *
   * @return The week entry for the current week.
   */
  getCountForToday(): WeekEntry {
    return this.getWeekEntryForDate(new Date());
  }

  /**
   * Gets all week entries for the stored history entries.
   *
   * @return The week entries sorted in descending order.
   */
  getCountsPerWeek(): WeekEntry[] {
    if (this.m_historyEntries.length === 0) {
      return [];
    }
    // get the oldest date
    const lastDate = this.m_historyEntries.at(-1)!.date;
    const result: WeekEntry[] = [];
    // go back week by week until the oldest date is reached, and get the count for each week
    for(
      let endDate = this.endOfWeek(new Date());
      endDate >= lastDate;
      endDate.setDate(endDate.getDate() - 7)
    ) {
      result.push(this.getWeekEntryForDate(endDate));
    }
    return result;
  }

  /**
   * Gets the history entries for the given week entry.
   *
   * @param weekEntry
   */
  getListForWeek(weekEntry: WeekEntry): HistoryEntry[] {
    return this.m_historyEntries.filter(
      entry => entry.date >= weekEntry.startDate && entry.date <= weekEntry.endDate
    );
  }

  /**
   * Clears the history by removing all history entries and saving the empty history to local
   * storage.
   */
  clear(): void {
    this.m_historyEntries = [];
    this.saveToStorage(this.m_historyEntries);
  }

  // endregion

  // region private methods

  /**
   * Loads the history entries from local storage.
   *
   * @return The history entries loaded from local storage.
   */
  private loadFromStorage(): HistoryEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const texts: string[] = JSON.parse(raw);
    return texts.map(text => HistoryEntry.createFromStorage(text));
  }

  /**
   * Saves the given history entries to local storage.
   *
   * @param entries
   */
  private saveToStorage(entries: HistoryEntry[]) {
    const texts: string[] = entries.map(entry => entry.toJson());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
  }

  /**
   * Sorts the history entries in descending order by date (most recent first).
   */
  private sortEntries() {
    this.m_historyEntries.sort(
      (first, second) => second.date.getTime() - first.date.getTime()
    );
  }

  /**
   * Returns the start date of the week for the given input date and the first day of the week.
   *
   * @param inputDate
   *
   * @return The start date of the week, the time is set to 00:00:00.
   */
  private startOfWeek(inputDate: Date|string|number): Date {
    const date = new Date(inputDate);
    const firstDay = settings.startDayOfWeek;
    const dayDifference = (date.getDay() - firstDay + 7) % 7;
    const result = new Date(date);
    result.setDate(date.getDate() - dayDifference);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Returns the end date of the week.
   *
   * @param inputDate
   *
   * @return The end date of the week, the time is set to 23:59:59.
   */
  private endOfWeek(inputDate: Date): Date {
    const result = this.startOfWeek(inputDate);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Gets the week entry for a certain date.
   *
   * @param date
   *
   * @return The week entry for the given date.
   */
  private getWeekEntryForDate(date: Date): WeekEntry {
    const startDate = this.startOfWeek(date);
    const endDate = this.endOfWeek(startDate);
    const foods = new Set<FoodEntry>();
    this.m_historyEntries
      .filter(
        entry => (entry.date >= startDate) && (entry.date <= endDate)
      )
      .forEach(
        entry => foods.add(entry.food)
      );
    return new WeekEntry(startDate, endDate, foods);
  }

  // endregion
}

// endregion

// region exports

export const historyData = new HistoryData();

// endregion