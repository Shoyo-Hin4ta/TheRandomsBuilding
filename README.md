
```
TheRandomsBuilding
├─ .DS_Store
└─ DietAnalyzer
   ├─ .DS_Store
   ├─ backend
   │  ├─ .babelrc
   │  ├─ .env
   │  ├─ .env.test
   │  ├─ .prettierignore
   │  ├─ .prettierrc
   │  ├─ coverage
   │  │  ├─ clover.xml
   │  │  ├─ coverage-final.json
   │  │  ├─ lcov-report
   │  │  │  ├─ base.css
   │  │  │  ├─ block-navigation.js
   │  │  │  ├─ controllers
   │  │  │  │  ├─ index.html
   │  │  │  │  └─ user.controller.js.html
   │  │  │  ├─ favicon.png
   │  │  │  ├─ index.html
   │  │  │  ├─ models
   │  │  │  │  ├─ index.html
   │  │  │  │  └─ user.model.js.html
   │  │  │  ├─ prettify.css
   │  │  │  ├─ prettify.js
   │  │  │  ├─ sort-arrow-sprite.png
   │  │  │  ├─ sorter.js
   │  │  │  └─ utils
   │  │  │     ├─ ApiError.js.html
   │  │  │     ├─ ApiResonse.js.html
   │  │  │     └─ index.html
   │  │  └─ lcov.info
   │  ├─ jest.config.js
   │  ├─ jest.setup.js
   │  ├─ package-lock.json
   │  ├─ package.json
   │  ├─ public
   │  │  └─ temp
   │  ├─ src
   │  │  ├─ app.js
   │  │  ├─ constant.js
   │  │  ├─ controllers
   │  │  │  ├─ meal.controller.js
   │  │  │  ├─ recipe.controller.js
   │  │  │  ├─ reportgenerate.controller.js
   │  │  │  └─ user.controller.js
   │  │  ├─ db
   │  │  │  └─ index.js
   │  │  ├─ index.js
   │  │  ├─ middlewares
   │  │  │  ├─ auth.middleware.js
   │  │  │  └─ multer.middleware.js
   │  │  ├─ models
   │  │  │  ├─ meal.model.js
   │  │  │  ├─ recipe.model.js
   │  │  │  └─ user.model.js
   │  │  ├─ routes
   │  │  │  ├─ auth.route.js
   │  │  │  ├─ meal.route.js
   │  │  │  ├─ recipe.route.js
   │  │  │  ├─ report.route.js
   │  │  │  └─ user.route.js
   │  │  └─ utils
   │  │     ├─ ApiError.js
   │  │     ├─ ApiResponse.js
   │  │     └─ cloudinary.js
   │  ├─ temp
   │  └─ tests
   │     └─ integration
   │        └─ auth.test.js
   └─ frontend
      ├─ .env
      ├─ README.md
      ├─ components.json
      ├─ craco.config.js
      ├─ jsconfig.json
      ├─ package-lock.json
      ├─ package.json
      ├─ public
      │  ├─ favicon.ico
      │  ├─ index.html
      │  ├─ logo192.png
      │  ├─ logo512.png
      │  ├─ manifest.json
      │  └─ robots.txt
      ├─ src
      │  ├─ App.css
      │  ├─ App.js
      │  ├─ App.test.js
      │  ├─ __tests__
      │  │  └─ components
      │  │     └─ Auth
      │  │        ├─ SignIn.test.js
      │  │        └─ SignUp.test.js
      │  ├─ components
      │  │  ├─ Auth
      │  │  │  ├─ AuthForm.js
      │  │  │  ├─ Layout.js
      │  │  │  ├─ SignIn.js
      │  │  │  └─ SignUp.js
      │  │  ├─ Dashboard
      │  │  │  ├─ Analysis.js
      │  │  │  ├─ NutritionChart.js
      │  │  │  └─ index.js
      │  │  ├─ GeneratePDF
      │  │  │  └─ GenerateReport.js
      │  │  ├─ Hero
      │  │  │  └─ Hero.js
      │  │  ├─ MealLogging
      │  │  │  ├─ DateSelector
      │  │  │  │  └─ index.js
      │  │  │  ├─ ImageCapture
      │  │  │  │  └─ index.js
      │  │  │  ├─ IngredientComponents
      │  │  │  │  ├─ IngredientEntry.js
      │  │  │  │  ├─ IngredientEntrySystem.js
      │  │  │  │  └─ SavedIngredientsList.js
      │  │  │  ├─ MealComponents
      │  │  │  │  ├─ MealAnalysisDialog.js
      │  │  │  │  ├─ MealDisplayCards.js
      │  │  │  │  ├─ MealEntryForm.js
      │  │  │  │  ├─ MealSizeSelector.js
      │  │  │  │  └─ MealTypeSelector.js
      │  │  │  └─ index.js
      │  │  ├─ RecipeGeneration
      │  │  │  ├─ AllRecipes
      │  │  │  │  └─ index.js
      │  │  │  ├─ IngredientList.js
      │  │  │  ├─ RecipeCard.js
      │  │  │  ├─ RecipeForm.js
      │  │  │  └─ index.js
      │  │  └─ ui
      │  │     ├─ alert.jsx
      │  │     ├─ badge.jsx
      │  │     ├─ button.jsx
      │  │     ├─ calendar.jsx
      │  │     ├─ card.jsx
      │  │     ├─ checkbox.jsx
      │  │     ├─ dialog.jsx
      │  │     ├─ dropdown-menu.jsx
      │  │     ├─ input.jsx
      │  │     ├─ label.jsx
      │  │     ├─ popover.jsx
      │  │     ├─ select.jsx
      │  │     ├─ skeleton.jsx
      │  │     ├─ tabs.jsx
      │  │     ├─ textarea.jsx
      │  │     ├─ toast.jsx
      │  │     └─ toaster.jsx
      │  ├─ index.css
      │  ├─ index.js
      │  ├─ lib
      │  │  └─ utils.js
      │  ├─ logo.svg
      │  ├─ pages
      │  │  └─ HomePage.js
      │  ├─ reportWebVitals.js
      │  ├─ services
      │  │  └─ mealService.js
      │  ├─ setupTests.js
      │  ├─ store
      │  │  ├─ appStore.js
      │  │  └─ slice
      │  │     └─ userSlice.js
      │  └─ utils
      │     ├─ axios.js
      │     ├─ constants.js
      │     ├─ dateUtils.js
      │     ├─ helpers.js
      │     └─ validation.js
      └─ tailwind.config.js

```