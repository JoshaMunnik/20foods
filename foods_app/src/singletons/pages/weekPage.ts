// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {applicationData} from "../data/applicationData";
import {Text} from "../../classes/support/Text";
import {FoodEntry} from "../../classes/data/FoodEntry";
import {historyData} from "../data/historyData";
import {HistoryEntry} from "../../classes/data/HistoryEntry";
import {DataAttribute} from "../../types/DataAttribute";
import {CssClass} from "../../types/CssClass";

// endregion

// region local types

class WeekPage extends PageBase {
  // region private variables

  private readonly m_weekStart = UFHtml.getForId("week-start-title");

  private readonly m_weekEnd = UFHtml.getForId("week-end-title");

  private readonly m_foodEntries = UFHtml.getForId("food-entries");

  private readonly m_foodEntryTemplate = UFHtml.getForId<HTMLTemplateElement>(
    "food-entry"
  );

  private readonly m_foodHistoryEntryTemplate = UFHtml.getForId<HTMLTemplateElement>(
    "food-history-entry"
  );

  // endregion

  // region public methods

  constructor() {
    super('week-page', 'week overview');
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    this.m_foodEntries.replaceChildren();
    const week = applicationData.selectedWeek!;
    this.m_weekStart.innerText = Text.formatDate(week.startDate);
    this.m_weekEnd.innerText = Text.formatDate(week.endDate);
    const historyEntries = historyData.getListForWeek(week)
    const foods = this.getFoods(historyEntries);
    foods.forEach(
      food => this.m_foodEntries.appendChild(
        this.createFoodEntryElement(food, this.getHistoryEntriesForFood(food, historyEntries))
      )
    );
  }

  protected onHideDone() {
    this.m_foodEntries.replaceChildren();
  }

  // endregion

  // region private methods

  /**
   * Gets all unique foods consumed by all history entries, sorted by name.
   */
  private getFoods(historyEntries: HistoryEntry[]): FoodEntry[] {
    const foods = new Set<FoodEntry>();
    historyEntries.forEach(entry => foods.add(entry.food));
    const result: FoodEntry[] = [...foods];
    result.sort((first, second) => first.name.localeCompare(second.name));
    return result;
  }

  /**
   * Gets all history entries for the given food.
   *
   * @param food
   * @param historyEntries
   *
   * @return All history entries for the given food, sorted by date ascending.
   */
  private getHistoryEntriesForFood(
    food: FoodEntry, historyEntries: HistoryEntry[]
  ): HistoryEntry[] {
    const result = historyEntries.filter(entry => entry.food === food);
    result.sort((first, second) => first.date.getTime() - second.date.getTime());
    return result;
  }

  private createFoodEntryElement(food: FoodEntry, historyEntries: HistoryEntry[]): DocumentFragment {
    const element = this.m_foodEntryTemplate.content.cloneNode(true) as DocumentFragment;
    const name = element.querySelector<HTMLElement>(DataAttribute.FoodName)!;
    const category = element.querySelector<HTMLElement>(DataAttribute.CategoryName)!;
    const foodHistoryEntries = element.querySelector<HTMLElement>(
      DataAttribute.FoodHistoryEntries
    )!;
    const collapseButton = element.querySelector<HTMLButtonElement>(
      DataAttribute.CollapseButton
    )!;
    const expandButton = element.querySelector<HTMLButtonElement>(
      DataAttribute.ExpandButton
    )!;
    name.innerText = food.name;
    category.innerText = food.category;
    historyEntries.forEach(
      entry => foodHistoryEntries.appendChild(
        this.createFoodHistoryEntryElement(entry)
      )
    );
    collapseButton.classList.add(CssClass.Hidden);
    foodHistoryEntries.classList.add(CssClass.Hidden);
    collapseButton.addEventListener(
      'click',
      () => this.handleCollapseClick(foodHistoryEntries, collapseButton, expandButton)
    );
    expandButton.addEventListener(
      'click',
      () => this.handleExpandClick(foodHistoryEntries, collapseButton, expandButton))
    ;
    return element;
  }

  private createFoodHistoryEntryElement(entry: HistoryEntry): DocumentFragment {
    const element = this.m_foodHistoryEntryTemplate.content.cloneNode(true) as DocumentFragment;
    const date = element.querySelector<HTMLElement>(DataAttribute.FoodHistoryDate)!;
    const name = element.querySelector<HTMLElement>(DataAttribute.FoodHistoryName)!;
    date.innerText = Text.formatDateWithTime(entry.date);
    name.innerText = entry.consumedName;
    return element;
  }

  // endregion

  // region event handlers

  private handleCollapseClick(
    foodHistoryEntries: HTMLElement, collapseButton: HTMLButtonElement, expandButton: HTMLButtonElement
  ): void {
    foodHistoryEntries.classList.add(CssClass.Hidden);
    collapseButton.classList.add(CssClass.Hidden);
    expandButton.classList.remove(CssClass.Hidden);
  }

  private handleExpandClick(
    foodHistoryEntries: HTMLElement, collapseButton: HTMLButtonElement, expandButton: HTMLButtonElement
  ): void {
    foodHistoryEntries.classList.remove(CssClass.Hidden);
    collapseButton.classList.remove(CssClass.Hidden);
    expandButton.classList.add(CssClass.Hidden);
  }

  // endregion
}

// endregion

// region exports

export const weekPage = new WeekPage();

// endregion