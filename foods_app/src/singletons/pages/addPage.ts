// region imports

import {PageBase} from '../../classes/ui/PageBase';
import {foodData} from '../data/foodData';
import {UFHtml} from '@ultraforce/ts-dom-lib';
import {CompareEntry} from '../../classes/data/CompareEntry';
import {applicationData} from '../data/applicationData';
import {mainController} from '../main/mainController';
import {DataAttribute} from '../../types/DataAttribute';
import {Text} from '../../classes/support/Text';
import {CssClass} from '../../types/CssClass';

// endregion

// region local constants

const FILTER_ATTRIBUTE = 'data-tp-filter-text';

// endregion

// region local types

class AddPage extends PageBase {
  // region private variables

  private readonly m_filterInput = UFHtml.getForId<HTMLInputElement>(
    "add-filter-input"
  );

  private readonly m_addEntries = UFHtml.getForId<HTMLDivElement>(
    "add-entries"
  );

  private readonly m_entryTemplate = UFHtml.getForId<HTMLTemplateElement>(
    "add-entry-template"
  );

  /**
   * Contains all children of the entries container while the page is visible.
   */
  private m_children: HTMLElement[] = [];

  // endregion

  // region public methods

  constructor() {
    super('add-page', 'add entry');
    this.m_filterInput.addEventListener('input', () => this.handleFilterChange());
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    const entries = foodData.getList();
    this.m_addEntries.replaceChildren();
    this.m_filterInput.value = '';
    entries.forEach(entry => this.m_addEntries.appendChild(this.createEntryElement(entry)));
    this.m_children = Array.from(this.m_addEntries.children) as HTMLElement[];
  }

  protected onHideDone() {
    this.m_children = [];
    this.m_addEntries.replaceChildren();
  }

  // endregion

  // region private method

  private createEntryElement(entry: CompareEntry): DocumentFragment {
    const element = this.m_entryTemplate.content.cloneNode(true) as DocumentFragment;
    const filterText = Text.normalizeForComparison(`${entry.original}${entry.food.name}`);
    const originalName = element.querySelector<HTMLElement>(DataAttribute.OriginalName)!;
    const foodName = element.querySelector<HTMLElement>(DataAttribute.FoodName)!
    const addButton = element.querySelector<HTMLButtonElement>(DataAttribute.AddButton)!
    originalName.innerText = entry.original;
    foodName.innerText = entry.food.name;
    addButton.addEventListener(
      'click', () => this.handleAddClick(entry)
    );
    originalName.setAttribute(FILTER_ATTRIBUTE, filterText);
    foodName.setAttribute(FILTER_ATTRIBUTE, filterText);
    addButton.setAttribute(FILTER_ATTRIBUTE, filterText);
    return element;
  }

  // endregion

  // region event handler

  private handleAddClick(entry: CompareEntry): void {
    applicationData.compareEntries.push(entry);
    mainController.back();
  }

  private handleFilterChange(): void {
    const filterValue = Text.normalizeForComparison(this.m_filterInput.value);
    this.m_children.forEach(child => {
      const filterText = child.getAttribute(FILTER_ATTRIBUTE) ?? '';
      child.classList.toggle(CssClass.Hidden, !filterText.includes(filterValue));
    });
  }

  // endregion
}

// endregion

// region exports

export const addPage = new AddPage();

// endregion