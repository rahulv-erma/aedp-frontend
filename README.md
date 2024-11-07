# aedp-frontend

## Run locally

Run the development server:

```bash
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see local site.


## Storybook

Storybook is set up so we can work on components outsidre app context. Toe of the enti run it simply use:

```bash
$ npm run storybook
```

## Code Formatting and Linting

Ensure your code adheres to the project's style guidelines by using the following commands:

### Check for Linting Issues

To identify any formatting or linting issues in the codebase:

```bash
npm run lint
```

### Automatically Fix Linting Issues

To fix most of the identified issues automatically:

```bash
npm run lint:fix
```

For issues that require manual attention, review the output of the lint command and make necessary adjustments.


## Backend mocks

An OpenAPI specification is available in the `openapi` folder. A package manifest is also available to enable running a mock server easily which can be used for connecting APIs without an active backend.

To start the mock server, install dependencies in that folder and start it:

```bash
$ cd openapi
$ npm install
$ npm start
```

You can also start the mock server yourself if you wish to change execution flags:

```bash
$ npx prism mock -p 8000 ./spec.yaml
```

Available endpoints may change in the future. Check out the list of them when the mock server is started.
