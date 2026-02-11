// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {Text} from "../../classes/support/Text";
import {DataAttribute} from "../../types/DataAttribute";
import {historyData} from "../data/historyData";
import {WeekEntry} from "../../classes/data/WeekEntry";
import {CssClass} from "../../types/CssClass";
import {mainController} from "../main/mainController";

// endregion

// region local types

class HistoryPage extends PageBase {
  // region private variables

  private readonly m_entries = UFHtml.getForId('history-entries');

  private readonly m_entryTemplate = UFHtml.getForId<HTMLTemplateElement>(
    'history-entry'
  );

  // endregion

  // region public methods

  constructor() {
    super('history-page', 'history');
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    this.m_entries.replaceChildren();
    const entries = historyData.getCountsPerWeek();
    entries.forEach(
      entry => this.m_entries.appendChild(this.createEntryElement(entry))
    );
  }

  protected onHideDone() {
    this.m_entries.replaceChildren();
  }

  // endregion

  // region private method

  private createEntryElement(entry: WeekEntry): DocumentFragment {
    const element = this.m_entryTemplate.content.cloneNode(true) as DocumentFragment;
    const startDate = element.querySelector<HTMLElement>(DataAttribute.StartDate)!;
    const endDate = element.querySelector<HTMLElement>(DataAttribute.EndDate)!;
    const foodCount = element.querySelector<HTMLElement>(DataAttribute.FoodCount)!;
    const viewButton = element.querySelector<HTMLButtonElement>(DataAttribute.ViewButton)!;
    startDate.innerText = Text.formatDate(entry.startDate);
    endDate.innerText = Text.formatDate(entry.endDate);
    const count = entry.foods.length;
    foodCount.innerText = count.toString();
    if (count >= 20) {
      foodCount.classList.add(CssClass.TextSuccess);
    }
    viewButton.addEventListener(
      'click', () => this.handleViewClick(entry)
    );
    return element;
  }

  // endregion

  // region event handler

  private handleViewClick(entry: WeekEntry): void {
    mainController.showWeek(entry);
  }


  // endregion
}

// endregion

// region exports

export const historyPage = new HistoryPage();

// endregion