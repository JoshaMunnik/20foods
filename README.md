# 20 Foods

## Introduction

20 Foods is a simple web application that the user can use to track the food they consumed and
reach their weekly goal of 20 different food items.

## Installation

1. Change folder to `foods_app`
2. Run `npm install` to install dependencies

To update, run either:
- `npm run build` to build the application
- `npm run watch` to keep building the application and watch for changes

In both cases both the development and production versions of the application will be built. 

## Technical details

The application is a SPA (single page application) using TypeScript and rollup for building. 

A tiny bit of PHP is used to add a timestamp to the JavaScript and CSS files to prevent caching
issues.

The food data is imported from a Google Sheet url. 

The user data is stored in the browsers local storage.

## Icons

Icons are based on art from https://www.flaticon.com/authors/qadeer-hussain

