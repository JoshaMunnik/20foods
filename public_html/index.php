<?php

/**
 * Appends a timestamp query parameter to the given filename based on its last modification time.
 *
 * @param string $filename File and path relative to the current directory.
 *
 * @return string The filename with a query parameter for cache busting.
 */
function timestamped(string $filename): string
{
  return $filename.'?v='.filemtime(__DIR__.'/'.$filename);
}

?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta
      name="description"
      content="A web app to help you to reach the goal of eating 20 different food items each week."
    />
    <title>20 foods | loading</title>
    <link rel="icon" type="image/png" href="favicon.png"/>
    <link rel="stylesheet" href="<?= timestamped('css/main.css') ?>"/>
  </head>
  <body>
    <main class="tp-page__container">

      <section id="add-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <div class="tp-header__filler"></div>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input
            type="text"
            id="add-filter-input"
            class="tp-form__input"
            placeholder="filter..."
          />
        </header>
        <div
          id="add-entries"
          class="tp-page__content tp-page__content--is-scrollable tp-grid tp-grid--has-three-columns-expand-first"
        >
          <template id="add-entry-template">
            <div class="tp-text" data-tp-original-name></div>
            <div class="tp-text tp-text--truncate" data-tp-food-name></div>
            <button class="tp-button tp-button--is-icon tp-button--is-success" data-tp-add-button>
              <span class="tp-icon tp-icon__plus"></span>
            </button>
          </template>
        </div>
      </section>

      <section id="confirm-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <div class="tp-header__filler"></div>
          <button
            id="confirm-save-button"
            class="tp-button tp-button--is-header"
            aria-label="Save"
          >
            Save
          </button>
          <button
            id="confirm-add-button"
            class="tp-button tp-button--is-header-icon tp-button--is-success"
            aria-label="Add"
          >
            <span class="tp-icon tp-icon__plus"></span>
          </button>
        </header>
        <p id="confirm-none" class="tp-page__content">
          Use the + button at the top right to add food you consumed.
        </p>
        <div
          id="confirm-entries"
          class="tp-page__content tp-page__content--is-scrollable tp-grid tp-grid--has-three-columns-expand-first"
        >
          <template id="confirm-entry-template">
            <div class="tp-text" data-tp-original-name></div>
            <div class="tp-text tp-text--truncate" data-tp-food-name></div>
            <button
              class="tp-button tp-button--is-icon tp-button--is-danger"
              data-tp-remove-button
            >
              <span class="tp-icon tp-icon__minus"></span>
            </button>
          </template>
        </div>
      </section>

      <section id="dictation-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <div class="tp-header__filler"></div>
          <span id="dictation-status" class="tp-header__text"></span>
          <button
            id="dictation-pause-button"
            class="tp-button tp-button--is-header-icon"
            aria-label="Pause"
          >
            ⏸
          </button>
          <button
            id="dictation-record-button"
            class="tp-button tp-button--is-header-icon tp-button--is-danger"
            aria-label="Record"
          >
            ⏺
          </button>
          <button
            id="dictation-stop-button"
            class="tp-button tp-button--is-header-icon tp-button--is-success"
            aria-label="Stop"
          >
            ⏹
          </button>
        </header>
        <div class="tp-page__content">
          <p class="tp-text">
            Say one or more food names. To stop either say 'done', 'stop' or 'finished';
            or press the stop button.
          </p>
          <div id="dictation-recorded-text" class="tp-form__multiline"></div>
        </div>
      </section>

      <section id="history-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <h4>History</h4>
        </header>
        <div
          id="history-entries"
          class="tp-page__content tp-page__content--is-scrollable tp-grid tp-grid--has-three-columns-expand-second"
        >
          <template id="history-entry">
            <div class="tp-layout__column tp-text">
              <span data-tp-start-date></span>
              <span class="tp-text tp-text--is-small" data-tp-end-date></span>
            </div>
            <div class="tp-text tp-text--is-large tp-text--align-end">
              <span data-tp-food-count></span>&nbsp;&nbsp;
            </div>
            <button class="tp-button tp-button--is-icon" data-tp-view-button>
              ▶
            </button>
          </template>
        </div>
      </section>

      <section id="home-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <h2 class="tp-header__title">
            <span class="tp-logo">
              <span class="tp-logo-20">20</span>
              <span class="tp-logo-1">F</span>
              <span class="tp-logo-2">o</span>
              <span class="tp-logo-3">o</span>
              <span class="tp-logo-4">d</span>
              <span class="tp-logo-5">s</span>
            </span>
          </h2>
          <div class="tp-header__filler"></div>
          <button
            id="history-button"
            class="tp-button tp-button--is-header-icon"
            aria-label="History"
          >
            📋
          </button>
          <button
            id="settings-button"
            class="tp-button tp-button--is-header-icon"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </header>
        <div class="tp-page__content tp-page__content--has-large-gap">
          <div class="tp-grid tp-grid--has-two-columns-expand-second tp-grid--align-baseline">
            <div class="tp-grid__column--align-end tp-text tp-text--is-label">
              goal:
            </div>
            <div class="tp-text tp-text--is-medium">
              <span id="food-count" class="tp-text--is-large"></span> of 20
            </div>
            <div class="tp-grid__label">
              days left:
            </div>
            <div class="tp-text tp-text--is-medium">
              <span id="day-count"></span>
            </div>
            <div class="tp-grid__label">
              week start:
            </div>
            <div class="tp-text">
              <span id="week-start"></span>
            </div>
            <div class="tp-grid__label">
              today:
            </div>
            <div class="tp-text">
              <span id="today"></span>
            </div>
          </div>
          <div
            class="tp-buttons__container tp-buttons__container--is-centered"
          >
            <button
              id="dictate-button"
              class="tp-button tp-button--is-big-icon"
              aria-label="Record"
            >
              🎤
            </button>
            <button
              id="manual-button"
              class="tp-button tp-button--is-big-icon"
              aria-label="Add"
            >
              📝
            </button>
          </div>
          <p id="missing-speech-recognition" class="tp-text">
            Your browser does not support speech recognition.
          </p>
        </div>
      </section>

      <section id="loading-page" class="tp-page">
        <div class="tp-page__content tp-page__content--is-centered">
          Loading...
        </div>
      </section>

      <section id="settings-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <h4>Settings</h4>
        </header>
        <div class="tp-page__content tp-page__content--has-large-gap">
          <div class="tp-form__item">
            <label for="week-start-select" class="tp-form__label">First day of the week:</label>
            <select id="week-start-select" class="tp-form__select">
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
          <div class="tp-buttons__container tp-buttons__container--is-centered">
            <button
              id="clear-history-button"
              class="tp-button tp-button--is-danger"
            >
              Clear history
            </button>
          </div>
        </div>
      </section>

      <section id="week-page" class="tp-page tp-page--is-hidden">
        <header class="tp-header__container">
          <button
            class="tp-button tp-button--is-header-icon"
            data-tp-back-button
            aria-label="Back"
          >
            ⬅
          </button>
          <div class="tp-layout__column">
            <div id="week-start-title" class="tp-text"></div>
            <div id="week-end-title" class="tp-text tp-text--is-small"></div>
          </div>
        </header>
        <div id="food-entries" class="tp-page__content tp-page__content--is-scrollable tp-grid tp-grid--has-three-columns-expand-first">
          <template id="food-entry">
            <div data-tp-food-name></div>
            <div data-tp-category-name></div>
            <div>
              <button class="tp-button" data-tp-expand-button>
                ▼
              </button>
              <button class="tp-button" data-tp-collapse-button>
                ▲
              </button>
            </div>
            <div
              class="tp-grid__child-grid tp-grid--has-two-columns-expand-second tp-grid--align-baseline"
              data-tp-food-history-entries>
            </div>
          </template>
          <template id="food-history-entry">
            <div class="tp-grid__label tp-text tp-text--is-small" data-tp-food-history-date></div>
            <div class="tp-text tp-text--truncate" data-tp-food-history-name></div>
          </template>
        </div>
      </section>

    </main>
    <script src="<?= timestamped('js/bundle.min.js') ?>" type="module"></script>
  </body>
</html>
