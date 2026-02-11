// region imports

import {Tools} from '../classes/support/Tools';
import {foodData} from './data/foodData';
import {historyData} from "./data/historyData";
import {mainController} from "./main/mainController";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {DataAttribute} from "../types/DataAttribute";

// endregion

// region local constants

const CSV_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwlU_Al-u5JKhCjje6GZCNxdafpKBsZw2luPFZC8Vl6xd7eaNMjtJ3hxdrO8TGoYSS1In8WqEM3BEY/pub?output=csv';

// endregion

// region types

class Application {
  async run() {
    // first need to get rows
    const rows = await Tools.loadCSV(CSV_URL);
    foodData.import(rows);
    // the initialize data (that references food data)
    historyData.initialize();
    // install non-page specific listeners
    UFHtml.addListeners(
      DataAttribute.BackButton,
      'click',
      () => () => mainController.back()
    );
    // start the app
    mainController.start();
  }
}

// endregion

// region exports

export const application = new Application();

// endregion
