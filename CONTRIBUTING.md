# Contribution

The Pine Design System uses [Stencil.js](https://stenciljs.com/), which allows for building web components with TypeScript. This guide is written to outline how best to contribute to Pine and adhere to the best practices set by Kajabi's Design System team.

## Getting Started

### Dependencies

Pine requires Node `>=16`.

### Setting Up

[Fork and clone](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the Pine GitHub repository.

Please run the following commands for initial setup:

1. `cd pine`
2. `npm install`
3. `brew install mkcert`, if using Firefox run `brew install nss` instead
4. `mkcert -install`
5. `npm run setup`
6. `cd libs/core`
7. `mkcert -cert-file pineLocalDev.pem -key-file pineLocalDev-key.pem localhost 7300`
8. `cd ../..`

### Create a Branch

Once these steps have been completed and you're ready to code, create a new branch. We use the conventional branch naming convention. Branches that don't adhere to this style won't be able to be pushed, so be sure your branch begins with one of the accepted prefixes. For example, if you'd like to make any CSS changes to a component, you can create a branch similar to this:

```zsh
style/button-accent-update
```

### Generating New Components

To add new components, run the following command:

`npm run stencil.generate pds-[component name]`

When prompted, choose `*.scss Format`, then confirm. The initial component files will be generated. Once they are, you will need them to match other components. It may be best to copy any missing folders such as `stories/` and `docs/` from other components and update any imports or text to match.

### Starting the Dev Server

To spin up a local dev server and test your changes, run:

```zsh
npm run start
```

A local instance of Storybook will be served at `http://localhost:6006`.

### Coding Standards

Every component in Pine is well-tested. We ask that for any new features added to components that the corresponding documentation, end-to-end (E2E) tests, and spec tests are added for quality assurance.

We use prettier for linting and Stencil's built-in testing suite for testing TypeScript.

For linting, run:

```zsh
npm run lint.all
```

For spec and e2e testing, run:

```zsh
npm run test.all
```

### Submitting a Pull Request

Once the desired changes have been made, add and commit the necessary files. We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), so please be sure that your commit messages adhere to these standards.

First, ensure that the `main` branch is up to date.

```zsh
git checkout main
git pull upstream main
```

Then, rebase your branch against `main` and resolve conflicts.

```zsh
git checkout your/branch-name
git rebase main
```

The branch can now be pushed. When creating your pull request, please fill out the template with as much info as necessary, including before and after screenshots. Please tag `Kajabi/dss-devs` to notify the Design System team. Our standards require at least two accepted reviews before merging.

## Troubleshooting

Sometimes, the development environment will experience rendering issues while hot reloading. In most cases, this can be fixed by re-running the `npm run start` command. For any cases where this doesn't resolve the issue, please feel free to reach out to the team for support.
