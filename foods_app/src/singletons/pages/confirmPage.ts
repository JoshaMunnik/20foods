import {PageBase} from "../../classes/ui/PageBase";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {applicationData} from "../data/applicationData";
import {CompareEntry} from "../../classes/data/CompareEntry";
import {DataAttribute} from "../../types/DataAttribute";
import {mainController} from "../main/mainController";
import {historyData} from "../data/historyData";
import {CssClass} from "../../types/CssClass";

class ConfirmPage extends PageBase {
  // region private variables

  private readonly m_confirmEntries = UFHtml.getForId<HTMLDivElement>(
    'confirm-entries'
  );

  private readonly m_entryTemplate = UFHtml.getForId<HTMLTemplateElement>(
    'confirm-entry-template'
  );

  private readonly m_saveButton = UFHtml.getForId<HTMLButtonElement>(
    'confirm-save-button'
  );

  private readonly m_addButton = UFHtml.getForId<HTMLButtonElement>(
    'confirm-add-button'
  );

  private readonly m_none = UFHtml.getForId<HTMLElement>(
    'confirm-none'
  );

  // endregion

  // region public methods

  constructor() {
    super('confirm-page', 'confirm entries');
    this.m_saveButton.addEventListener('click', () => this.handleSaveClick());
    this.m_addButton.addEventListener('click', () => this.handleAddClick());
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    this.buildList();
    this.updateVisibility();
  }

  protected onHideDone() {
    this.m_confirmEntries.replaceChildren();
  }

// endregion

  // region private methods

  private buildList(): void {
    const entries = applicationData.compareEntries;
    this.m_confirmEntries.replaceChildren();
    entries.forEach(entry => this.m_confirmEntries.appendChild(this.createEntryElement(entry)));
  }

  private updateVisibility(): void {
    const hasEntries = applicationData.compareEntries.length > 0;
    this.m_none.classList.toggle(CssClass.Hidden, hasEntries);
    this.m_confirmEntries.classList.toggle(CssClass.Hidden, !hasEntries);
    this.m_saveButton.disabled = !hasEntries;
  }

  private createEntryElement(entry: CompareEntry): DocumentFragment {
    const element = this.m_entryTemplate.content.cloneNode(true) as DocumentFragment;
    const originalName = element.querySelector<HTMLElement>(DataAttribute.OriginalName)!;
    const foodName = element.querySelector<HTMLElement>(DataAttribute.FoodName)!
    const removeButton = element.querySelector<HTMLButtonElement>(DataAttribute.RemoveButton)!
    originalName.innerText = entry.original;
    foodName.innerText = entry.food.name;
    removeButton.addEventListener(
      'click', () => this.handleRemoveClick(entry)
    );
    return element;
  }

  // endregion

  // region event handlers

  private handleRemoveClick(entry: CompareEntry): void {
    applicationData.removeCompareEntry(entry);
    this.buildList();
    this.updateVisibility();
  }

  private handleSaveClick(): void {
    historyData.add(applicationData.compareEntries);
    applicationData.compareEntries = [];
    mainController.back();
  }

  private handleAddClick(): void {
    mainController.showAdd();
  }

  // endregion
}

export const confirmPage = new ConfirmPage();