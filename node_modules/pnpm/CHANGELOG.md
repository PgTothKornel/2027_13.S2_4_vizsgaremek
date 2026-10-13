# pnpm

## 12.11.2

This release fixes `--workspace-concurrency=Infinity`, filters set by an `updateConfig` hook, and store fetches with `enable-modules-dir=false`.

### Patch Changes

- `--workspace-concurrency=Infinity` now runs workspace projects with no concurrency limit. It used to fail with `invalid digit found in string` [#16793](https://github.com/pnpm/pnpm/issues/16793).

- `pnpm install` and other recursive commands now apply the `filter` and `filterProd` that an `updateConfig` hook sets. They used to run on every workspace project [#16792](https://github.com/pnpm/pnpm/issues/16792).

- `enable-modules-dir=false` now also fetches the packages an install reuses from an existing lockfile, so the store holds every package the lockfile lists.

## 12.11.1

This release fixes two ways `pnpm install` could fail, runs tools of any Rust release through `pnx`, and treats `registry.npmjs.com` as an alias of the npm registry.

### Patch Changes

- `pnpm install` no longer fails when `packageManager` pins the pnpm version that is already running and the registry does not publish that version. pnpm warns and continues. A registry mirror that has not synced a release no longer blocks the commands of a project pinned to it.

- `pnpm install` no longer fails with `ERR_PNPM_CMD_SHIM_CHMOD` when `node_modules/.bin` holds a shim that another user created, if everyone can already execute it and it is not world-writable. This happens when several users share one checkout.

- `enable-modules-dir=false` (`enableModulesDir: false` through the Node.js addon) fetches the registry packages the host can install into the store again, as pnpm v10 did, while still writing nothing under `node_modules`. The setting exists for a `node_modules` that something else mounts from the store, such as a FUSE daemon, and that consumer no longer has to download each package on first access. A plain `--lockfile-only` run still fetches nothing.

- `pnpm pack` and `pnpm publish` no longer put `.npmignore` and `.gitignore` files in the tarball. A `files` entry that names one still ships it.

- pnpm now treats `https://registry.npmjs.com/` as an alias of `https://registry.npmjs.org/`. Registry requests, credentials, and trusted publishing use the canonical hostname.

- `pnx --package=rust@<channel> <tool>` runs a tool of that Rust release, for example `pnx --package=rust@nightly-2026-01-01 cargo build`. pnpm installs the release with the components and targets from `rust-toolchain.toml` and the target of each `--target` argument.

- `pnpm install` now links agent skills for more coding agents. It detects the agent from `ANTIGRAVITY_AGENT`, `COPILOT_AGENT`, `COPILOT_CLI`, `CODEX_THREAD_ID`, `CODEX_SANDBOX`, `AI_AGENT`, and `CLAUDE_CODE` [pnpm/tasks#116](https://github.com/pnpm/tasks/issues/116).

- When the registry rejects `pnpm stage publish`, the error message now starts with "Failed to stage package".

## 12.11.0

This release adds Rust toolchain management, links the agent skills that dependencies ship, adds the `permissions` setting, and keeps the colors of streamed script output.

### Minor Changes

- `pnpm install` now links the agent skills that direct dependencies ship under `skills/<name>/SKILL.md` into the project's agent skill directories, such as `.claude/skills`. A package's skills are linked only after you approve them with `pnpm approve`. The `skills.dirs` setting chooses the directories [pnpm/rfcs#35](https://github.com/pnpm/rfcs/pull/35).

  Added the `permissions` setting, which records what each dependency may do. Its `build` capability works like `allowBuilds` and takes precedence over it. `pnpm approve-builds` writes to `permissions` when `pnpm-workspace.yaml` already has it, and to `allowBuilds` otherwise.

  Added `pnpm permissions`, which lists the granted and denied permissions and the packages awaiting approval. `pnpm approve` reviews build scripts and agent skills in one prompt [pnpm/rfcs#36](https://github.com/pnpm/rfcs/pull/36).

- pnpm now installs and runs Rust toolchains.

  - With `cargo.enabled`, `pnpm install` installs the toolchain named in `rust-toolchain.toml`. pnpm verifies the release signature, stores the toolchain once per machine, and links it into `.pnpm/rust`. `pnpm run` and `pnpm exec` put its `cargo` and `rustc` on the `PATH`.
  - `pnpm add -g rust@<channel>` installs a toolchain globally. The `cargo` and `rustc` commands run it outside projects that pin their own. `pnpm update -g`, `pnpm ls -g`, and `pnpm remove -g` manage it like any global package.
  - In a project, `pnpm add rust@<channel>` pins the toolchain in `rust-toolchain.toml`.
  - `pnpm shim add rust` adds project-aware shims for `cargo`, `rustc`, and the other Rust tools. In a project with a `rust-toolchain.toml`, they run the toolchain the file names and install it on first use. Elsewhere, the next command of the same name on `PATH` runs, such as rustup's.

- `pnpm run` and `pnpm exec` now keep the colors of script output that they print under the project's name, such as with `--stream`. pnpm sets `FORCE_COLOR=1` for these scripts when its own output is in color, unless `FORCE_COLOR` is already set.

  Script output is also rendered more cleanly:

  - A line that a progress bar redraws with `\r` shows only its last state.
  - Escape codes that move the cursor or clear the screen are dropped.
  - Long colored lines are cut at the terminal width.
  - `pnpm -r run` no longer garbles its live output when a script fails while other scripts are still running.

### Patch Changes

#### Installing packages

- pnpm no longer panics with "unexpected error when polling the I/O driver" when it runs under QEMU user-mode emulation, such as a `linux/amd64` container on an Apple Silicon Mac [#16696](https://github.com/pnpm/pnpm/issues/16696).

- `pnpm view`, `pnpm update`, and other commands that read registry metadata now work behind proxies that end a response by closing the connection without a TLS `close_notify` alert [#16704](https://github.com/pnpm/pnpm/issues/16704).

- pnpm now switches to the version a project pins in `packageManager` or `devEngines.packageManager` even when `pnpm-workspace.yaml` has a setting the running pnpm cannot read, such as a `lockfile.includeResolutionSettings` section. If pnpm does not switch, it still reports that setting [#16675](https://github.com/pnpm/pnpm/issues/16675).

- When the `pnpm` package has to download its native binary on first run, it now uses the registry and credentials from `.npmrc` and from the `npm_config_registry` and `pnpm_config_registry` environment variables. `COREPACK_NPM_REGISTRY` still takes precedence. A project `.npmrc` is not read when `COREPACK_INTEGRITY_KEYS` turns off the signature check [#16655](https://github.com/pnpm/pnpm/issues/16655).

- `pnpm install` and `pnpm add --config` now apply `minimumReleaseAge` when they resolve a config dependency. A config dependency range resolves to the newest version that is old enough, so a later clean `pnpm install --frozen-lockfile` accepts the lockfile [#16660](https://github.com/pnpm/pnpm/issues/16660).

- `pnpm remove` with `catalogPrune` no longer removes catalog entries that `pnpm-lock.yaml` still records for workspace projects missing from disk. Before, a following frozen install failed with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` [#16679](https://github.com/pnpm/pnpm/issues/16679).

- With `cargo.enabled`, `pnpm install` now writes the source replacement for vendored crates into `.pnpm/crates/config.toml` and includes it as optional from `.cargo/config.toml`. A checkout without `.pnpm` builds with plain Cargo [#16659](https://github.com/pnpm/pnpm/issues/16659).

- With `nodeLinker.type` set to `loaded`, Node.js now stops with `ERR_PNPM_LOADER_UNSUPPORTED_NODE` when it preloads the store loader on a version the loader cannot serve. The supported versions are `^24.18.0 || >=26.2.0`. On other versions, CommonJS packages imported from ESM failed with `Cannot find module` on their first relative `require()`.

- On Windows, `pnpm install` no longer fails with "The filename, directory name, or volume label syntax is incorrect" when a package contains a file whose name is invalid on Windows, such as `icon.svg?as=metadata.d.ts`. pnpm removes the invalid characters from the name and prints a warning that lists the renamed files.

- On Windows, hoisting no longer fails intermittently with link errors when a junction is created or replaced concurrently [pnpm/tasks#53](https://github.com/pnpm/tasks/issues/53).

#### Resolving dependencies

- `pnpm install --no-optional` now installs the peer dependencies a project declares when `autoInstallPeers` is on. The lockfile marked such a peer `optional: true` when another dependency had it as an optional peer.

- `pnpm install` and `pnpm dedupe` now link an optional peer to the workspace package that the workspace root depends on when the picked version matches it. They installed the registry package with the same name and version [#16706](https://github.com/pnpm/pnpm/issues/16706).

- Removal overrides such as `"debug>supports-color": "-"` now also apply to an optional peer that a package declares only in `peerDependenciesMeta` [#16681](https://github.com/pnpm/pnpm/issues/16681).

- `pnpm add` and other installs that re-resolve dependencies now keep the locked `devEngines.runtime` version while it still satisfies the declared range [#16764](https://github.com/pnpm/pnpm/issues/16764).

- `pnpm audit --fix update` now updates only the dependencies whose locked version is vulnerable [#14928](https://github.com/pnpm/pnpm/issues/14928).

- `pnpm outdated` and `pnpm update --interactive` now apply `overrides` before they look up the latest version. Before, a dependency overridden to an npm alias was compared with the latest version of the package the override replaces [#16719](https://github.com/pnpm/pnpm/issues/16719).

#### Patched dependencies

- Patches saved with CRLF line endings now apply, including a patch that creates or deletes a file. pnpm rejected the git headers of such a patch with `ERR_PNPM_INVALID_PATCH` and the message `invalid file mode: 100644` [#16641](https://github.com/pnpm/pnpm/issues/16641).

- A patch that changes a file's mode, such as adding or removing the executable bit, now applies the new mode on Unix [pnpm/tasks#110](https://github.com/pnpm/tasks/issues/110).

#### Injected dependencies and deploy

- With `sharedWorkspaceLockfile: false`, an injected workspace package installed in the same run as its dependent now holds only the files its `files` field selects. The copy also held other files of the project, such as `tsconfig.json` [#16683](https://github.com/pnpm/pnpm/issues/16683).

- A script listed in `syncInjectedDepsAfterScripts` no longer fails when it rewrites `package.json` while pnpm is copying its edits into the injected copies. The sync after the script now replaces a half-copied manifest.

- `pnpm deploy` with a shared lockfile no longer fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` for `settings.dedupeInjectedDeps` or `settings.dedupePeerDependents` when `lockfile.includeResolutionSettings` is enabled. The deployed lockfile now records both settings as `false`, the values the deploy installs with.

- `pnpm deploy` now writes the dependencies in the deployed `package.json` sorted by name. It also sorts the `allowBuilds` entries in the deployed `pnpm-workspace.yaml`. Repeated deploys of the same lockfile now produce identical files [#16687](https://github.com/pnpm/pnpm/issues/16687).

#### Packing and publishing

- `pnpm pack` and `pnpm publish` now match `.npmignore` and `.gitignore` rules the way npm does. A negation such as `!lib/**` or `!lib/**/!(*.map)` re-includes files under a directory that an earlier `*` rule excluded [#16743](https://github.com/pnpm/pnpm/issues/16743).

- `pnpm pack` and `pnpm publish` no longer always include root files that merely start with `README`, `LICENSE`, or `LICENCE`, such as `README_INTERNAL.md`. Only `README`, `LICENSE`, `LICENCE`, and `COPYING`, with or without an extension, ship regardless of `files` and `.npmignore`, as in npm [#16753](https://github.com/pnpm/pnpm/issues/16753).

- `pnpm publish --provenance=false` and `--no-provenance` now turn off provenance under trusted publishing, so a package can be published from a self-hosted runner. Setting `provenance: false` in `pnpm-workspace.yaml` does the same [#16721](https://github.com/pnpm/pnpm/issues/16721).

#### Speed and resource use

- `pnpm install` hardlinks files from a group-writable or world-writable store again. pnpm copied every file from such a store into `node_modules` [#16677](https://github.com/pnpm/pnpm/issues/16677).

- A repeat `pnpm install` no longer imports patched packages and packages with build scripts again when nothing changed. Their builds no longer run again either. This happened when `recursiveInstall` was `false` or the project had a `file:` dependency [#16705](https://github.com/pnpm/pnpm/issues/16705).

- Verifying the lockfile against `trustPolicy` and `minimumReleaseAge` uses less memory. pnpm no longer keeps every published version's manifest of each checked package in memory until the install ends [#16656](https://github.com/pnpm/pnpm/issues/16656).

- `pnpm rebuild <pkg>` and `pnpm rebuild --pending` no longer read the manifest of every installed package to find build scripts. Only the selected packages are inspected and built. On a large `node_modules` served lazily, such as over a network or FUSE mount, this turned a rebuild of a few packages into a fetch of every package.

- `pnpm rebuild` no longer removes and recreates `node_modules` when the settings recorded in `node_modules/.modules.yaml` differ from the current configuration. The rebuild runs the build scripts against the installed packages as they are.

- `pnpm store prune` now compacts the store's `index.db` after removing package entries, so the file shrinks again [#16717](https://github.com/pnpm/pnpm/issues/16717).

#### Registry commands

- `pnpm whoami`, `pnpm bugs`, `pnpm docs`, `pnpm repo`, `pnpm star`, `pnpm unstar`, and `pnpm stars` now honor the `--registry` option.

- `--registry` now takes precedence over a scope's configured registry for scoped packages in `pnpm access`, `pnpm view`, `pnpm repo`, `pnpm star`, `pnpm unstar`, `pnpm owner`, `pnpm deprecate`, `pnpm undeprecate`, `pnpm unpublish`, `pnpm dist-tag`, `pnpm team`, and `pnpm stage`. Without `--registry`, `pnpm access` now sends a scoped package or scope to the registry configured for that scope.

- Registry commands now keep the path of a registry URL such as `https://example.com/npm/` when they build request URLs. This applies to `pnpm access`, `pnpm owner`, `pnpm ping`, `pnpm search`, `pnpm star`, `pnpm stars`, `pnpm team`, `pnpm unstar`, and `pnpm whoami`.

- `pnpm view` now honors the network retry settings.

- `pnpm repo` now fetches the repository URLs of several packages in parallel.

## 12.10.1

This release fixes `pnpm install` failures after an `overrides` change and on a filtered frozen install with `catalogPrune`. It also fixes several bugs in the experimental `nodeLinker.type: loaded`, which now keeps its generated files in `node_modules`.

### Patch Changes

- With `nodeLinker.type: loaded`, pnpm now writes its generated files to `node_modules`, which projects already ignore in git. The store manifest and loader are `node_modules/.pnpm/.store-manifest.json` and `node_modules/.pnpm/.store-loader.mjs`. Bin shims are in `node_modules/.bin`.

  Earlier versions wrote `.pnpm-store.json` and `.pnpm-store-loader.mjs` to the project root, and a `.pnpm` directory to the root and to each workspace package. Delete them after reinstalling.

- With `nodeLinker.type: loaded`, packages that ship their own `node_modules` directory, such as `npm` with its bundled dependencies, now load from the store. Before, one such package in the install stopped every Node.js process from starting.

- With `nodeLinker.type: loaded`, scripts can now run a Node.js runtime installed through `devEngines.runtime`. Before, every script that called `node` re-ran its own shim until it failed with "Argument list too long".

- With `nodeLinker.type: loaded`, Node.js processes start faster. In a project with 13,000 stored files, the startup overhead per process dropped from 67 ms to 18 ms.

- `pnpm install` no longer fails with `ERR_PNPM_NO_MATCHING_VERSION` after a change to `overrides` when the lockfile resolves an optional peer dependency to an npm alias of another package [#16654](https://github.com/pnpm/pnpm/issues/16654).

- A frozen install with `catalogPrune` no longer removes catalog entries that `pnpm-lock.yaml` still records. Before, `pnpm install --frozen-lockfile --filter` failed with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` when some workspace projects were missing from disk [#16638](https://github.com/pnpm/pnpm/issues/16638).

- `pnpm install --fix-lockfile` no longer removes the `deprecated` and `hasBin` fields from lockfile entries [#6600](https://github.com/pnpm/pnpm/issues/6600).

- With `enableGlobalVirtualStore`, an install that updates `node_modules` now repairs a package in the global virtual store that an interrupted install left without some of its dependency links or package files. Before, such an install kept the incomplete package if the project's `node_modules` already recorded it [#16642](https://github.com/pnpm/pnpm/issues/16642).

- `pnpm install` now skips the Cargo and Python projects inside a nested directory that has its own `pnpm-workspace.yaml` or `.git` directory, such as a git worktree of the same workspace or a separate clone.

- The `Request took` warning for package metadata now starts timing when pnpm sends the request. Before, it also counted the time the request waited for a free request slot, so large installs printed it for requests the registry answered quickly.

## 12.10.0

This release adds an experimental `loaded` node linker, lets `pnpm-lock.yaml` record resolution settings, and reads cached registry metadata faster. It also carries several security fixes, including one that stops a dependency version from writing files outside the global virtual store.

### Minor Changes

- Added experimental `nodeLinker: { type: loaded }` installation. Compatible dependencies load directly from the content-addressable store through an automatically registered Node.js loader. `nodeLinker.excluded` selects packages and their dependency trees to install in the global virtual store.

- `lockfile.includeResolutionSettings: true` makes `pnpm-lock.yaml` record `autoDedupe`, `dedupeInjectedDeps`, `dedupePeerDependents` and `linkWorkspacePackages`. Installs then treat a lockfile that records other values as outdated. A lockfile that records `autoDedupe` is reused by later installs on any machine, so `pnpm run` after `pnpm install --frozen-lockfile` no longer starts another install [#16583](https://github.com/pnpm/pnpm/issues/16583).

### Patch Changes

#### Security

- `pnpm install` now prevents dependency versions with path traversal from writing files outside the global virtual store.

- pnpm now verifies locked config dependencies against their registry before installing them. Config dependencies must come from an npm registry. The lockfile can no longer replace the integrity of a config dependency pinned with `version+integrity`.

- Lockfile verification now checks the tarballs inside a `variations` resolution against the registry. A `name@version` lockfile entry with an empty `variations` resolution is now rejected.

- `pnpm audit signatures` now verifies signatures against the integrity recorded in the lockfile. Packages without a recorded integrity cannot pass signature verification.

- `pnpm install` and `pnpm publish` now reject archive metadata larger than 64 MiB before reading it into memory. Publishing a pre-built tarball also rejects manifests and README files larger than 64 MiB.

- Two URL or local path dependencies no longer share a virtual store directory when one URL has `+`, `#`, `:`, or `?` where the other has `/`. Such dependencies, including git dependencies pinned with `#`, now get a hash suffix on their directory name.

- The warning about an ignored project `.npmrc` registry setting no longer prints the username and password of a URL-scoped key such as `//user:password@registry.example.com/${PATH}/:_authToken`.

#### Installing and resolving dependencies

- `pnpm install` now fails with `ERR_PNPM_UNSUPPORTED_PROTOCOL` when a dependency uses a specifier with a protocol pnpm does not support, such as Yarn's `patch:`. On Windows, such a specifier failed with `os error 123`. On other platforms, pnpm linked it to a directory that does not exist. Reading a `package.json` that fails now names the file [#16590](https://github.com/pnpm/pnpm/issues/16590).

- `pnpm install` now fails with `ERR_PNPM_PACKAGE_MANIFEST_INVALID_ATTRIBUTE` when a project declares a dependency whose specifier is not a string, such as `"is-positive": 42`. Before, the dependency was silently left out of the lockfile. A `readPackage` hook can still correct the specifier.

- Fixed `pnpm install` failing with `ERR_PNPM_CMD_SHIM_RESOLVE_PATH` when an executable's parent directory contains a dangling symlink.

- `pnpm install --frozen-lockfile` no longer fails with `ERR_PNPM_RESOLUTION_SHAPE_MISMATCH` when a `name@version` lockfile entry has a resolution served by a custom fetcher [pnpm/tasks#108](https://github.com/pnpm/tasks/issues/108).

- `pnpm install --fix-lockfile` repairs a lockfile whose importer references a package that has no snapshot entry, as left by a badly merged lockfile. It failed with `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` since 12.8.0 [#16618](https://github.com/pnpm/pnpm/issues/16618).

- When a dependency moves an exact dependency of its own to an older version, a peer dependency that pnpm installed automatically now moves with it. Before, `pnpm install` and `pnpm dedupe` kept the newer locked version of the peer, so the lockfile held two copies of it, for example two copies of `vue` [pnpm/tasks#61](https://github.com/pnpm/tasks/issues/61).

- `pnpm dedupe` now reads registry metadata for a dependency pinned to an exact version, as `pnpm install` does. If the registry metadata disagreed with the package's `package.json`, the lockfile it wrote depended on whether `minimumReleaseAge` was set [#16615](https://github.com/pnpm/pnpm/issues/16615).

#### Speed and size

- Dependency resolution reads cached registry metadata faster. The metadata cache moved to `<cache-dir>/v12/`, so the first install after upgrading downloads registry metadata again. A damaged cache entry is downloaded again, or reported as an error when `--offline` is set. `pnpm cache prune` also removes the metadata cache that older pnpm versions wrote under `<cache-dir>/v11/` [#13512](https://github.com/pnpm/pnpm/pull/13512).

- Package metadata requests no longer wait behind queued tarball downloads when `maxSockets` or a proxy limits the connections to a registry. Large installs resolve faster and print fewer `Request took` warnings.

- Sped up installs in large workspaces on macOS when the dependency links already exist. pnpm now keeps a link that already points at the right package without trying to create it first. Relinking the direct dependencies of 1,000 workspace projects took 45 ms, down from 116 ms [pnpm/tasks#65](https://github.com/pnpm/tasks/issues/65).

- Commands in a project that pins a different pnpm version start about 13 ms faster on macOS. pnpm now runs the pinned version's binary directly, without the shell script in front of it [pnpm/tasks#66](https://github.com/pnpm/tasks/issues/66).

- The pnpm binary is about 0.9 MB smaller, and the arm64 Linux binary is about 1 MB smaller still.

#### Running scripts and commands

- `pnpm run` no longer prints `[ELIFECYCLE] Command failed ...` after Ctrl+C ends the script. pnpm still exits the way the script's shell did: on Windows with the shell's exit code (`cmd` reports `-1073741510`, PowerShell `1`), on Unix by re-raising `SIGINT` [#16579](https://github.com/pnpm/pnpm/issues/16579).

- `pnpm run "/<regex>/"` now accepts JavaScript regular expression syntax such as lookahead and lookbehind. A selector like `"/^hello:(?!b).*$/"` failed with `ERR_PNPM_NO_SCRIPT` [#16604](https://github.com/pnpm/pnpm/issues/16604).

- `pnpm run` and `pnpm exec` now forward `--config.*` command-line flags to the install started by `verifyDepsBeforeRun` [pnpm/tasks#60](https://github.com/pnpm/tasks/issues/60).

- On Windows, a process started by `pnpm run` or `pnpm exec` can again start a child with `CREATE_BREAKAWAY_FROM_JOB`. That child keeps running after pnpm exits, even if the command fails [#16628](https://github.com/pnpm/pnpm/issues/16628).

- Empty `nodeOptions` values from command-line flags and environment variables now override lower-priority settings. Scripts retain `NODE_OPTIONS` from the parent environment or `extraEnv` when `nodeOptions` is empty.

- pnpm now reads the `failIfNoMatch` setting from `pnpm-workspace.yaml`, so a filter that matches no workspace project exits with code 1 when the setting is `true`. The new `--no-fail-if-no-match` flag turns the setting off for one command [#16577](https://github.com/pnpm/pnpm/issues/16577).

#### Configuration, setup, and pnpm versions

- `pnpm config get --global` and `pnpm config list --global` now show only the global configuration, also when run inside a project. Settings from the project's `pnpm-workspace.yaml` and `.npmrc` were included before. The same applies to `--location=global` [#16598](https://github.com/pnpm/pnpm/issues/16598).

- pnpm now prints config warnings, such as an unset environment variable in `.npmrc`, when loading the config fails.

- pnpm 11 releases older than 11.28.4 can run pnpm 12 again when the `packageManager` field pins it. Since 12.9.0 they failed with `SyntaxError: Invalid or unexpected token` [#16594](https://github.com/pnpm/pnpm/issues/16594).

- On Windows, `pnpm self-update` no longer runs the update a second time when it replaces a `pnpm.cmd` linked by pnpm 12.8 or older. cmd.exe read on in the replaced `pnpm.cmd`, printed an error about a command that is not recognized, and ran the new pnpm once more [#16573](https://github.com/pnpm/pnpm/issues/16573).

- `pnpm setup` now puts `$PNPM_HOME/bin` first on `PATH` in login shells that inherited it further down, such as the VS Code terminal on macOS. Before, another `node` took precedence over the one installed by `pnpm runtime set node -g`. Run `pnpm setup` again to update the block in your shell config [#16635](https://github.com/pnpm/pnpm/issues/16635).

- `pnpm setup` now names the shell config file even if it is already up to date [#16608](https://github.com/pnpm/pnpm/issues/16608).

#### Updating, auditing, and publishing

- `pnpm update --latest` now applies the `savePrefix` setting when it rewrites a dependency whose range has no operator of its own, such as `<2.0.0`.

- The interactive `pnpm audit --fix` picker now shows each patched version with the `saveExact` and `savePrefix` style that the override is written with [#13209](https://github.com/pnpm/pnpm/issues/13209).

- `pnpm unpublish <pkg>@<version>` now deletes the tarball under the registry's path when the registry is served under one, such as Gitea's npm registry. It used to send the delete to the host root and report success without removing the version [#16568](https://github.com/pnpm/pnpm/issues/16568). It also no longer mistakes a sibling path such as `/npm-mirror/` for the registry path `/npm/` [pnpm/tasks#94](https://github.com/pnpm/tasks/issues/94).

#### Output and messages

- A warning about a project's `devEngines` or `packageManager` pin is now printed to stderr. A command such as `pnpm cache path` or `pnpm list --json` keeps only its own output on stdout [#16584](https://github.com/pnpm/pnpm/issues/16584).

- `pnpm list` now reports the correct package paths when `nodeLinker` is `hoisted` [#9593](https://github.com/pnpm/pnpm/issues/9593).

- Resolution errors now name the failing dependency and its parent packages. Fatal errors appear as structured error records with their error codes when using `--reporter=ndjson`.

- The error for an invalid git repository in the lockfile now has the code `ERR_PNPM_INVALID_GIT_REPOSITORY`. Its message now lists every rejected form of the value.

- `pnpm runtime --help` and `pnpm help runtime` now name the `set` subcommand and the runtimes it accepts [#16580](https://github.com/pnpm/pnpm/issues/16580).

## 12.9.1

This release moves the WebContainer build into a separate `@pnpm/wasm` package, shrinks the `pnpm` package back to about 4 MB, and fixes `pnpm publish` with provenance from GitLab CI.

### Patch Changes

- The WebAssembly build for StackBlitz WebContainers now ships as a separate `@pnpm/wasm` package. The `pnpm` and `@pnpm/exe` packages no longer include it, which brings their unpacked size back from about 55 MB to about 4 MB. In a WebContainer, install `@pnpm/wasm` with npm to get the `pnpm` command.

- `pnpm publish` with provenance from GitLab CI is no longer rejected by the npm registry with a 422 error. The provenance statement now includes the GitLab CI variables in `invocation.parameters`, as npm does [#16551](https://github.com/pnpm/pnpm/issues/16551).

- `pnpm audit signatures` now uses the TLS settings of the redirect target when a registry redirects its signing-keys request, for example to registry.npmjs.org. A `cafile` scoped to a private registry no longer makes the redirected request fail [#16541](https://github.com/pnpm/pnpm/issues/16541).

- Fixed `pnpm install --frozen-lockfile` rejecting an up-to-date lockfile when an injected workspace package uses a catalog entry in `peerDependencies` [#16557](https://github.com/pnpm/pnpm/issues/16557).

- The `[<since>]` filter selector works again with Git 2.24 through 2.27 [#16561](https://github.com/pnpm/pnpm/issues/16561). With Git older than 2.24, the selector now fails with an error that names the required Git version.

  It also detects changes in projects whose directory names contain non-ASCII characters. Such a change used to be credited to the parent project. `changedFilesIgnorePattern` and `testPattern` now match changed files whose names contain non-ASCII characters.

- The `pnpm` executable is about 10% smaller. On macOS arm64 it went from 45.1 MB to 40.3 MB.

- Sped up trust downgrade checks for packages with long release histories.

- With `optimisticRepeatInstall: false`, `pnpm install` now runs the projects' own lifecycle scripts, such as `prepare`, even when `node_modules` is already up to date [#16545](https://github.com/pnpm/pnpm/issues/16545).

- `pnpm self-update` now fails for Homebrew-installed pnpm and prints the `brew upgrade` command for the installed formula, such as `brew upgrade pnpm` or `brew upgrade pnpm@11`. It used to install a second copy of pnpm that the Homebrew one kept shadowing [#16547](https://github.com/pnpm/pnpm/issues/16547).

## 12.9.0

This release runs pnpm in StackBlitz WebContainers, adds a per-registry `networkConcurrency` setting, and records every installed project in the store. It also carries a security fix for `pnpm login`.

### Minor Changes

- pnpm now automatically uses WebAssembly in StackBlitz WebContainers, including when installation scripts are disabled. Native installations continue to use the native executable when installation scripts are enabled.

- A `registries` entry can now set `networkConcurrency`, the most requests pnpm keeps in flight to that registry's origin. Requests to other registries keep the overall limit. The setting may live in `pnpm-workspace.yaml` or the global `config.yaml`.

  ```yaml
  registries:
    https://npm.corp.example.com/:
      scopes: ["@acme"]
      networkConcurrency: 4
  ```

- `pnpm install` now records every project it installs in the store's `projects` directory, as a symlink to the project directory. A `--frozen-store` install without the global virtual store still records nothing. Only projects that used the global virtual store were recorded before [#6929](https://github.com/pnpm/pnpm/issues/6929).

### Patch Changes

- `pnpm login` no longer forwards credentials in its request body to another origin during redirects.

#### Installing packages

- Fixed `pnpm install` failing on Android with `ERR_PNPM_STORE_DIR_ACQUIRE_OPERATION_LOCK` [#16508](https://github.com/pnpm/pnpm/issues/16508).

- `pnpm install --frozen-lockfile` again succeeds when a workspace project recorded in `pnpm-lock.yaml` has no directory, such as a project left out of a Docker build context. It still fails if the project's directory exists without a `package.json` [#16453](https://github.com/pnpm/pnpm/issues/16453).

- `pnpm install --frozen-lockfile` no longer requires a `pnpm-lock.yaml` in a project that has no dependencies. It also succeeds when `pnpm-lock.yaml` records only the pinned pnpm version, as other commands write it when they run before the first install [#16477](https://github.com/pnpm/pnpm/issues/16477).

- Fixed `pnpm install --frozen-lockfile` rejecting a fresh lockfile when an injected workspace dependency has an optional peer supplied by another workspace project [#16428](https://github.com/pnpm/pnpm/issues/16428).

- With `nodeLinker: hoisted`, a filtered install now keeps the packages of the workspace projects an earlier install put in `node_modules`. This also covers the install that `pnpm --filter <selector> run` and `pnpm --filter <selector> exec` start before the command. Before, these installs removed every package that only the unselected projects needed [#16483](https://github.com/pnpm/pnpm/issues/16483).

- `pnpm install` with `nodeLinker: hoisted` now refreshes directories supplied by custom fetchers when reinstalling. pnpm also keeps the symlinks inside those directories.

- With `enableGlobalVirtualStore` on, scripts can run entry points that a CommonJS require hook loads again, such as `ts-node index.ts`. They failed with `ERR_UNKNOWN_FILE_EXTENSION` on Node.js versions without built-in TypeScript support [#16436](https://github.com/pnpm/pnpm/issues/16436).

- pnpm now keeps each project's current lockfile and hidden hoisted dependencies in its own `node_modules/.pnpm` when `virtualStoreDir` points at a shared global virtual store. `--virtual-store-dir` now sets the global virtual store's location too [pnpm/tasks#47](https://github.com/pnpm/tasks/issues/47).

- `pnpm clean` no longer deletes the project when `virtualStoreDir` or `globalVirtualStoreDir` is set to the project directory. It also leaves a directory outside the project alone when the setting reaches it through a symlink. It now removes a global virtual store that `globalVirtualStoreDir` places inside the project, as it does for `virtualStoreDir`.

#### Optional dependencies

- `pnpm install` no longer fails when a dependency of an optional dependency is missing from the registry. Like npm, pnpm now leaves out the nearest optional dependency above it, together with its subtree [#16511](https://github.com/pnpm/pnpm/issues/16511).

- When an optional dependency fails to build, pnpm now removes its link from `node_modules`. A repeat `pnpm install` then reports "Already up to date" and no longer reruns the failing build [#16468](https://github.com/pnpm/pnpm/issues/16468).

- `pnpm install` now prints a warning with the error when an optional dependency cannot be fetched and is skipped. The skipped package is no longer counted in the `Packages: +N` summary. The `pnpm:skipped-optional-dependency` log reports the skip with the `fetch_failure` reason [#16514](https://github.com/pnpm/pnpm/issues/16514).

#### Resolving dependencies

- Fixed `pnpm install` changing an unchanged project's direct dependency to a sibling workspace's pinned version when its dependency tree contains a cycle [#16417](https://github.com/pnpm/pnpm/issues/16417).

- With `autoDedupe` enabled, downgrading a dependency in one workspace project now moves the other projects to that version when it satisfies their ranges. This also applies to a filtered `pnpm --filter <project> add` [#16432](https://github.com/pnpm/pnpm/issues/16432).

- `pnpm install` and `pnpm dedupe` now move an optional peer to the version already in the dependency graph when no other package provides its locked version anymore. After a bump such as `vue` 3.5.40 to 3.5.43, the lockfile kept a second copy of `@vue/server-renderer` for `@vue/test-utils` [#16443](https://github.com/pnpm/pnpm/issues/16443).

- `pnpm dedupe --check` no longer fails right after `pnpm install` when a project's optional peer is satisfied by a package another workspace project installs. `pnpm dedupe` now picks the same versions for that package's dependencies as `pnpm install` [#16447](https://github.com/pnpm/pnpm/issues/16447).

- `pnpm install` no longer re-resolves an up-to-date lockfile on every run when a patched package is a peer in a peer cycle [#16418](https://github.com/pnpm/pnpm/issues/16418).

- With `autoDedupe` enabled, `pnpm install --lockfile-only` no longer resolves the dependency graph again when nothing changed since an earlier `--lockfile-only` install deduplicated the lockfile. Such an install keeps the lockfile even if versions were published since it was written, or if only a setting such as `resolutionMode` changed. Run `pnpm dedupe` to apply such a change [#16458](https://github.com/pnpm/pnpm/issues/16458).

#### Speed and network

- A repeat `pnpm install` in a large workspace reports "Already up to date" faster [#16487](https://github.com/pnpm/pnpm/issues/16487).

- Sped up dependency resolution of workspaces with many peer dependencies.

- `pnpm install` sends fewer registry metadata requests when the lockfile already decides which version a range resolves to. This now also covers ranges that several locked versions satisfy when one of them outranks the others, and direct dependencies kept at their locked version. Packages that `minimumReleaseAgeExclude` lists without a version now reuse cached registry metadata the same way they do when `minimumReleaseAge` is not set [#16458](https://github.com/pnpm/pnpm/issues/16458).

- pnpm no longer downloads every packument again on each install from a registry whose metadata responses forbid caching, such as `Cache-Control: no-store`. pnpm revalidates the cached metadata with a conditional request, so a registry that supports conditional requests answers with a 304 when the package has not changed [#16528](https://github.com/pnpm/pnpm/issues/16528).

- Cached metadata for a package published within `minimumReleaseAge` is now revalidated with its ETag, so the npm registry can answer `304 Not Modified`. Before, the next install that checked the cache downloaded the whole document again [#16506](https://github.com/pnpm/pnpm/issues/16506).

- A fetch timeout while other downloads from the same host are still running now lowers concurrency for that host to one connection. Retries of that request, and later downloads from that host, use the lower concurrency. Other hosts keep the configured concurrency [#12791](https://github.com/pnpm/pnpm/issues/12791).

- Sped up `pnpm install --offline` when the version a range picks is not in the store. While it looks for a version the store holds, pnpm now reads only the versions the range admits [#16495](https://github.com/pnpm/pnpm/issues/16495).

- `pnpm install --offline` now reuses config dependency tarballs that are already present in the store [pnpm/tasks#46](https://github.com/pnpm/tasks/issues/46).

#### Running scripts

- `pnpm -s <script>` runs the script again, with `-s` meaning `--sequential` as it does for `pnpm run -s <script>`. pnpm rejected it with "unexpected argument '-s' found" [#16446](https://github.com/pnpm/pnpm/issues/16446).

- `pnpm run` and `pnpm exec` now warn and run the command when the install that `verifyDepsBeforeRun` starts fails. This lets scripts run in sandboxes where pnpm cannot install, such as containers with a read-only store or no network [#15173](https://github.com/pnpm/pnpm/issues/15173).

- A filtered `pnpm run` or `pnpm exec` now finds dependencies out of date when a workspace dependency of a selected project has no `node_modules` directory, as after a filtered install. With `verifyDepsBeforeRun: install`, pnpm installs that dependency before running the command [pnpm/tasks#45](https://github.com/pnpm/tasks/issues/45).

- Scripts run without a terminal no longer start a second `sh` each. One watchdog per pnpm command now ends every script's process group if pnpm is killed, so `pnpm -r run` across many projects starts half as many processes [#16489](https://github.com/pnpm/pnpm/issues/16489).

- `Terminate batch job (Y/N)?` no longer appears after pressing Ctrl+C in a script started with `pnpm` from PowerShell or cmd on Windows [#16502](https://github.com/pnpm/pnpm/issues/16502).

- `pnpm rebuild` and `pnpm approve-builds` refresh command launchers when a build changes a command's interpreter or replaces it with a native executable. Dependent packages' build scripts use the refreshed launchers.

- When `pnpm run <script>` or `pnpm <script>` finds nothing to run and `--filter` follows the script name, the error now suggests putting the filter option before the script name [#4655](https://github.com/pnpm/pnpm/issues/4655).

- Package-name filters now support `?` to match one character [#2817](https://github.com/pnpm/pnpm/issues/2817).

#### The pinned pnpm and `pnpm self-update`

- pnpm no longer downloads the project's pinned pnpm version again on every command when `nodeVersion` in `pnpm-workspace.yaml` names a different Node.js major than the `node` on `PATH`. Before, each of those commands took about a second longer and failed without network access [#16497](https://github.com/pnpm/pnpm/issues/16497).

- Several `pnpm` commands started at once in a project that pins `packageManager` no longer fail with `The process cannot access the file because it is being used by another process` on Windows while the pinned pnpm is being installed.

- pnpm can now switch to a `packageManager` version below 11 on x64 musl Linux, such as Alpine [#16467](https://github.com/pnpm/pnpm/issues/16467).

- A `devEngines.packageManager` range no longer makes pnpm replace the version recorded in `pnpm-lock.yaml` with the running pnpm while the recorded version still satisfies the range. When pnpm does record a version, it records the running pnpm only if it meets `minimumReleaseAge`. Otherwise it records the newest version in the range that meets it, or the running pnpm if none does [#16431](https://github.com/pnpm/pnpm/issues/16431).

- On Windows, `pnpm self-update` now replaces a `pnpm.exe` left in `PNPM_HOME` or in `PNPM_HOME\bin`. Windows ran that executable in place of the updated `pnpm.cmd` shim, so `pnpm --version` kept printing the old version after a successful update. If the executable was in `PNPM_HOME`, `self-update` now asks you to run `pnpm setup` [#9094](https://github.com/pnpm/pnpm/issues/9094).

- `pnpm self-update` now checks that a version installed as the JavaScript `pnpm` can start before making it the global `pnpm`. If Node.js is missing, the update fails and the current `pnpm` stays in place.

#### Other commands

- `pnpm deploy` now finds patches and local dependencies when the target directory sits under a symlink, such as `/tmp` on macOS. It failed with `ERR_PNPM_PATCH_NOT_FOUND` [#16470](https://github.com/pnpm/pnpm/issues/16470).

- `pnpm deploy --legacy` now resolves the deployed project's relative `file:`, `link:`, and path dependencies from the project's own directory [#16475](https://github.com/pnpm/pnpm/issues/16475).

- `pnpm update --global` now removes hard-linked executables from `PNPM_HOME` when migrating packages from the old global layout [#16420](https://github.com/pnpm/pnpm/issues/16420).

- `pnpm store prune` no longer fails on store index entries that pnpm 11 wrote for git-hosted packages without a `package.json`. Entries that still cannot be read are kept and counted in the prune summary.

- `pnpm store prune` now aborts when an error other than a missing directory occurs while scanning project directories in the mark phase.

- `pnpm config get` and `pnpm config list` now report a setting given on the command line with `--config.<name>=<value>`. Before, a value such as `--config.node-linker=hoisted` reached the install but was absent from the reported configuration [#16276](https://github.com/pnpm/pnpm/issues/16276).

- `pnpm -r pkg get` now reports every selected project when several share a package name. Projects with the same name are keyed by their directory relative to the workspace root. Before, only one of them appeared in the output.

- The install summary shows a `link:` dependency as `+ name <- path`, and the Node.js API's `hideLinkedPkgsDiff` reporter option leaves matching linked dependencies out of the summary.

- The `--force` help text of `pnpm install` and `pnpm add` now says that `--force` keeps skipping optional dependencies built for other platforms. It points to `forceIgnoresPlatform` and the `--os`, `--cpu`, and `--libc` options for installing them [#16435](https://github.com/pnpm/pnpm/issues/16435).

- The `homepage` field of the published `pnpm` package points to https://pnpm.io again.

## 12.8.2

pnpm 12.8.2 fixes a startup crash on Linux ppc64le and `UnknownIssuer` errors on systems without CA certificates. `pnpm run` no longer installs before every script on CI when `autoDedupe` is enabled, and resolution and hoisted installs on macOS are faster.

### Patch Changes

#### Platforms and environments

- Fixed pnpm crashing on startup on Linux ppc64le [#16380](https://github.com/pnpm/pnpm/issues/16380).

- Fixed installs failing with `UnknownIssuer` on Linux systems without CA certificates, such as `node:24-slim`, when `NODE_EXTRA_CA_CERTS` is set. The extra certificates now extend the bundled CA roots [#16365](https://github.com/pnpm/pnpm/issues/16365).

- pnpm now creates its store operation locks and other per-user lock files in `$XDG_RUNTIME_DIR` when it points to a directory only the user can write to. Otherwise, pnpm still uses `/tmp` on Linux and macOS. Sandboxes that block writes to `/tmp` can point `XDG_RUNTIME_DIR` at a writable directory [#16390](https://github.com/pnpm/pnpm/issues/16390).

- POSIX bin shims and the `pnpm`, `pn`, `pnpx`, and `pnx` launchers now run inside a Nix build, where the system default path holds none of the utilities they call. Installing again replaces the shims already in `node_modules` [#16377](https://github.com/pnpm/pnpm/issues/16377).

- In a project that pins another pnpm version, pnpm now passes a command with an option it does not know to the pinned version. Before, pnpm rejected the option before switching, so `pnpm install --auto-dedupe` failed with "Unknown option" even though the pinned pnpm supports it [#16353](https://github.com/pnpm/pnpm/issues/16353).

#### Installing and resolving dependencies

- `pnpm install --frozen-lockfile` now fails when `Cargo.lock` does not satisfy a dependency requirement in `Cargo.toml`. The error names the crate and the version the lockfile holds [#16355](https://github.com/pnpm/pnpm/issues/16355).

- `pnpm install` returns "Already up to date" again in a workspace with injected workspace dependencies and a shared lockfile. Since 12.7.0 every repeat install in such a workspace ran the full install and copied the injected projects again.

- With `injectWorkspacePackages: true`, a fresh `pnpm install` now records a workspace dependency as `link:` when its injected copy differs from the project only by an optional peer that peer-dependent dedupe merges. It was recorded as a peer-suffixed `file:` copy [#16354](https://github.com/pnpm/pnpm/issues/16354).

- `pnpm dedupe --check` now passes right after `pnpm dedupe` when deduplication merges variants of a package that differ only in their peers. A lockfile key whose peer suffix named a merged variant now names the variant that replaced it [#16356](https://github.com/pnpm/pnpm/issues/16356).

- When `minimumReleaseAge` hides the version that `latest` points to, pnpm now falls back to a prerelease of the same major before a stable version of an older major. A stable version of the same major is still preferred. Before, while a new `1.0.0` was too new, `latest` fell back to an old `0.0.1` even though `1.0.0-beta.4` had been `latest` until then [#16388](https://github.com/pnpm/pnpm/issues/16388).

- Git-hosted dependencies now respect `pmOnFail`. If it is set to anything other than `download`, a git-hosted dependency that pins a pnpm version is prepared by the running pnpm, and pnpm does not download the pinned version [#16376](https://github.com/pnpm/pnpm/issues/16376).

- pnpmfile hooks such as `readPackage` now run once for a dependency that several packages request at the same time. They could run twice for it before.

- `childConcurrency` now defaults to 5, the documented value. It used to be capped at 4 and to follow the host's CPU count.

#### Running scripts

- `pnpm run` and `pnpm exec` no longer install dependencies before every script on CI when `autoDedupe` is enabled. `pnpm install --frozen-lockfile` now keeps the deduplication record left by an earlier install [#16374](https://github.com/pnpm/pnpm/issues/16374).

- On macOS and Linux, lifecycle scripts and `pnpm run` now always get `PATH` from the `PATH` variable. When the environment also held a `Path` variable, a script sometimes got `Path`'s value, and failed with `node: not found` [#16308](https://github.com/pnpm/pnpm/issues/16308).

- `pnpm run` now exits after a `SIGTERM` in a container where pnpm is PID 1 and the script runs pnpm again, as `"start": "pnpm serve"` does. Since 12.6.0 it kept waiting after the script had shut down, until the container runtime killed it.

#### Other commands and settings

- `pnpm config get globalShims`, `pnpm shim list`, and global installs no longer read `globalShims` from a project's `pnpm-workspace.yaml`. Only the global config file, the pnpm home's own `pnpm-workspace.yaml`, and `PNPM_CONFIG_GLOBAL_SHIMS` set it, so a repository cannot choose which globally installed packages get project-aware shims.

- `pnpm config set --location=project` refuses a machine-level setting such as `stateDir` or `scope` with `ERR_PNPM_CONFIG_SET_NOT_A_PROJECT_SETTING`, which names where the setting belongs. `pnpm config delete` still clears such a key from a project's `pnpm-workspace.yaml`.

- `pnpm deploy` no longer fails with `ERR_PNPM_DEPLOY_AMBIGUOUS_PEER` in a workspace with `injectWorkspacePackages: true` when a workspace package lists its peer dependency as a dev dependency too [#16375](https://github.com/pnpm/pnpm/issues/16375).

- `pnpm deploy` no longer copies the workspace root's `packageManager` and `devEngines.packageManager` fields into the deployed `package.json` [#16403](https://github.com/pnpm/pnpm/issues/16403).

- `pnpm publish` now includes bare `README` files and README files with Markdown extensions such as `readme.markdown` in registry metadata [#12704](https://github.com/pnpm/pnpm/issues/12704).

- `pnpm store prune` now removes the packages that only expired `pnpm dlx` cache entries used. They were left in the store until the next `pnpm store prune` [#16383](https://github.com/pnpm/pnpm/discussions/16383).

#### Performance

- Sped up dependency resolution in large workspaces, and when many dependencies request different ranges of the same package. Resolution also uses less memory.

- Sped up `pnpm install` with `nodeLinker: hoisted` on macOS when the lockfile is re-resolved, such as with `autoDedupe` enabled [#16397](https://github.com/pnpm/pnpm/issues/16397).

- Sped up extracting package tarballs.

- `pnpm install` without `--frozen-lockfile` is faster on some machines in projects with a `pnpm-workspace.yaml`. Those installs linked with one worker thread per core, half of what a frozen install uses.

- On Windows, warm `pnpm install --frozen-lockfile` runs are 4-5% faster on 4- and 8-core machines. pnpm now links with one worker thread per core on Windows, between 4 and 16. This changes frozen installs and installs in projects without a `pnpm-workspace.yaml` on machines with 3 to 15 cores.

## 12.8.1

pnpm 12.8.1 fixes `pnpm install --frozen-lockfile` rejecting lockfiles with injected workspace packages that have peers, restores the executable bit on files of local directory dependencies, makes `pnpm dedupe` converge, and uses less CPU on many-core machines.

### Patch Changes

- `pnpm install --frozen-lockfile` no longer rejects a freshly generated lockfile when an injected workspace package has peer dependencies [#16332](https://github.com/pnpm/pnpm/issues/16332).

- Executable files in a `file:` directory dependency or an injected workspace package keep their executable bit again. Since 12.8.0, pnpm installed these files without the permissions they have in their project.

- `pnpm dedupe` now reaches a stable lockfile when a package's peer suffix is long enough to be hashed. Before, each run could switch that package's key between the hashed and the spelled-out suffix, so `pnpm dedupe --check` always failed [#16331](https://github.com/pnpm/pnpm/issues/16331).

- `pnpm install --frozen-lockfile`, the default in CI, now uses less CPU on machines with more than 8 cores. Warm installs on many-core Windows machines got up to 10% faster. Frozen installs now link with at most 16 worker threads.

- `verifyDepsBeforeRun` no longer reports dependencies as outdated after a filtered install just because `pnpm-lock.yaml` has a newer modification time. It checks the lockfile against the packages that install put in place. Before, `pnpm run` reinstalled the whole workspace with lifecycle scripts on, for example after a Docker `COPY` brought in a lockfile with a newer mtime [#16322](https://github.com/pnpm/pnpm/issues/16322).

  After a filtered install, `verifyDepsBeforeRun` now also checks that the install put the selected projects' dependencies in place. A `node_modules` directory alone no longer counts as proof.

- `pnpm run` and `pnpm exec` no longer install a project that has never been installed and has nothing to install. Such a project declares no dependencies, no peer dependencies that `autoInstallPeers` would fetch, and no install lifecycle scripts. The command now runs without writing `node_modules` or `pnpm-lock.yaml` [#16313](https://github.com/pnpm/pnpm/issues/16313).

- `pnpm update -g --latest` now upgrades globally installed packages beyond their saved version ranges [#16320](https://github.com/pnpm/pnpm/issues/16320).

## 12.8.0

pnpm 12.8.0 warns when `pnpm pack` or `pnpm publish` would ship a `.env` file that `files` does not list, installs `sharedWorkspaceLockfile: false` workspaces concurrently, applies every setting passed as `--config.<name>=<value>`, and no longer leaves the Windows terminal stuck after Ctrl+C in a script.

### Minor Changes

- `pnpm pack` and `pnpm publish` now warn when the tarball includes a `.env` or `.env.*` file that the `files` field of `package.json` does not list. Templates such as `.env.example` are not reported. List the file in `files` to publish it on purpose, or exclude it in `.npmignore` or `.gitignore` [#7826](https://github.com/pnpm/pnpm/issues/7826).

- `pnpm pack` now honors `--silent`, `--reporter=silent`, and `--loglevel=silent` to hide the tarball contents and summary. With `--json`, lifecycle script output and the final JSON output remain visible [#10297](https://github.com/pnpm/pnpm/issues/10297).

### Patch Changes

#### Installing packages

- Installing through a `pnpr` server now records the pnpmfile checksum in the lockfile, so a later `pnpm install --frozen-lockfile` accepts that lockfile [#14460](https://github.com/pnpm/pnpm/issues/14460). A frozen install through the pnpr server now fails if the pnpmfile changed. If the pnpmfile defines a `readPackage`, `afterAllResolved` or `preResolution` hook or custom resolvers, pnpm resolves dependencies locally and prints a warning that the pnpr server was not used.

  Installing through a `pnpr` server also links a workspace project at the directory its `publishConfig.directory` names. A server that does not forward the setting makes the install fail with `ERR_PNPM_PNPR_PUBLISH_DIRECTORY_MISMATCH`, so pnpm never writes a lockfile that points at the wrong directory. The server rejects a `publishConfig.directory` that points outside its project.

- Installing a git-hosted dependency that has to be built no longer fails when that dependency's own dependencies have build scripts nobody approved. pnpm skips those builds while preparing the dependency, as it does without `strictDepBuilds` [#9764](https://github.com/pnpm/pnpm/issues/9764).

- A git-hosted dependency that is a pnpm workspace with no committed lockfile is now detected as a pnpm project [#14011](https://github.com/pnpm/pnpm/issues/14011).

- `pnpm install --dev` and `pnpm fetch --dev` now install the optional dependencies of devDependencies, such as the platform binaries of Biome and oxlint. The project's own `optionalDependencies` are still skipped [#9678](https://github.com/pnpm/pnpm/issues/9678).

- `pnpm install --offline` and `pnpm add --offline` now resolve a version range to the newest matching version whose tarball is already in the store. They used to pick the newest version in the cached metadata and fail with `ERR_PNPM_NO_OFFLINE_TARBALL` when its tarball was missing [#10715](https://github.com/pnpm/pnpm/issues/10715).

- If an offline install fails because the registry metadata cache uses the layout from before pnpm 11.27 and 12.4, the error now names the older mirror on disk and explains that one online install repopulates the cache. The error also carries the `ERR_PNPM_NO_OFFLINE_META` code. `pnpm cache prune --help` now says that pnpm 11.26 and earlier, and pnpm 12.3 and earlier, depend on the directories it removes [#15656](https://github.com/pnpm/pnpm/issues/15656).

- Running `pnpm install` now refreshes dependencies when a package declared with a local `file:` directory changes its dependencies [#4623](https://github.com/pnpm/pnpm/issues/4623).

- A repeat `pnpm install` now keeps its fast up-to-date check when an override replaces a declared local `file:` dependency [#12892](https://github.com/pnpm/pnpm/issues/12892).

- `pnpm install` now removes an optional dependency from `node_modules` if its install script fails. Code that checks whether the package is installed no longer finds a package that cannot load [#8756](https://github.com/pnpm/pnpm/issues/8756).

- With `nodeLinker: hoisted`, `pnpm install` now restores a workspace project's `node_modules` after it was deleted. Before, the install printed "Already up to date" and left the project without the dependencies nested under it. On Windows, the install also no longer fails with "Access is denied" when another project's copy of a shared dependency links to the deleted directory.

- Under `nodeLinker: hoisted`, `pnpm install` now clears orphaned package directories that an interrupted or failed install leaves in a project's `node_modules`. A directory recorded by the previous install is removed, while an unrecorded directory is moved to `node_modules/.ignored`. A copy already in `.ignored` is never overwritten [#13676](https://github.com/pnpm/pnpm/issues/13676).

- Concurrent installs no longer fail when they replace the same stale hoisted dependency link. Virtual store cleanup now keeps the temporary lockfiles that concurrent installs write.

#### Resolving and linking dependencies

- `pnpm install` no longer aborts on a failed allocation of many gigabytes when peer dependency ranges combine overlapping `||` alternatives [#15867](https://github.com/pnpm/pnpm/issues/15867).

- `pnpm install` no longer fails when a package from the registry declares a `file:` dependency on a directory inside itself, such as `"@types/css-tree": "file:./typings/css-tree"`. pnpm links that dependency to the directory inside the package, as npm and Yarn do. The lockfile records it as `link:<root>/typings/css-tree` [#9141](https://github.com/pnpm/pnpm/issues/9141).

- An `npm:` alias written by `overrides` now stays in place when a change elsewhere makes pnpm re-resolve the aliased dependency. Before, pnpm could look up the alias name at the aliased version, which failed with `ERR_PNPM_NO_MATCHING_VERSION` or locked an unrelated package [#16309](https://github.com/pnpm/pnpm/issues/16309).

- A peer dependency no longer resolves to two different versions for one package. This happened when the package peer-depends on another package and on one of that package's peers, and it is installed deeper than a direct dependency of the package that provides them [#12098](https://github.com/pnpm/pnpm/issues/12098).

- An optional peer dependency is no longer resolved from another workspace project's package when the project provides one of that package's own peers at a version it rejects. This avoids bogus unmet peer errors [#13989](https://github.com/pnpm/pnpm/issues/13989).

- `pnpm dedupe` no longer changes the lockfile on every run when a nested peer dependency is provided through an npm alias [#15709](https://github.com/pnpm/pnpm/issues/15709).

- With `resolutionMode: time-based` and `minimumReleaseAge` both set, `pnpm install` no longer reports a subdependency as too new when only the time-based cutoff excludes it. Such subdependencies used to fail a strict install with `ERR_PNPM_NO_MATURE_MATCHING_VERSION`, or were added to `minimumReleaseAgeExclude` [#13569](https://github.com/pnpm/pnpm/issues/13569). A transitive dependency that has no matching version published before the time-based cutoff now resolves to the lowest matching version allowed by `minimumReleaseAge`. pnpm picks a version younger than `minimumReleaseAge` only if no older version matches [#16298](https://github.com/pnpm/pnpm/issues/16298).

- `pnpm install` retries registry metadata fetches that fail with a timeout, a dropped connection, or an interrupted response body before it applies `trustPolicy` or `minimumReleaseAge`. A transient fetch failure is not reported as `TRUST_DOWNGRADE` or `MINIMUM_RELEASE_AGE_VIOLATION` [#12031](https://github.com/pnpm/pnpm/issues/12031).

- pnpm's built-in package compatibility database no longer applies to a project's own manifest. A project named like a published package, such as `vue-loader`, no longer gains dependencies on `pnpm install` or `pnpm update`. User-configured `packageExtensions` still apply to project manifests [#11700](https://github.com/pnpm/pnpm/issues/11700).

- Packages in an external `virtualStoreDir` can resolve the project's direct dependencies selected by `hoistPattern`. Run `pnpm install --force` to repair an existing installation [#5652](https://github.com/pnpm/pnpm/issues/5652).

- `pnpm install` now links the executables of auto-installed peer dependencies into the workspace root's `node_modules/.bin`, including after a frozen-lockfile reinstall [#8511](https://github.com/pnpm/pnpm/issues/8511).

#### Lockfiles and frozen installs

- `pnpm install --frozen-lockfile` now works on a detached HEAD when `gitBranchLockfile` is enabled. The install reads the lockfiles of the local and remote-tracking branches that contain the checked-out commit. It still writes the shared `pnpm-lock.yaml` [#7672](https://github.com/pnpm/pnpm/issues/7672).

- `pnpm install --frozen-lockfile` now accepts a lockfile that has no importer entry for a workspace package without dependencies. Such a package added after the lockfile was written made the install fail with `ERR_PNPM_PACKAGE_MANAGER_NO_IMPORTER` [#15875](https://github.com/pnpm/pnpm/issues/15875).

- `pnpm install` now fails with `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` when an importer references a dependency version that has no snapshot entry. Before, the install succeeded and left a `node_modules` symlink pointing at a missing virtual-store directory [#14764](https://github.com/pnpm/pnpm/issues/14764).

- `pnpm install` on CI now fails on an outdated lockfile when `preferFrozenLockfile` is explicitly set to `true`. Setting it to `true` used to let CI update the lockfile [#9072](https://github.com/pnpm/pnpm/pull/9072).

- With `gitBranchLockfile` enabled, each emoji or other character outside the Basic Multilingual Plane in a branch name now becomes `!!` in the lockfile name. Before, each such character became one `!`.

#### Workspaces and filtering

- `pnpm install` in a workspace with `sharedWorkspaceLockfile: false` now installs projects concurrently, up to `workspaceConcurrency` at a time [#14480](https://github.com/pnpm/pnpm/issues/14480). A project is resolved, fetched, and written to its virtual store without waiting for the workspace projects it depends on. It waits for them only before it links its dependencies and runs its lifecycle scripts, so its scripts still run after theirs. A project with a `preinstall` or `pnpm:devPreinstall` script, or with an injected or `file:` workspace dependency, waits for its workspace dependencies before it starts.

  The installs of the projects also share their package metadata, lockfile verification, and store caches, so they use less CPU and memory when several projects depend on the same packages. An install with a pnpmfile no longer starts an extra Node.js process when the pnpmfile has no `preResolution` hook.

- With `enableGlobalVirtualStore` and `sharedWorkspaceLockfile: false`, each project now keeps its current lockfile and its hidden hoisted dependencies in its own `node_modules/.pnpm`. Before, every project wrote them to the workspace root's `node_modules/.pnpm`, so each repeat install treated the other projects' packages as its own and relinked them [#14480](https://github.com/pnpm/pnpm/issues/14480).

- `pnpm rebuild`, `pnpm approve-builds`, and `pnpm ignored-builds` now work on the current project's `node_modules` when they run inside a project of a workspace with `sharedWorkspaceLockfile: false`. They used to read the workspace root's `node_modules`, so `pnpm rebuild` did not rebuild the project's dependencies and created a second virtual store at the workspace root [#9402](https://github.com/pnpm/pnpm/issues/9402).

- `pnpm install` no longer creates a `node_modules` symlink inside the `publishConfig.directory` of a workspace package linked with `linkDirectory`. A build tool that cleaned its output directory through that symlink deleted the files of the package's dependencies. `pnpm install` also removes a symlink that an earlier install left there [#16226](https://github.com/pnpm/pnpm/issues/16226). It also no longer fails with `ERR_PNPM_CMD_SHIM_RESOLVE_PATH` when such a package has a `bin` field and its `publishConfig.directory` does not exist yet.

- `pnpm install` no longer fails for an injected workspace dependency whose package publishes from a `publishConfig.directory` that its own `prepare` script builds. The injected copy now picks up that directory once `prepare` finishes building it. `pnpm install --frozen-lockfile` no longer reports the dependency as outdated while the directory has not been built yet [#7811](https://github.com/pnpm/pnpm/issues/7811).

- An in-place edit to the source of an injected workspace package now shows up in its injected copy, unless a build writes to that package or `packageImportMethod` is set. pnpm hardlinks such packages under the default import method [#4410](https://github.com/pnpm/pnpm/issues/4410). Scripts listed in `syncInjectedDepsAfterScripts` now update injected dependencies while they run, so a watcher on the injected package, such as a dev server, sees each change before the script exits.

- With `sharedWorkspaceLockfile: false`, an injected workspace package that has lifecycle scripts is now hard linked into the projects that depend on it. Before, pnpm left a plain copy, so later edits to the package did not reach those projects [#9828](https://github.com/pnpm/pnpm/issues/9828).

- `injectWorkspacePackages` now hard links a workspace dependency declared with a relative path, such as `workspace:../foo`, the same way it already does for `workspace:*` [#10446](https://github.com/pnpm/pnpm/issues/10446).

- Workspace discovery prunes dot-prefixed directories, so a `packages` pattern such as `**` no longer matches projects inside `.cache` and other hidden directories [#16250](https://github.com/pnpm/pnpm/issues/16250).

- `pnpm import` in a workspace now keeps the versions pinned by a `yarn.lock` inside a workspace project [#4385](https://github.com/pnpm/pnpm/issues/4385).

#### Store and caches

- Files imported from the store now follow the umask of the install that writes them. Installing with a umask of `077` no longer leaves imported files readable by the group and others [#3807](https://github.com/pnpm/pnpm/issues/3807).

- `pnpm install` keeps the owner, group, and mode of files already in a shared store, including `index.db`. New store files and directories inherit the store directory's group-write bit. When that directory is setgid, new files inherit its group. pnpm does not change a file's owner or group [#12765](https://github.com/pnpm/pnpm/issues/12765).

- When `pnpm install` repairs a store file that was modified through a hard link in `node_modules`, the repair now keeps the file's inode on Linux and macOS, so hard-linked copies in other projects are healed at the same time. On Windows the repair still replaces the file, so other projects are healed on their next install [#3445](https://github.com/pnpm/pnpm/issues/3445).

- `pnpm install` now reports a full store at once when writing package files fails. It no longer retries the tarball [#8581](https://github.com/pnpm/pnpm/issues/8581).

- pnpm now warns when it cannot hard link packages from an existing store in the pnpm home directory and falls back to a store on the project's filesystem. This can happen when the project is on another filesystem, such as a bind-mounted workspace in a container. The warning names both stores and suggests setting `storeDir` [#14505](https://github.com/pnpm/pnpm/issues/14505).

- The side-effects cache now restores the symlinks that a build script creates inside a package. A warm install used to replace each of them with a copy of its target [#12859](https://github.com/pnpm/pnpm/issues/12859).

  After upgrading, every package with a build script is built once more.

- The global virtual store and the side-effects cache now key built packages by the Node.js version that the root project's `devEngines.runtime` or `engines.runtime` pins. That is the Node.js their build scripts run with. A dependency that declares its own `engines.runtime` no longer changes the key for every other package.

- With `enableGlobalVirtualStore`, an install into a fresh `node_modules` no longer runs the build scripts of a dependency whose global virtual store slot an earlier install already built. `pnpm rebuild` still runs them [#14480](https://github.com/pnpm/pnpm/issues/14480).

- Concurrent installs that share a global virtual store now run a package's build in its shared slot one at a time. A failed build leaves the slot in place and marks it for the next install to rebuild [#15568](https://github.com/pnpm/pnpm/issues/15568).

- A warm `pnpm install` reuses on-disk package metadata for five minutes when the registry does not send an ETag. Registries that send an ETag, including the public npm registry, still revalidate with a conditional request. `pnpm update` still fetches current metadata [#13976](https://github.com/pnpm/pnpm/issues/13976).

- pnpm no longer revalidates cached registry metadata when the registry sends `Cache-Control: max-age=0`, `no-cache`, or `no-store`. It downloads the metadata again, so a version newly published to such a registry is visible on the next install [#13487](https://github.com/pnpm/pnpm/issues/13487).

- `pnpm install` honors `Cache-Control` for dependencies named with an `http:` or `https:` tarball URL. A fresh response is taken from the store with no request, and a stale one is revalidated with `If-None-Match` [#15648](https://github.com/pnpm/pnpm/issues/15648).

#### Patched dependencies

- `pnpm install` now repairs a `pnpm-lock.yaml` whose `(patch_hash=<hash>)` dependency paths disagree with its `patchedDependencies` map, including paths that lack the hash their patch calls for. Before, pnpm accepted such a lockfile as up to date and kept the old patched files. `pnpm install --frozen-lockfile` now fails on such a lockfile with `ERR_PNPM_INCONSISTENT_PATCH_HASH`. It fails with `ERR_PNPM_UNCHECKABLE_PATCH_HASH` when a patch hash in the lockfile is malformed, or when the lockfile lacks the package version or patch entry that the check needs [#15336](https://github.com/pnpm/pnpm/pull/15336).

- `pnpm install` with `nodeLinker: hoisted` now applies a patch once to each copy of a patched dependency in a workspace. Before, a copy that several workspace projects shared could receive the patch twice and end up with the patched content duplicated [#7565](https://github.com/pnpm/pnpm/issues/7565).

- `pnpm install` and `pnpm fetch` now fail with `ERR_PNPM_PATCH_NOT_FOUND` when a patch file listed in `patchedDependencies` does not exist [#5268](https://github.com/pnpm/pnpm/issues/5268).

- `engineStrict` now checks the patched `package.json` when a `patchedDependencies` entry changes `engines`. A patch that relaxes `engines.node` no longer fails the install against the published range [#9603](https://github.com/pnpm/pnpm/issues/9603).

- `pnpm patch` now applies the existing patch file to the edit directory of a git-hosted dependency, as it already does for packages from the registry [#9699](https://github.com/pnpm/pnpm/issues/9699).

#### Adding, updating, and removing dependencies

- `pnpm add <dir>` now warns when the added directory declares peer dependencies, as `pnpm link` does. The directory is saved as a `link:` dependency, and its peers are not resolved from the project that adds it. Use the `file:` protocol to have them resolved [#5523](https://github.com/pnpm/pnpm/issues/5523).

- `pnpm add --save-types` no longer adds a `@types/*` package whose resolved version is deprecated. DefinitelyTyped publishes such stubs for packages that ship their own types, such as `@types/typescript` for `typescript` [#15636](https://github.com/pnpm/pnpm/issues/15636).

- `pnpm version`, `pnpm add`, and `pnpm pkg set` keep JSON5 style when they update `package.json5`. ASCII identifier keys stay unquoted, strings keep JSON5 quotes, and indented files keep trailing commas [#15717](https://github.com/pnpm/pnpm/issues/15717).

#### Running scripts and commands

- `pnpm run` and `pnpm exec` no longer install dependencies automatically when the root `package.json` still keeps `overrides`, `packageExtensions`, `patchedDependencies`, or `ignoredOptionalDependencies` in its `pnpm` field. pnpm no longer reads that field, so the install rewrote the lockfile without those settings. The command now fails and asks to move the settings to `pnpm-workspace.yaml` [#16278](https://github.com/pnpm/pnpm/issues/16278).

- When `verifyDepsBeforeRun` triggers an install before a filtered `pnpm run` or `pnpm exec`, pnpm now installs only the selected projects and their dependencies. A later filtered command also installs a selected project that an earlier filtered install skipped [#11865](https://github.com/pnpm/pnpm/issues/11865).

- `pnpm -r run /regexp/` now honors the `tasks` `dependsOn` declared for each script the selector matches, like running the script by name does. Matched scripts that depend on each other run in order. Each matched script runs once [#15596](https://github.com/pnpm/pnpm/issues/15596).

- `pnpm run` exits with the code of a script that handles Ctrl+C and shuts down. A script that finished cleanly is not reported as a lifecycle failure. The commands after it in the same script still run [#9945](https://github.com/pnpm/pnpm/issues/9945).

- pnpm no longer hangs after a lifecycle script exits while a process it started in the background keeps the script's output open. pnpm stops reading that output one second after the script exits [#5730](https://github.com/pnpm/pnpm/issues/5730).

- `pnpm run` and lifecycle scripts use the configured `scriptShell`, including Git Bash on Windows, when `shellEmulator` is also enabled. `shellEmulator` still runs scripts when `scriptShell` is not set. Extra arguments passed to `pnpm run` are quoted for the shell that runs the script, so a Windows path stays intact [#14719](https://github.com/pnpm/pnpm/issues/14719).

- With `enableGlobalVirtualStore`, dependency build scripts now see the workspace root's `node_modules/.bin`, as they do with a local virtual store. A `postinstall` script that runs `node` finds the Node.js installed by `devEngines.runtime` and no longer fails with "command not found" on machines without a system Node.js [#15652](https://github.com/pnpm/pnpm/issues/15652). Dependency build scripts also see the bins of privately hoisted dependencies.

- Dependency install scripts now find the node-gyp bundled with pnpm when pnpm runs through a symlink, such as `node_modules/.bin/pnpm` or the `pnpm` that `npm install -g pnpm` links. They used to fail with `node-gyp: command not found` on macOS [#15694](https://github.com/pnpm/pnpm/issues/15694).

- `pnpm run` and lifecycle scripts now set `npm_config_node_gyp` to the bundled `node-gyp` entry point. Tools that read the variable resolve the same `node-gyp` pnpm builds with. An `npm_config_node_gyp` value the environment already sets is kept as is [#16270](https://github.com/pnpm/pnpm/issues/16270).

- Scripts now see the `npm_command` environment variable that npm sets. It holds `run-script` when the command runs a script, and the command's own name otherwise [#16265](https://github.com/pnpm/pnpm/issues/16265).

- Commands run from a POSIX shell through a dependency's own `node_modules/.bin`, such as `node_modules/vite/node_modules/.bin/esbuild`, no longer fail with `MODULE_NOT_FOUND` [#10189](https://github.com/pnpm/pnpm/issues/10189).

- `pnpx --version` and `pnpm dlx --version` now print the pnpm version. Other unknown options before the command are reported as errors. Before, pnpm tried to download a package named after the option [#16259](https://github.com/pnpm/pnpm/issues/16259).

- `pnpm dlx` now keeps the virtual store of its cached installs in `node_modules/.pnpm`, like every other install [#13955](https://github.com/pnpm/pnpm/issues/13955). `pnpm pack-app` now names the manifest of its runtime install directory `pnpm-pack-app-<target>`.

#### Publishing, packing, and deploying

- `pnpm pack` and `pnpm publish` now ship a file that the `files` field names even when another entry excludes the directory holding it. For example, `["**", "!dist", "dist/index.d.ts"]` ships `dist/index.d.ts` [#16213](https://github.com/pnpm/pnpm/issues/16213).

- `pnpm pack` prunes a directory that a `files` field exclusion names, such as `!**/test`, excluding the directory and its contents from the packed package [#15738](https://github.com/pnpm/pnpm/issues/15738).

- `pnpm publish` now waits at least 5 minutes for the registry to answer a publish request, like npm. This fixes "409 Conflict - Failed to save packument" errors when the registry is slow to answer [#11454](https://github.com/pnpm/pnpm/issues/11454).

- `pnpm deploy --prod` no longer fails with `ERR_PNPM_OUTDATED_LOCKFILE` when the deployed project declares a `devEngines.runtime` with `onFail: download`. The runtime stays out of the deployed `node_modules` with the rest of the dev dependencies [#15703](https://github.com/pnpm/pnpm/issues/15703).

- `pnpm deploy` with a shared lockfile now copies workspace dependencies into the deploy directory, even when `packageImportMethod` is set to `hardlink`. Before, their files were hard-linked to the workspace sources, so editing a source file also changed the deployed copy [#12176](https://github.com/pnpm/pnpm/issues/12176).

- `pnpm deploy --legacy` no longer leaves broken links to nested local dependencies of workspace packages [#9575](https://github.com/pnpm/pnpm/issues/9575).

#### Configuration and pnpmfile hooks

- Every setting pnpm supports can now be set with `--config.<name>=<value>` on the command line, not only the ones whose command also carries a matching flag. Before, `pnpm install --config.frozen-lockfile=true` dropped the setting and rewrote `pnpm-lock.yaml` as though the install had not been frozen [#16276](https://github.com/pnpm/pnpm/issues/16276).

- Settings given on the command line, such as `--registry` and `--store-dir`, now take precedence over the values a pnpmfile `updateConfig` hook sets [#14063](https://github.com/pnpm/pnpm/issues/14063).

- `pnpm config set --location=project` and `pnpm config delete --location=project`, run from a package inside a workspace, now write settings that belong in `pnpm-workspace.yaml` to the workspace root's `pnpm-workspace.yaml`. Before, they created a new `pnpm-workspace.yaml` in the current package, which made that package the workspace root. Settings stored in `.npmrc` are still written to the current directory [#13757](https://github.com/pnpm/pnpm/issues/13757).

- pnpm now reads the workspace directory override from `PNPM_CONFIG_WORKSPACE_DIR`, like other settings. `NPM_CONFIG_WORKSPACE_DIR` still works as a fallback [#16275](https://github.com/pnpm/pnpm/issues/16275).

- pnpm now fails with `ERR_PNPM_AUTH_INVALID_BASE64` when a registry's `_password` in `.npmrc` is not valid base64. Before, it sent the value as the raw password. A `username` or `_password` left empty, for example by an unset environment variable, now supplies no credential [#16273](https://github.com/pnpm/pnpm/issues/16273).

- `proxy=false` now turns proxying off even when `HTTP_PROXY`, `HTTPS_PROXY`, or `ALL_PROXY` is set. pnpm no longer sends requests through a proxy named only in `ALL_PROXY`.

- `pnpm install` now runs the install hooks of a config dependency plugin's pnpmfile, including `readPackage`, `afterAllResolved`, and custom resolvers. Its pnpmfile is also counted in `pnpmfileChecksum`. Before, only the plugin's `updateConfig` hook ran, so a plugin could not change the resolved dependencies.

- A pnpmfile `fetchers` hook now runs once per package on a fresh install when it handles a resolution with a custom `type` or delegates a git-hosted one to the same subdirectory [#15584](https://github.com/pnpm/pnpm/issues/15584). These packages were fetched a second time for installation, so the installed files could come from a different archive than the one their dependencies were read from. The hook also no longer runs twice when a `resolvers` hook returns a tarball resolution without a manifest [#15025](https://github.com/pnpm/pnpm/issues/15025).

- `pnpm install` now re-fetches a package from a custom resolver when the `integrity` of its resolution changes, with or without `enableGlobalVirtualStore`. It used to update the lockfile but keep the old files in `node_modules` [#15670](https://github.com/pnpm/pnpm/issues/15670).

- `pnpm install` now rejects invalid results from a `readPackage` hook. A hook that returns a non-object value fails with `ERR_PNPM_BAD_READ_PACKAGE_HOOK_RESULT` [#15730](https://github.com/pnpm/pnpm/issues/15730). A hook that sets a dependency range to a value other than a string, such as `undefined`, fails with an error that names the dependency, the package and the pnpmfile. Delete the property to remove a dependency [#15705](https://github.com/pnpm/pnpm/issues/15705).

#### Global packages, pnpm versions, and runtimes

- `pnpm update --global` now reinstalls the global packages that pnpm 10 installed into the previous global directory, `<global-dir>/5`, so their commands are linked into the pnpm home `bin` directory again and `pnpm list --global` lists them. Once every package is migrated, pnpm deletes the previous directory and the commands pnpm 10 linked into the pnpm home [#11528](https://github.com/pnpm/pnpm/issues/11528).

- A signal sent to pnpm, such as `SIGTERM`, now reaches the pnpm that pnpm switches to because of `packageManager` or `devEngines.packageManager`, and the one that `pnpm with` runs. The signal used to be dropped, so scripts running under that pnpm never got to shut down [#9948](https://github.com/pnpm/pnpm/issues/9948).

- On arm64 musl Linux, such as Alpine on ARM, switching to a pinned pnpm older than 12 now runs the JavaScript `pnpm` package. The standalone executable of those versions crashed at startup on that platform [#10443](https://github.com/pnpm/pnpm/issues/10443).

- Global shims such as `node` now work when pnpm runs through a relative symlink, as with a Homebrew install. They were copies of that symlink and did not resolve from the global bin directory [#15691](https://github.com/pnpm/pnpm/issues/15691).

- `pnpm env remove --global` deletes Node.js versions that pnpm installed into its own store, including when another tool installed pnpm [#8357](https://github.com/pnpm/pnpm/issues/8357).

- `pnpm self-update` no longer suggests a downgrade when `minimumReleaseAge` holds back the registry's `latest` release. It now says that release is still within the cutoff [#12006](https://github.com/pnpm/pnpm/issues/12006).

#### Windows

- Interrupting a script with Ctrl+C on Windows no longer leaves the terminal stuck [#14860](https://github.com/pnpm/pnpm/issues/14860). A script that runs through a batch shim, as `vite dev` does through `vite.CMD`, made cmd.exe wait forever on its "Terminate batch job (Y/N)?" answer, and every following keystroke went to that prompt. pnpm now ends a cmd.exe script shell once it has sat for a second after the interrupt with nothing running under it. A script that takes longer to shut down is still waited for. A second Ctrl+C ends the script's shell at once.

- On Windows, `pnpm run` now passes the arguments after the script name to the script as typed. Before, `cmd` expanded `%VAR%` in them and backslashes arrived doubled. Line breaks still arrive as the two characters `\n`, because `cmd` cannot pass them. The command line pnpm prints for the script quotes the arguments the same way on every platform [#16257](https://github.com/pnpm/pnpm/issues/16257).

- The Windows `pnpm.exe` runs on a clean Windows install that does not have the Visual C++ Redistributable. It used to exit immediately on startup because that runtime was missing [#15723](https://github.com/pnpm/pnpm/issues/15723).

- On Windows, the `.cmd` command shims in `node_modules/.bin` now keep a `%` in the project path. Before, cmd.exe expanded it as a variable reference, so the command received a mangled `NODE_PATH` [#15716](https://github.com/pnpm/pnpm/issues/15716). Command shims also run tools whose paths contain non-ASCII characters [#6999](https://github.com/pnpm/pnpm/issues/6999), including the PowerShell shims in Windows PowerShell 5.1 [#16217](https://github.com/pnpm/pnpm/issues/16217).

- Bin shims in `node_modules/.bin` run from Cygwin on Windows again. The shims passed a `/cygdrive/c/...` path to the Windows `node` found on `PATH`, so Node.js failed with `Cannot find module 'C:\cygdrive\c\...'` [#12845](https://github.com/pnpm/pnpm/issues/12845).

- On Windows, installing pnpm with npm inside a project now writes `node_modules/.bin` shims that run `pnpm.exe`. A global install with `npm install --location=global` now gets the same shims as `npm install -g` [#15688](https://github.com/pnpm/pnpm/issues/15688).

- `pnpm install` no longer fails with `ERR_PNPM_WORKSPACE_INVALID_GLOB` on Windows for a wildcard pattern such as `plugins/*/*` in `pnpm-workspace.yaml` when the workspace is on a different drive than the pnpm cache or state directory [#16239](https://github.com/pnpm/pnpm/issues/16239).

- On Windows, `pnpm install` no longer skips a dependency's build script on a later install when the package ships an executable file and the script changes nothing inside the package directory [#15667](https://github.com/pnpm/pnpm/issues/15667).

- `pnpm setup` no longer writes the `pn.ps1`, `pnpx.ps1`, and `pnx.ps1` PowerShell wrappers. It also removes the ones an earlier setup wrote. PowerShell now runs `pn`, `pnpx`, and `pnx` through their `.cmd` wrappers, like `pnpm` itself. Before, these aliases failed with a "not digitally signed" error wherever the execution policy blocks unsigned scripts [#8444](https://github.com/pnpm/pnpm/issues/8444).

- `pnpm setup` on Windows no longer panics when an unrelated environment variable has a name containing a non-ASCII character. It skips that variable [#15684](https://github.com/pnpm/pnpm/issues/15684).

- On Windows, `pnpm setup` repairs the `PNPM_HOME` registry type left by older pnpm versions, even when the configured directory has not changed.

- On Windows, the `ERR_PNPM_BAD_ENV_FOUND` error of `pnpm setup` now shows the value `PNPM_HOME` is currently set to. Before, it showed the directory pnpm wanted to set.

- On Windows, pnpm expands nested `%VAR%` references in `PNPM_HOME` and the other directory environment variables it uses for its home, store, cache, state, and config directories. pnpm fails with an error when a `%VAR%` reference remains after expansion [#13236](https://github.com/pnpm/pnpm/issues/13236).

- On Windows, if the global bin directory is not in `PATH` and a `PATH` entry still contains an unexpanded variable such as `%PNPM_HOME%`, the error now names that entry. A variable referenced from the user `Path` must be set to a full path and stored as a plain string (`REG_SZ`) for the entry to expand [#5283](https://github.com/pnpm/pnpm/issues/5283).

#### Inspecting dependencies

- `pnpm audit` and `pnpm audit signatures` now fail with an error when the lockfile contains unresolvable dependency references [#13638](https://github.com/pnpm/pnpm/issues/13638).

- `pnpm licenses list` now reports the actual on-disk package locations when using `nodeLinker: hoisted` or `shamefully-hoist: true` [#8589](https://github.com/pnpm/pnpm/issues/8589). With `--json`, its `paths` array now includes every installed copy of a package, including hoisted copies and isolated installations with different peer dependencies.

- `pnpm root` now prints the configured `modulesDir`. It used to print `node_modules` regardless of the setting. A project's own `modulesDir` from `packageConfigs` is printed too [#9113](https://github.com/pnpm/pnpm/issues/9113).

#### Output and messages

- With the default and append-only reporters, installs with `--loglevel warn` or `--loglevel error` now print the full output of a failed install script. The output of successful scripts, including the root project's own install hooks, stays hidden. With `--loglevel warn`, pnpm also prints ignored build script warnings.

- When a dependency fails to resolve, the error now shows the cause. For example, a Node.js runtime download behind a proxy that re-signs TLS now reports `invalid peer certificate: UnknownIssuer` [#9556](https://github.com/pnpm/pnpm/issues/9556).

- When installing a git dependency over SSH fails with `Permission denied (publickey)`, pnpm suggests checking the loaded keys with `ssh-add -l`. Resolving an SSH URL that refuses the key also shows a local HTTPS rewrite that leaves the recorded URL alone [#13743](https://github.com/pnpm/pnpm/issues/13743).

- Lockfile verification now fails with `ERR_PNPM_TARBALL_URL_MISMATCH`, `ERR_PNPM_TARBALL_REVISION_MISMATCH`, or `ERR_PNPM_MISSING_NAMED_REGISTRY` when every rejected entry failed that check. These failures were reported as the generic `ERR_PNPM_LOCKFILE_RESOLUTION_VERIFICATION`.

- The lockfile verification error now suggests relaxing the policy that flagged an entry only if a fresh resolution still fails and you trust the affected packages. Errors from checks that no policy controls, such as a missing tarball integrity, no longer suggest relaxing a policy [#14411](https://github.com/pnpm/pnpm/issues/14411).

- `pnpm install` no longer prints an extra `Progress:` line after the progress line is marked `done` [#16184](https://github.com/pnpm/pnpm/issues/16184).

## 12.7.0

pnpm 12.7.0 ships with `.nvmrc` and `.node-version` support in the global `node` shim, `pnpm install --allow-build`, `pnpm publish --publish-wait-timeout`, and `pnpm-workspace.yaml` created from the `workspaces` field. `pnpm install --force` no longer installs optional dependencies built for other platforms. This release also carries security fixes for bin shims on Nix, for lifecycle scripts of packages in a `storeDir` inside the workspace, and for `userAgent` placeholders in `pnpm-workspace.yaml`.

### Minor Changes

- `pnpm install --force` now keeps skipping optional dependencies whose `os`, `cpu` or `libc` do not match the host. It still refetches every package and lifts `engineStrict`. The new `forceIgnoresPlatform` setting restores the previous behaviour, installing optional dependencies of every platform under `--force` [#6133](https://github.com/pnpm/pnpm/issues/6133).

- The global `node` shim created by pnpm now uses the Node.js version from the nearest `.nvmrc` or `.node-version` file when the project does not declare a Node.js runtime in `devEngines.runtime` or `engines.runtime` [#4471](https://github.com/pnpm/pnpm/issues/4471). The nearest directory with a Node.js runtime declaration decides the version. Within one directory, `package.json` takes precedence over `.node-version`, which takes precedence over `.nvmrc`. An `.nvmrc` value that only nvm can act on, such as `system` or a custom alias, is ignored.

- `pnpm install` now supports the `--allow-build` option to selectively allow or deny package lifecycle scripts and record them in `pnpm-workspace.yaml` [#15388](https://github.com/pnpm/pnpm/issues/15388).

- Added `pnpm publish --publish-wait-timeout <milliseconds>` to wait for published versions and their tarballs to become available from the registry. Set `publishWaitTimeout` in `pnpm-workspace.yaml` to configure a default. A value of `0` disables the check.

  Recursive publishing confirms availability before publishing dependent packages. If confirmation times out, the command fails.

  When `pnpm publish -r --report-summary` fails after some uploads were accepted, the summary file now lists those packages.

- `pnpm install` now creates `pnpm-workspace.yaml` from the `workspaces` field of the root `package.json` when the repository has no `pnpm-workspace.yaml`. The projects the field lists are linked on that same install. An existing `pnpm-workspace.yaml` is never changed. With `--ignore-workspace`, no file is created. If the `workspaces` field later differs from `packages` in `pnpm-workspace.yaml`, pnpm prints a warning [#2255](https://github.com/pnpm/pnpm/issues/2255).

- When a project pins a pnpm version or a runtime that another pnpm process is installing at that moment, pnpm now waits a few seconds and then installs and runs a private copy of its own. It used to wait up to five minutes and then use the shared install directory without the lock. The private copy is removed once the command has run. `pnpm store prune` removes any private copy that a killed process left behind [#15413](https://github.com/pnpm/pnpm/issues/15413).

- pnpm now keeps the blank lines between entries of `package.json` when it updates the file, for example on `pnpm add` [#5602](https://github.com/pnpm/pnpm/issues/5602).

### Patch Changes

#### Security

- pnpm no longer expands environment variables in a `userAgent` set in a project's `pnpm-workspace.yaml`. A `userAgent` with a placeholder in that file is now ignored. Before this fix, pnpm sent the variable's value to the configured registry [#15415](https://github.com/pnpm/pnpm/issues/15415).

- On Nix, a dependency's bin named like a system utility such as `sed` can no longer redirect a POSIX bin shim or the `pnpm`, `pn`, `pnpx`, and `pnx` launchers. The shims and launchers now ignore `node_modules` and relative `PATH` entries while they locate their own files. Installing again replaces the shims already in `node_modules` [#14883](https://github.com/pnpm/pnpm/issues/14883).

- pnpm no longer treats manifests inside its store, cache, state, or modules directories as workspace projects. Before, a `storeDir` inside the workspace could let lifecycle scripts of packages in the store run without `allowBuilds` approval [#15033](https://github.com/pnpm/pnpm/issues/15033).

- Packages that run a lifecycle script are no longer hard-linked into the virtual store, so a build script can no longer rewrite the workspace source of an injected package or the store copy it was imported from [#15483](https://github.com/pnpm/pnpm/issues/15483).

#### Installing packages

- Fixed `pnpm install`, `pnpm add`, `pnpm remove`, and `pnpm peers check` running out of memory when many packages share a missing peer dependency. This mostly affected projects with `autoInstallPeers: false` [#15362](https://github.com/pnpm/pnpm/issues/15362).

- pnpm no longer hangs for up to 5 minutes after a pnpm process was killed while setting up the pnpm version pinned in `packageManager` or `devEngines` [#15360](https://github.com/pnpm/pnpm/issues/15360), [#15393](https://github.com/pnpm/pnpm/issues/15393). The killed process left behind a lock that every later pnpm command in the project waited on. pnpm now detects that the process holding a lock is gone and takes the lock over at once. The same applies to the locks pnpm takes while installing a managed runtime or writing the global bin directory. Two pnpm processes that are both still running keep waiting for each other as before.

- Requests to a registry or tarball server whose TLS certificate fails verification now fail at once. Such requests were retried for more than a minute without any output [#9134](https://github.com/pnpm/pnpm/issues/9134).

- On macOS, pnpm now falls back to its bundled CA roots when system trust evaluation is unavailable, such as in a sandbox or when macOS cannot create an SSL policy for a registry connection. Installs failed or crashed on the first registry request in that case. Custom `ca` certificates are now honored directly [#15329](https://github.com/pnpm/pnpm/issues/15329), [#14461](https://github.com/pnpm/pnpm/issues/14461).

- `pnpm install` now caps concurrent connections to a proxy at 50 sockets by default [#15280](https://github.com/pnpm/pnpm/issues/15280). It also immediately retries transient connection resets when downloading package archives.

- `pnpm install` now reuses a package already present in the store when an existing lockfile entry satisfies the dependency, avoiding registry requests that fail without authorization [#2522](https://github.com/pnpm/pnpm/issues/2522).

- Installing or adding dependencies no longer fails when a previously installed local tarball file was deleted from disk [#8367](https://github.com/pnpm/pnpm/issues/8367).

- `pnpm install` now installs the new version of a local tarball dependency whose file was replaced at the same path [#2437](https://github.com/pnpm/pnpm/issues/2437). `pnpm install --frozen-lockfile` rejects such a changed tarball, even when the previous archive contents are in the store [#1889](https://github.com/pnpm/pnpm/issues/1889).

- `pnpm install` now fetches committed submodules of git dependencies [#1470](https://github.com/pnpm/pnpm/issues/1470).

- `pnpm install` now applies patches produced by `pnpm patch-commit` when an edit removes the trailing lines of a file along with its newline. The install no longer fails with `ERR_PNPM_INVALID_PATCH` ("expected end of hunk") [#12451](https://github.com/pnpm/pnpm/issues/12451).

- `pnpm install` now preserves existing `node_modules` directories when a cross-device move reports `EXDEV` [#14504](https://github.com/pnpm/pnpm/issues/14504).

- `pnpm install` no longer fails when writing the workspace state file encounters an error. Failures to update the state file now emit a warning instead of aborting the install [#14550](https://github.com/pnpm/pnpm/issues/14550).

- Interrupting `pnpm install` with Ctrl+C or SIGTERM no longer leaves a temporary lockfile (`.pnpm-lock.yaml.*.tmp`) behind in the project [#1418](https://github.com/pnpm/pnpm/issues/1418).

- `pnpm install` now relinks a direct dependency whose link in `node_modules` points to a missing target. Before, it reported "Already up to date" and left the broken link [#9758](https://github.com/pnpm/pnpm/issues/9758).

- `pnpm install` uses less CPU when it links packages from a warm store. On Windows, a warm install could take several times longer than with pnpm 11 [#15439](https://github.com/pnpm/pnpm/issues/15439).

- `pnpm install` now runs `node --version` once per run. A workspace whose projects keep their own lockfiles (`sharedWorkspaceLockfile: false`) previously ran the probe once or twice for every project, and on macOS the concurrent launches waited on each other, so a project could wait several seconds before its linking started.

- A repeat `pnpm install --frozen-lockfile` with `nodeLinker: hoisted` in a workspace no longer re-links `node_modules` when nothing changed.

- Custom fetcher hooks no longer run a second time during installation when an archive was already fetched during dependency resolution [#15025](https://github.com/pnpm/pnpm/issues/15025).

- Fixed a package resolved by a `resolvers` pnpmfile hook installing without its own dependencies. This happened when the hook returned no `manifest` and a `fetchers` hook handled the resolution [#15552](https://github.com/pnpm/pnpm/issues/15552).

- `pnpm install --prod` and other installs that skip `devDependencies` no longer run the `pnpm:devPreinstall` script [#7065](https://github.com/pnpm/pnpm/issues/7065). They skip `prepare` lifecycle scripts too, as do installs given package arguments.

- `pnpm prune --prod` and production installs now remove devDependencies when `lockfile: false` is configured [#2677](https://github.com/pnpm/pnpm/issues/2677).

- `pnpm install --prod`, `pnpm fetch --prod` and `pnpm deploy --prod` no longer install a devDependency that is only there to satisfy an optional peer dependency of a production dependency. `pnpm list`, `pnpm why`, `pnpm licenses`, `pnpm sbom` and `pnpm audit` leave it out of `--prod` results too. The same applies to `--dev`. A peer that is not optional is still installed and audited [#15344](https://github.com/pnpm/pnpm/issues/15344).

- `pnpm install` no longer skips optional dependencies that the Node.js version locked for a `devEngines.runtime` range supports, when the range uses `onFail: download`. An explicitly set `nodeVersion` still takes priority [#14628](https://github.com/pnpm/pnpm/issues/14628).

- `pnpm fetch` now also installs the pnpm version that `pnpm-lock.yaml` pins, when it differs from the running pnpm. A later `pnpm install --offline` that switches to the pinned version no longer fails because that version is missing from the store [#11808](https://github.com/pnpm/pnpm/issues/11808).

- A dependency that ships a `binding.gyp` and sets `gypfile: false` no longer gets the `node-gyp rebuild` install script pnpm synthesizes for it. Such a dependency needs no `allowBuilds` entry and is no longer listed under "Ignored build scripts".

- `pnpm install` no longer adds `allowBuilds` placeholder entries to `pnpm-workspace.yaml` when it runs in CI or without a terminal. Interactive installs still add them [#11574](https://github.com/pnpm/pnpm/issues/11574).

- pnpm now detects the same CI environments as pnpm 11, including AWS CodeBuild, which does not set `CI`. On these services `pnpm install` uses a frozen lockfile by default and fails with `ERR_PNPM_OUTDATED_LOCKFILE` when the lockfile is outdated.

#### Resolving and linking dependencies

- Installing through a pnpr server now installs a project's peer dependencies when `autoInstallPeers` is enabled. A project that declared only peer dependencies failed with `ERR_PNPM_OUTDATED_LOCKFILE` or skipped its peers [#14833](https://github.com/pnpm/pnpm/issues/14833).

- pnpm now installs a dependency that a package also declares as an optional peer dependency, for example `lightningcss` in some vite builds. The dependency was missing from `node_modules`, so the package failed to import it [#8912](https://github.com/pnpm/pnpm/issues/8912).

- Removal overrides such as `"parent>peer": "-"` now prevent optional peers from being installed from another workspace package [#15008](https://github.com/pnpm/pnpm/issues/15008).

- Removing an entry from `overrides` now re-resolves the packages it targeted. A version the override had locked is no longer kept just because the declared range still accepts it [#4587](https://github.com/pnpm/pnpm/issues/4587).

- `packageExtensions` and `overrides` entries with a ranged selector (such as `@<X` or `@*`) no longer match a dependency that has no `package.json`, such as a local directory dependency [#15007](https://github.com/pnpm/pnpm/issues/15007).

- Trim leading and trailing whitespace from dependency override selectors in `pnpm.overrides` [#6356](https://github.com/pnpm/pnpm/issues/6356).

- With `trustPolicy: no-downgrade`, pnpm now resolves the newest matching version that is not a trust downgrade. Previously a dependency failed with `ERR_PNPM_TRUST_DOWNGRADE` even when an older version satisfied its range. `pnpm self-update` picks its target version the same way. A request for an exact version still fails [#14176](https://github.com/pnpm/pnpm/issues/14176).

- `pnpm install` now re-resolves a dependency when its manifest range is updated from a prerelease to a stable version. The lockfile previously retained the prerelease version and caused `--frozen-lockfile` to fail [#15528](https://github.com/pnpm/pnpm/issues/15528).

- `pnpm install --ignore-pnpmfile` no longer removes `pnpmfileChecksum` from an up-to-date `pnpm-lock.yaml`. `pnpm install --frozen-lockfile --ignore-pnpmfile` no longer fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` when the lockfile records a `pnpmfileChecksum`. A command that resolves dependencies with the pnpmfile ignored still writes the lockfile without it [#10944](https://github.com/pnpm/pnpm/issues/10944).

- `pnpm install` and `pnpm peers check` now use local tarball packages' actual versions when checking peer dependencies. Compatible packages no longer fail with `strictPeerDependencies` enabled.

- `pnpm peers check` and the install-time peer dependency check now resolve peer dependencies from the workspace root when `resolvePeersFromWorkspaceRoot` is enabled [#14982](https://github.com/pnpm/pnpm/issues/14982).

- `autoDedupe` and `pnpm dedupe` now move transitive dependencies to the version a `catalog:` dependency pins, as they already did for versions written directly in `package.json`. Previously they could move those dependencies to a higher version and keep both versions in the lockfile.

- `pnpm dedupe` now produces a stable lockfile when a dependency's range matches both a direct dependency and an `npm:` alias of the same package. The dependency resolves to the version of the direct dependency. Repeated runs previously alternated between two lockfiles [#15588](https://github.com/pnpm/pnpm/issues/15588).

- Merging lockfiles now preserves recorded configuration fields such as `overrides`, `neverBuiltDependencies`, `patchedDependencies`, `packageExtensionsChecksum`, `settings`, and `catalogs` [#8366](https://github.com/pnpm/pnpm/issues/8366).

- A lockfile entry whose resolution is unchanged now keeps its recorded `deprecated` message [#5772](https://github.com/pnpm/pnpm/issues/5772).

- pnpm no longer writes a package's legacy array-form `engines`, such as `["node >= 0.8"]`, to the lockfile. It was recorded as an object keyed by index, such as `{'0': node >= 0.8}` [#4518](https://github.com/pnpm/pnpm/issues/4518).

- Tarball URLs recorded in the lockfile now strip default HTTP and HTTPS ports (`:80` and `:443`) [#15539](https://github.com/pnpm/pnpm/issues/15539).

- `node_modules/.package-map.json` no longer contains entries that point at directories that do not exist. Such entries appeared for packages installed only with peer dependencies, most visibly with `enableGlobalVirtualStore` [#14938](https://github.com/pnpm/pnpm/issues/14938).

- With `nodeLinker: hoisted`, `hoistWorkspacePackages` now links each workspace project that `hoistPattern` or `publicHoistPattern` selects into the root `node_modules`, unless a hoisted package or a root dependency already uses its name. The project's bins are linked into the root `node_modules/.bin` [#7553](https://github.com/pnpm/pnpm/issues/7553).

- With `nodeLinker: hoisted`, `pnpm install` now removes the commands of the packages it removes from `node_modules/.bin`, such as a nested copy deduped into the root `node_modules` [#7568](https://github.com/pnpm/pnpm/issues/7568).

- `pnpm install` no longer puts a dependency's bin on `PATH` for that dependency's own lifecycle scripts before the bin's file exists. pnpm links such a bin after the dependency's build has run. It also removes such a bin left by an earlier install. This fixes installing the `node` package on Windows [#15501](https://github.com/pnpm/pnpm/issues/15501).

- Dependencies and executable binaries are now correctly linked and accessible for workspace packages using `publishConfig.directory` and `publishConfig.linkDirectory` [#8338](https://github.com/pnpm/pnpm/issues/8338).

- Bin linking leaves workspace and linked dependency files outside node_modules unchanged. Already executable bin files no longer receive redundant permission changes.

#### Workspaces and filtering

- `pnpm install` now finds workspace projects reached through a symlink, such as a `packages` directory that links to a folder outside the workspace. It installs their dependencies, and the links in their `node_modules` resolve [#1044](https://github.com/pnpm/pnpm/issues/1044).

- A dependency declared with `catalog:` now counts as a workspace dependency when its catalog entry points at a workspace project, for example `workspace:*` [#15587](https://github.com/pnpm/pnpm/issues/15587). With `linkWorkspacePackages` enabled, so does an `npm:` alias of a workspace project, such as `"math-alias": "npm:math@^1.0.0"`. `pnpm -r run` runs that project first. `--filter <pkg>...` selects it.

- A `workspace:` dependency now resolves to a workspace project whose version is not valid semver, such as `1` or `1.0`. `workspace:*`, `workspace:^`, and `workspace:~` match it. A range identical to the version also matches it [#4567](https://github.com/pnpm/pnpm/issues/4567).

- A `workspace:` dependency with an exact version now resolves to a workspace project whose version carries SemVer build metadata. For example, `workspace:0.5.6-next.3` matches a project at `0.5.6-next.3+f60facc` [#6483](https://github.com/pnpm/pnpm/issues/6483).

- Secondary dependencies now prefer the version resolved by the local project's direct dependencies over versions from sibling workspace projects [#7191](https://github.com/pnpm/pnpm/issues/7191).

- `pnpm install` now re-resolves a workspace project's auto-installed peer dependency when another workspace project changes its specifier for that package to one that excludes the locked version but still overlaps the peer range. The peer then resolves to the version a fresh install would pick [#11800](https://github.com/pnpm/pnpm/issues/11800).

- `pnpm install --frozen-lockfile` now fails with `ERR_PNPM_OUTDATED_LOCKFILE` when `pnpm-lock.yaml` lists a workspace project whose directory or manifest file is missing. The install used to report success without installing that project's dependencies [#7667](https://github.com/pnpm/pnpm/issues/7667).

- `pnpm install -r` now installs every workspace project when `recursiveInstall` is set to `false` in `pnpm-workspace.yaml` [#7504](https://github.com/pnpm/pnpm/issues/7504).

- `pnpm install` with `--filter` now installs only the dependencies of the selected projects when using `nodeLinker: hoisted` [#8882](https://github.com/pnpm/pnpm/issues/8882).

- `pnpm install` now updates an injected workspace dependency after that package's own dependencies change, when `shared-workspace-lockfile` is `false` [#7209](https://github.com/pnpm/pnpm/issues/7209).

- `pnpm install` now copies the output of a workspace package's own `prepare`, `install`, or `postinstall` script into the injected copies of that package. Before, the injected copies kept only the files that existed before the script ran. `syncInjectedDepsAfterScripts` now also works when `modulesDir` is set [#9464](https://github.com/pnpm/pnpm/issues/9464).

- `syncInjectedDepsAfterScripts` now copies files into injected dependencies when `node_modules` is on another filesystem than the package sources. The sync previously failed with a cross-device link error and made the script run exit with an error [#14703](https://github.com/pnpm/pnpm/issues/14703).

- A `modulesDir` with several path segments, such as `www/modules`, now puts each workspace project's dependencies in `<project>/www/modules` on both fresh and frozen installs, and `pnpm bin` prints `<project>/www/modules/.bin` [#15484](https://github.com/pnpm/pnpm/issues/15484).

- With `nodeLinker: hoisted`, pnpm now installs the root project's dependencies into a custom `modulesDir` instead of `node_modules`. With a custom `modulesDir`, the virtual store and its `lock.yaml` now default to `<modulesDir>/.pnpm`.

- A repeat `pnpm install` in a workspace with a custom `modulesDir` now takes the up-to-date fast path. Before, pnpm looked for each workspace project's dependencies in `node_modules` and ran a full install every time.

- pnpm now warns when a workspace install covers a project that has its own `pnpm-workspace.yaml`. The nested file's settings, such as `patchedDependencies`, do not apply when the outer workspace installs that project. pnpm reads settings only from the `pnpm-workspace.yaml` at the workspace root [#11724](https://github.com/pnpm/pnpm/issues/11724).

- The `[<since>]` filter selector now compares against the commit where the current branch forked from `<since>`. Projects changed only by newer commits on `<since>` are no longer selected. Uncommitted changes are still included. In a shallow clone without that commit, pnpm compares against `<since>` directly, as before [#9907](https://github.com/pnpm/pnpm/issues/9907).

- `--filter "[<since>]"` now selects workspace packages when dependency versions change in a catalog in `pnpm-workspace.yaml` [#8718](https://github.com/pnpm/pnpm/issues/8718). It also selects projects that files were moved out of when git detects the move as a rename [#15481](https://github.com/pnpm/pnpm/issues/15481).

- `--filter` now evaluates selectors in order, so later inclusion filters can re-include packages that an earlier exclusion filter excluded [#9354](https://github.com/pnpm/pnpm/issues/9354).

#### Adding, updating, and removing dependencies

- `pnpm add` now saves changes to `package.json` before running lifecycle scripts, so a postinstall script failure leaves the added dependency in `package.json` [#8627](https://github.com/pnpm/pnpm/issues/8627).

- `pnpm add` now saves the requested exact version when adding a dependency, even when the manifest already contains a version range [#6040](https://github.com/pnpm/pnpm/issues/6040).

- `pnpm add <pkg>@<version>` and `pnpm update <pkg>@<version>` now move the catalog entry onto the named version when the entry's range already covers it. For example, `^7.22.17` becomes `^7.29.6`, the same way `pnpm update <pkg>` moves an entry to the version it resolves [#13715](https://github.com/pnpm/pnpm/issues/13715).

- `pnpm add` and `pnpm install` keep an empty `peerDependencies`, `dependencies`, `devDependencies`, or `optionalDependencies` field that was already in `package.json`. pnpm still drops such a field when it removes the last entry itself, as `pnpm remove` does [#5096](https://github.com/pnpm/pnpm/issues/5096).

- `pnpm update` now keeps a version range whose shape has no save prefix, such as `<= 3.0.0` or `>=1.0.0 <2.0.0`, when the updated version still satisfies it. Before, `<= 3.0.0` became `^3.0.0` [#6714](https://github.com/pnpm/pnpm/issues/6714).

- `pnpm update <pkg>` now moves a package off a locked version the registry no longer serves, such as an unpublished release. The lockfile check for supply-chain policies such as `minimumReleaseAge` used to reject that version before the update could replace it [#9953](https://github.com/pnpm/pnpm/issues/9953).

- `pnpm update --prod` no longer installs devDependencies when run in a project installed with `--prod` [#8038](https://github.com/pnpm/pnpm/issues/8038).

- `pnpm update --interactive --workspace` now allows external dependencies to be updated.

- `pnpm outdated` and `pnpm update` now apply `minimumReleaseAge` to GitHub Actions. `minimumReleaseAgeExclude` entries match action names such as `actions/checkout` [#13923](https://github.com/pnpm/pnpm/issues/13923).

- `pnpm remove` now accepts `--trust-lockfile` and `--no-trust-lockfile` to control supply-chain policy checks while removing a package [#14406](https://github.com/pnpm/pnpm/issues/14406).

- `pnpm unlink` now removes the `link:` dependency that `pnpm link <dir>` added to `package.json`. The linked package is removed from `node_modules` and the lockfile. A `link:` dependency to another directory is kept [#4219](https://github.com/pnpm/pnpm/issues/4219).

- `pnpm install` now prunes unreferenced catalog entries from `pnpm-workspace.yaml` when `catalogPrune: true` is configured [#15273](https://github.com/pnpm/pnpm/issues/15273).

- `minimumReleaseAgeExcludePrune` and `trustPolicyExcludePrune` now work in workspaces with `shared-workspace-lockfile=false`. Once every project has been installed, pnpm drops an entry only if no project lockfile records it. Undecided `allowBuilds` entries are pruned the same way [#14612](https://github.com/pnpm/pnpm/issues/14612).

- Exclude entries that pnpm writes to `pnpm-workspace.yaml` now match the file's list indentation and dominant quote style [#15571](https://github.com/pnpm/pnpm/issues/15571), [#15079](https://github.com/pnpm/pnpm/issues/15079).

- `pnpm import` now converts dependencies that use Yarn's `patch:` protocol. The dependency keeps the version it patches, and the patch file is added to `patchedDependencies` in `pnpm-workspace.yaml`. If the patch file is missing, pnpm prints a warning and imports the dependency without the patch [#10278](https://github.com/pnpm/pnpm/issues/10278).

- `pnpm import` in a workspace now keeps the versions pinned by the root `yarn.lock`, `package-lock.json`, or `npm-shrinkwrap.json` when another workspace project's range allows a newer version. Before, the root project got the newest version in its range [#4385](https://github.com/pnpm/pnpm/issues/4385).

- `pnpm patch`, `pnpm patch-commit`, and `pnpm patch-remove` now work in a project of a workspace with `sharedWorkspaceLockfile: false`. `pnpm patch` failed there with `ERR_PNPM_PATCH_NO_LOCKFILE` after a successful install. The reinstall after committing or removing a patch left the project's own `node_modules` unchanged [#9926](https://github.com/pnpm/pnpm/issues/9926).

- `pnpm patch-commit` now resolves default patch directory locations when passed a package name or package specifier (such as `pnpm patch-commit <pkg>` or `pnpm patch-commit <pkg>@<version>`).

- `pnpm patch-commit` now updates the lockfile snapshot and prunes removed dependencies when the patch modifies `package.json` [#6866](https://github.com/pnpm/pnpm/issues/6866).

- `pnpm patch-commit` now falls back to copying package files when hard linking fails.

#### Running scripts and commands

- A script that pnpm runs without a terminal now ends when pnpm itself is killed. Killing pnpm's process group, as Playwright's `webServer` does to stop the command it started, used to leave the script running and holding the caller's output pipes open [#15555](https://github.com/pnpm/pnpm/issues/15555).

- `pnpm --filter <project> <command>` and `pnpm -r <command>` now run a command installed in the selected projects' dependencies when none of them has a script by that name. This matches `pnpm <command>` in a single project. `pnpm run` with `--filter` or `-r` still reports the missing script [#10151](https://github.com/pnpm/pnpm/issues/10151).

- `pnpm exec` and `pnpm dlx` now set `npm_execpath`, `INIT_CWD`, `npm_node_execpath`, and `NODE` in child environments when Node.js is available. Stale inherited `NODE` and `npm_node_execpath` variables are cleared when Node.js cannot be found on PATH [#7037](https://github.com/pnpm/pnpm/issues/7037). Scripts that `pnpx` and `pnx` run now get pnpm itself as `npm_execpath`. A script that ran `$npm_execpath install` there ran `pnpm dlx install`.

- `pnpm exec` now sets the `PWD` environment variable to the directory the command runs in. Shells and tools that read `PWD` now report the logical path of a workspace package reached through a symlink [#1550](https://github.com/pnpm/pnpm/issues/1550).

- A script that runs `pnpm run` no longer adds duplicate `node_modules/.bin` and `node-gyp-bin` entries to `PATH` [#5352](https://github.com/pnpm/pnpm/issues/5352).

- Concurrent `pnpm run` and `pnpm exec` commands now serialize their dependency installs [#14551](https://github.com/pnpm/pnpm/issues/14551).

- `pnpm run` and `pnpm exec` with `verifyDepsBeforeRun` now accept a moved project whose store is on the project's volume. Before, the check reported that the workspace structure had changed whenever the default store was not on the home volume.

- `verifyDepsBeforeRun` checks now account for project-specific `packageConfigs` overrides in workspaces with `sharedWorkspaceLockfile: false` [#15545](https://github.com/pnpm/pnpm/issues/15545).

- `pnpm restart` now runs the "stop" and "start" scripts when the package has no "restart" script. Previously it ran "stop" and then failed with "Missing script: restart" [#4750](https://github.com/pnpm/pnpm/issues/4750).

- `pnpm dlx` now keeps a separate cache entry for each Node.js major version. A package built under one Node.js major version, such as a native addon, is no longer reused under another [#8611](https://github.com/pnpm/pnpm/issues/8611).

- `pnpm pipeline` no longer fails when run in a project outside a Git work tree or on a system without `git`. Tasks in those projects run without caching, and pnpm prints a warning explaining why [#15601](https://github.com/pnpm/pnpm/issues/15601).

- A `runtime:` version range that contains `||` or a space, such as a `devEngines.runtime` version of `^22.18.0 || ^24.0.0`, now installs the requested runtime. pnpm used to install the npm package with the same name, such as `node` [#14817](https://github.com/pnpm/pnpm/issues/14817).

- When the configured `scriptShell` does not exist, running a script now fails with an error that names the shell. Previously pnpm printed only an exit code or the package directory [#7562](https://github.com/pnpm/pnpm/issues/7562).

- A script killed by a signal now fails with an error that names the signal, such as `Command failed with signal SIGKILL.` [#9821](https://github.com/pnpm/pnpm/issues/9821).

#### Publishing, packing, and deploying

- `pnpm publish` now resolves `workspace:` dependencies from workspace manifests when `node_modules` is not installed. Previously, publishing without `node_modules` failed with `ERR_PNPM_CANNOT_RESOLVE_WORKSPACE_PROTOCOL` [#6567](https://github.com/pnpm/pnpm/issues/6567).

- `pnpm publish` now honors `publishConfig["@scope:registry"]` for a package in that scope. It takes precedence over the registry set for the same scope in `.npmrc` and over `publishConfig.registry` [#12071](https://github.com/pnpm/pnpm/issues/12071).

- `pnpm pack` and `pnpm publish` now include bundled dependencies when using the isolated linker. This covers workspace packages and the dependencies of each bundled package. Bundled dependencies are also included when `publishConfig.directory` selects a build directory [#1643](https://github.com/pnpm/pnpm/issues/1643).

- `pnpm pack`, `pnpm deploy`, and installs of local directory dependencies now keep symlinks that point to files or directories included in the package. `pnpm pack` leaves out symlinks that point outside the package [#8208](https://github.com/pnpm/pnpm/issues/8208).

- `pnpm pack` now preserves file executable permissions in the packed tarball when source files are executable on disk.

- `pnpm publish` and `pnpm pack` now report a missing `version` or `name` field on a workspace dependency. Previously, pnpm reported that the dependency was not installed [#4164](https://github.com/pnpm/pnpm/issues/4164).

- `pnpm publish` and `pnpm pack` now report an error when a bin script has a shebang line ending with CRLF [#7311](https://github.com/pnpm/pnpm/issues/7311).

- `pnpm deploy` now copies the `packageManager` and `devEngines.packageManager` fields of the workspace root `package.json` into the deployed `package.json`, unless the deployed project pins a package manager itself [#9079](https://github.com/pnpm/pnpm/issues/9079).

- `pnpm deploy` now puts the virtual store at `virtualStoreDir`, resolved against the deploy directory. A shared-lockfile deploy records `virtualStoreDir` in the deployed `pnpm-workspace.yaml`. With the global virtual store enabled or an absolute `virtualStoreDir`, the deploy still uses `node_modules/.pnpm` [#8787](https://github.com/pnpm/pnpm/issues/8787).

- `pnpm deploy` now respects `--package-import-method` passed on the command line and reports the package import method correctly [#7593](https://github.com/pnpm/pnpm/issues/7593).

- `pnpm deploy` does not run the `prepare` scripts of the deployed project [#7282](https://github.com/pnpm/pnpm/issues/7282).

- `pnpm deploy --legacy` no longer rewrites the source workspace's `node_modules/.pnpm-workspace-state-v1.json` to describe only the deployed project [#15352](https://github.com/pnpm/pnpm/issues/15352).

#### Manifests and configuration files

- pnpm now reads and updates `package.json5` project manifests. Manifest updates retain comments, and workspace discovery prefers `package.json`, then `package.json5`, then `package.yaml` [#15129](https://github.com/pnpm/pnpm/issues/15129). `pnpm pack` includes exactly one `package.json` in the archive when the project uses an alternative manifest format, even when `.npmignore` or `files` excludes the source file.

- Git-hosted dependencies that use a `package.yaml` or `package.json5` manifest now honor its `files` field [#7906](https://github.com/pnpm/pnpm/issues/7906).

- Fixed `pnpm version` failing on projects using a `package.yaml` manifest.

  Fixed `pnpm init` creating an extra `package.json` when `package.yaml` is already present.

- `pnpm version` now applies pending bumps to private workspace packages. A private package's changelog is written to its committed `CHANGELOG.md`, also when `versioning.changelog.storage` is `registry` [#13736](https://github.com/pnpm/pnpm/issues/13736), [#13519](https://github.com/pnpm/pnpm/issues/13519).

- `pnpm init` now supports the `--bare` option. It creates a `package.json` file with only the required fields [#15538](https://github.com/pnpm/pnpm/issues/15538).

- The `reporter` setting is now honored when it is configured in `pnpm-workspace.yaml`, the global configuration, or the `PNPM_CONFIG_REPORTER` environment variable. Configured `reporter: silent` makes silent output the default. An explicit `--reporter` takes precedence [#4879](https://github.com/pnpm/pnpm/issues/4879).

- `.npmrc` and `pnpm-workspace.yaml` files now support npm's `${VAR?}` placeholder. It expands to the value of `VAR`, or to an empty string without a warning when `VAR` is unset [#14404](https://github.com/pnpm/pnpm/issues/14404).

- pnpm now expands environment variables in `_auth.authToken` values loaded from global `config.yaml` and `pnpm_config__auth`.

- pnpm now keeps the configured default registry when `_auth` holds credentials for several registries and some of those registries serve package scopes.

  Lockfile verification checks a tarball hosted on a scoped registry against that registry's metadata, unless the package's own scope has a registry assigned [#15530](https://github.com/pnpm/pnpm/issues/15530).

- pnpm now parses the first setting in a `.npmrc` that starts with a UTF-8 byte order mark. Previously, the leading byte order mark caused the first line's key to be ignored [#15353](https://github.com/pnpm/pnpm/issues/15353).

- pnpm now prints a warning when a `.npmrc`, `auth.ini`, or the file set by `npmrcAuthFile` exists but cannot be read. The settings in such a file were ignored without any message. A `.npmrc` that contains invalid UTF-8 is now read [#5065](https://github.com/pnpm/pnpm/issues/5065).

- `pnpm config set` and `pnpm config delete` now preserve comments and repeated keys such as `ca=` in `.npmrc` [#14851](https://github.com/pnpm/pnpm/issues/14851).

- `pnpm login` now logs back in to an existing user on registries without web login, such as verdaccio. The classic login request sends the username and password as basic auth, as `npm login` does [#12055](https://github.com/pnpm/pnpm/issues/12055).

- Commands that do not use the store no longer create a temporary file in the project directory when they load their settings. These include `pnpm view`, `pnpm config`, `pnpm root`, `pnpm bin`, `pnpm exec`, `pnpm run`, the script shortcuts such as `pnpm test`, and the registry commands such as `pnpm whoami`, `pnpm dist-tag`, and `pnpm search`. `pnpm exec`, `pnpm run`, and the script shortcuts still create one in projects that declare `configDependencies`.

#### Global packages, pnpm versions, and runtimes

- Global commands such as `pnpm add --global`, `pnpm list --global`, and `pnpm bin --global` now run with the pnpm you invoked, even in a project that pins another pnpm version. Previously, a pin with `onFail: "download"` switched them to the pinned pnpm, and a pinned pnpm 10 or older failed because its global bin directory was not in `PATH` [#14531](https://github.com/pnpm/pnpm/issues/14531).

- `pnpm add -g`, `pnpm update -g`, and `pnpm remove -g` no longer fail with `ERR_PNPM_PACKAGE_MANIFEST_IO_ERROR` when another global package's link into the store dangles, for example after the store was pruned. The pnpm install script failed the same way on such a machine.

- `pnpm update --global` now skips a global package installed from a `file:` path that no longer exists, prints a warning, and updates the remaining global packages. Previously the whole update failed with `ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND` [#12533](https://github.com/pnpm/pnpm/issues/12533).

- `pnpm self-update` run in a project that pins pnpm through `packageManager` or `devEngines.packageManager` now also updates the global pnpm, as it does outside a project [#14747](https://github.com/pnpm/pnpm/issues/14747).

- `pnpm self-update` no longer leaves the previous pnpm in the global packages when it was installed as `@pnpm/exe`. `pnpm ls -g` now lists a single pnpm [#14709](https://github.com/pnpm/pnpm/issues/14709). `pnpm setup` now installs pnpm under the package name `pnpm` too, so both commands leave the same shims in the global bin directory. After a self-update on Windows, PowerShell ran pnpm through `pnpm.cmd` and asked "Terminate batch job (Y/N)?" on Ctrl+C [#15567](https://github.com/pnpm/pnpm/issues/15567).

- `pnpm setup` failed with `Text file busy (os error 26)` when `$PNPM_HOME/bin` already held `pn`, `pnpx`, or `pnx` as links to the running pnpm executable. It now replaces those files and completes [#15494](https://github.com/pnpm/pnpm/issues/15494).

- `pnpm setup` no longer deletes aliases and other lines that sit between a `# pnpm` comment and the pnpm block in a shell startup file [#7067](https://github.com/pnpm/pnpm/issues/7067).

- When pnpm switches to the version a project pins, the `minimumReleaseAge` approvals for that version are now added to `minimumReleaseAgeExclude` in the project's `pnpm-workspace.yaml`. A project without that file gets one. Global commands leave the project's settings unchanged [#15396](https://github.com/pnpm/pnpm/issues/15396).

- `pnpm env remove` now cleans up dangling Node.js executables and shims. Surviving global commands remain intact.

- Node.js runtime resolution now supports Windows ARM64. Node.js 20 and newer resolve native `win-arm64` builds, and older versions fall back to `win-x64` under emulation [#7123](https://github.com/pnpm/pnpm/issues/7123).

#### Windows and WSL

- On Windows, `pnpm clean` and installs no longer fail immediately when another process uses a package in `node_modules`. pnpm waits up to a minute for an open file. It waits up to 5 seconds for a running program [#15081](https://github.com/pnpm/pnpm/issues/15081).

- `pnpm install` in WSL now waits out Windows file locks on a Windows drive such as `/mnt/c`, as it already does on Windows. Before, an antivirus or indexer scan holding a file open could fail the install with `EACCES` [#6155](https://github.com/pnpm/pnpm/issues/6155).

- On Windows, pnpm now retries saving `pnpm-lock.yaml` for up to a minute while another process holds the file open. The save used to fail at once with `EPERM`, `EBUSY`, or "Access is denied" [#9461](https://github.com/pnpm/pnpm/issues/9461).

- pnpm now escapes trailing dots and spaces in `node_modules/.pnpm` directory names. Windows strips these characters, so a dependency such as `"parent-pkg": "file:../"` created a directory that could not be deleted or failed to install [#8101](https://github.com/pnpm/pnpm/issues/8101).

- On Windows, bin shims run from Git Bash, MSYS2, or Cygwin now pass `NODE_PATH` to Node.js as Windows paths. A project installed from cmd or PowerShell gave its bins a `NODE_PATH` under the Git install directory when they ran from Git Bash. Installing again replaces the shims already in `node_modules` [#3360](https://github.com/pnpm/pnpm/issues/3360).

- Fixed scripts failing with errors such as `'an-compile' is not recognized` when `scriptShell` is set to `cmd.exe` on Windows [#7181](https://github.com/pnpm/pnpm/issues/7181).

- On Windows, the error for a `node_modules` directory that pnpm cannot move out of the way now names the directory and says that a file in it is probably in use by another process [#7505](https://github.com/pnpm/pnpm/issues/7505).

#### Inspecting dependencies

- `pnpm audit` and `pnpm audit signatures` now check only the dependencies of the projects selected by `--filter`, `--filter-prod`, or `--workspace-root`. The filter used to be ignored, so a filtered audit reported the whole workspace [#10982](https://github.com/pnpm/pnpm/issues/10982).

- `pnpm audit` now lists at least one dependency path from every workspace project that depends on a vulnerable package. Before, a project whose dependency was reached through more than 100 paths filled the path list, and other projects that depend on the same package were left out [#12200](https://github.com/pnpm/pnpm/issues/12200).

- `pnpm audit --fix` now prunes redundant overrides when one vulnerable range is a subset of another for the same package [#8577](https://github.com/pnpm/pnpm/issues/8577).

- Running `pnpm list` inside a workspace package without `--recursive` or a filter now lists only the current package [#14494](https://github.com/pnpm/pnpm/issues/14494). `pnpm licenses list` does the same. Use `--recursive` or `--filter` to list the licenses of other workspace projects [#5689](https://github.com/pnpm/pnpm/issues/5689).

- `pnpm list --only-projects` now prints every project selected with `--filter` or `--recursive`, including a project that has no workspace dependencies [#9770](https://github.com/pnpm/pnpm/issues/9770). It also lists the workspace projects when `sharedWorkspaceLockfile` is `false` [#7151](https://github.com/pnpm/pnpm/issues/7151), and a project that sets `publishConfig.directory` [#10635](https://github.com/pnpm/pnpm/issues/10635). It no longer reports packages in `node_modules` that are missing from the lockfile [#9528](https://github.com/pnpm/pnpm/issues/9528).

- `pnpm licenses list` failed or reported nothing in a workspace with `sharedWorkspaceLockfile: false`. It now reads the lockfile of each selected project [#10140](https://github.com/pnpm/pnpm/issues/10140).

- With `nodeLinker: hoisted`, `pnpm licenses list` reported every license as `Unknown` and listed paths under `node_modules/.pnpm` that do not exist. It now reads each package from the directory where the hoisted linker placed it [#8589](https://github.com/pnpm/pnpm/issues/8589).

- `pnpm outdated` and `pnpm -r outdated` now fail with `ERR_PNPM_NO_PACKAGE_IN_DEPENDENCIES` when a requested package selector does not match any dependency in the inspected projects [#2319](https://github.com/pnpm/pnpm/issues/2319).

- `pnpm -r outdated --json` now includes every outdated workspace dependency when multiple projects depend on different versions or dependency types of the same package. Such a package is keyed by its current version and dependency type, for example `vue@2.7.14 (dev)` [#7693](https://github.com/pnpm/pnpm/issues/7693).

- `pnpm sbom` filtered to a single workspace project now takes the `author`, `description`, `license`, `repository`, and `bugs` fields from the workspace root `package.json` when the project does not declare them. A field the project declares is never taken from the root, even when it is blank or `null` [#14882](https://github.com/pnpm/pnpm/issues/14882).

- `pnpm store status` no longer reports a package as modified when it has build or postinstall scripts, peer dependencies, or skipped optional dependencies [#15383](https://github.com/pnpm/pnpm/issues/15383). When packages were mutated, it now lists only those packages and no longer suggests running `pnpm install --force` [#919](https://github.com/pnpm/pnpm/issues/919).

- `pnpm peers check` and the `ERR_PNPM_PEER_DEP_ISSUES` error now group peer dependency issues under the workspace project they were found in [#15351](https://github.com/pnpm/pnpm/issues/15351).

#### Output and messages

- The error for an incompatible pnpm-lock.yaml now reports the lockfileVersion the file was generated with and the lockfileVersion the current pnpm supports [#848](https://github.com/pnpm/pnpm/issues/848).

- When the registry stops sending data for longer than `fetchTimeout`, pnpm now reports that the metadata or tarball request timed out. Previously the error did not mention the timeout [#3646](https://github.com/pnpm/pnpm/issues/3646).

- Fatal peer dependency errors and their hints are now written to stderr [#5419](https://github.com/pnpm/pnpm/issues/5419).

- `pnpm run` with `--loglevel` set to `warn`, `error`, or `silent` (or the same `loglevel` setting) no longer prints the `$ <command>` line before a script, nor the summary of the install that `verifyDepsBeforeRun` runs first. Both are info-level output [#8944](https://github.com/pnpm/pnpm/issues/8944).

- `pnpm run` and `pnpm exec` now print `No projects matched the filters in "<workspace>"` when `--filter` selects no project [#8408](https://github.com/pnpm/pnpm/issues/8408).

- `pnpm dedupe` now counts each package reused from the store once in its progress output [#15303](https://github.com/pnpm/pnpm/issues/15303).

- `pnpm add` now warns when replacing an existing dependency with a specifier pointing to a different source [#14869](https://github.com/pnpm/pnpm/issues/14869).

- `pnpm link` now warns when linking a package that declares one or more peer dependencies, explaining that the linked dependency will not resolve peer dependencies from the target `node_modules` and suggesting the `file:` protocol instead.

- `pnpm import` now warns when package.json lists projects in a "workspaces" array and there is no "pnpm-workspace.yaml". Without that file, the import writes a lockfile for the root project only [#5240](https://github.com/pnpm/pnpm/issues/5240).

- Bash completion now completes script names that contain a colon, such as `pnpm run test:u` to `pnpm run test:unit` [#5482](https://github.com/pnpm/pnpm/issues/5482).

## 12.6.0

pnpm 12.6.0 ships with automatic dependency deduplication, relocatable node_modules, package.yaml manifest editing, and --save-types support.

### Minor Changes

- `autoDedupe` deduplicates compatible dependency versions during installation [#7258](https://github.com/pnpm/pnpm/issues/7258). Enable it in `pnpm-workspace.yaml` or use `pnpm install --auto-dedupe` or `pnpm add --auto-dedupe`. Frozen installs leave the lockfile unchanged.

- `pnpm install`, `pnpm run`, and `pnpm exec` on macOS and Linux now reuse a `node_modules` directory and bin shims that moved or were copied together with their project [#6937](https://github.com/pnpm/pnpm/issues/6937). The first command after the move checks the tree and records its new location, so project commands in `node_modules/.bin` keep working.

- `pnpm add --save-types` saves available `@types/*` packages in `devDependencies` alongside registry dependencies [#3868](https://github.com/pnpm/pnpm/issues/3868). Packages that declare bundled TypeScript types are skipped. Set `saveTypes: true` in `pnpm-workspace.yaml` to enable this by default.

- `package.yaml` manifests can now be updated by `pnpm add`, `pnpm update`, `pnpm remove`, `pnpm pkg`, `pnpm link`, `pnpm set-script`, and `pnpm version` [#2008](https://github.com/pnpm/pnpm/issues/2008). Existing comments and key order are preserved.

- Catalog entries can now use the `file:` and `link:` protocols [#8642](https://github.com/pnpm/pnpm/issues/8642). A relative path or bare path in an entry, such as `./tarballs/foo.tgz`, is measured from the directory holding `pnpm-workspace.yaml`.

- `pnpm tasks status` lists running and waiting tasks in each concurrency group, and waiting tasks now take available slots in arrival order with higher `priority` tasks going first [#15208](https://github.com/pnpm/pnpm/issues/15208). If workspaces use different limits for the same group, a later task can take a free slot that earlier tasks cannot use. A package script named `tasks` takes precedence; use `pnpm pm tasks status` when that script exists.

- `pnpm cache prune` deletes registry metadata cache directories that this version of pnpm can no longer read [#15046](https://github.com/pnpm/pnpm/issues/15046). `pnpm cache prune --dry-run` lists what it would delete without removing anything.

- `macosBackup.excludeModulesDir` and `macosBackup.excludeStoreDir` on macOS can now exclude newly created modules, virtual-store, and package-store directories from Time Machine [#6440](https://github.com/pnpm/pnpm/issues/6440). Set either to `true` in global configuration or using the `PNPM_CONFIG_MACOS_BACKUP_EXCLUDE_MODULES_DIR` and `PNPM_CONFIG_MACOS_BACKUP_EXCLUDE_STORE_DIR` environment variables.

- `pnpm add --tilde` is now an alias for `--save-prefix=~` [#12863](https://github.com/pnpm/pnpm/issues/12863). The Yarn `-T` shorthand is not supported.

- `progress` setting and `--no-progress` option now turn off dependency and download progress lines [#14065](https://github.com/pnpm/pnpm/issues/14065). Warnings, lifecycle output, and the dependency summary are still printed.

### Patch Changes

#### Security

- POSIX bin shims now take `cygpath` and `wslpath` from the system default path on Cygwin, MSYS2, and WSL2 so a dependency cannot redirect another package's shim [#14866](https://github.com/pnpm/pnpm/issues/14866).

- `pnpm install` warnings no longer carry the text of a package's deprecation notice, naming only the deprecated package and version [#15099](https://github.com/pnpm/pnpm/issues/15099). A deprecation warning names the newest non-deprecated version when one exists, and control characters and line separators are stripped from package identifiers and warnings.

- `pnpm install` and other commands that report configuration warnings now warn when environment variables in project `.npmrc` credentials are ignored [#15051](https://github.com/pnpm/pnpm/issues/15051).

#### Installing packages

- `pnpm install --frozen-lockfile` now succeeds when an optional dependency was unresolvable and skipped by the install that wrote the lockfile [#3960](https://github.com/pnpm/pnpm/issues/3960).

- `pnpm install --frozen-lockfile` no longer installs dependencies of projects removed from `pnpm-workspace.yaml` [#15248](https://github.com/pnpm/pnpm/issues/15248). Missing local tarballs used only by those projects no longer fail the install.

- `pnpm ci` now empties `node_modules` before installing in a project that declares a `clean` script [#15276](https://github.com/pnpm/pnpm/issues/15276).

- `pnpm install --force` now re-imports every package into the virtual store [#15030](https://github.com/pnpm/pnpm/issues/15030) and removes obsolete dependency links inside virtual-store packages when their dependencies change [#15039](https://github.com/pnpm/pnpm/issues/15039).

- `preinstall` script for the root project now runs before dependencies are resolved and linked [#3760](https://github.com/pnpm/pnpm/issues/3760).

- `pnpm install` now runs `pnpm:devPreinstall` when the root project uses `package.yaml` [#15168](https://github.com/pnpm/pnpm/issues/15168).

- `pnpm install` now enforces the root project's `engines.node` range when `engineStrict` is enabled [#3016](https://github.com/pnpm/pnpm/issues/3016).

- `pnpm install` now uses the running Node.js when `devEngines.runtime` declares a range without `onFail: download` [#15230](https://github.com/pnpm/pnpm/issues/15230).

- `pnpm install` no longer hangs when a git dependency is fetched over SSH and ssh prompts for a passphrase or host key confirmation, running ssh in batch mode instead [#2227](https://github.com/pnpm/pnpm/issues/2227).

- `pnpm install` now installs git-hosted dependencies without preparing them when their builds are explicitly denied by `allowBuilds` [#10522](https://github.com/pnpm/pnpm/issues/10522).

- `pnpm install` now reuses an in-flight tarball download when another resolution of the same archive still needs its `package.json` [#15037](https://github.com/pnpm/pnpm/issues/15037).

- `pnpm install --prod` no longer downloads registry packages that only a devDependency reaches [#881](https://github.com/pnpm/pnpm/issues/881).

- `pnpm install --no-runtime --frozen-lockfile` with `nodeLinker: hoisted` no longer fails on repeated runs with a broken lockfile [#15212](https://github.com/pnpm/pnpm/issues/15212).

#### Resolving and linking dependencies

- `pnpm install` and `pnpm update` now resolve a dependency range to the newest matching version that is not deprecated [#15128](https://github.com/pnpm/pnpm/issues/15128).

- `pnpm add <pkg>` without a version now uses the catalog entry when the workspace already catalogs that package [#14865](https://github.com/pnpm/pnpm/issues/14865).

- `pnpm install` now links workspace dependencies declared with plain version ranges when `excludeLinksFromLockfile` and `linkWorkspacePackages` are enabled [#15133](https://github.com/pnpm/pnpm/issues/15133).

- `pnpm install` now resolves local tarball dependencies whose absolute `file:` paths contain `..` consistently and skips reinstallation on repeat installs [#15190](https://github.com/pnpm/pnpm/issues/15190).

- `pnpm install` now installs dependencies when a custom resolver returns a local or git-hosted tarball without a manifest [#15016](https://github.com/pnpm/pnpm/issues/15016).

- `pnpm.overrides` entries written as a bare path, such as `./local-dep`, are now measured from the directory holding `pnpm-workspace.yaml` [#11131](https://github.com/pnpm/pnpm/issues/11131).

- `pnpm update --no-save` no longer bypasses version-scoped overrides when a dependency selector specifies a version [#14923](https://github.com/pnpm/pnpm/issues/14923).

- `pnpm peers check` and strict peer dependency checks no longer reject compatible versions from named registries [#15225](https://github.com/pnpm/pnpm/issues/15225).

- `pnpm outdated` and `pnpm update --interactive --latest` now include named-registry dependencies such as `work:2.1.0` and preserve their registry prefix [#15226](https://github.com/pnpm/pnpm/issues/15226).

- Workspace projects selected by `hoistPattern` or `publicHoistPattern` are now hoisted on every install [#3642](https://github.com/pnpm/pnpm/issues/3642).

- Workspace packages with SemVer build metadata are no longer skipped when they match the requested range and have the same version precedence as the registry package [#2812](https://github.com/pnpm/pnpm/issues/2812).

- Sped up `pnpm dedupe` and `pnpm install` in projects with many convergence overrides by checking overrides concurrently [#15175](https://github.com/pnpm/pnpm/issues/15175).

- `minimumReleaseAge` is no longer skipped for packages served by registries returning matching ETags for abbreviated and full package metadata [#14925](https://github.com/pnpm/pnpm/issues/14925).

#### Running scripts and tasks

- `pnpm run` signal handling no longer delivers a redundant second `SIGINT` to child scripts on `Ctrl+C` in a terminal, and properly forwards termination signals when running non-interactively without a terminal [#7374](https://github.com/pnpm/pnpm/issues/7374).

- `pnpm run` and `pnpm exec` in workspaces with `sharedWorkspaceLockfile: false` now verify dependencies in the selected projects rather than expecting a root workspace state [#15272](https://github.com/pnpm/pnpm/issues/15272).

- `pnpm test` now forwards `--filter` arguments to the test script when the option follows the shortcut [#15217](https://github.com/pnpm/pnpm/issues/15217).

- Recursive runs now start scripts matched by a `/pattern/` selector in parallel within `workspaceConcurrency` [#14933](https://github.com/pnpm/pnpm/issues/14933).

- `pnpm deploy`, `pnpm rebuild`, `pnpm rb`, and `pnpm setup` now prefer a `package.json` script of the same name [#14976](https://github.com/pnpm/pnpm/issues/14976).

- `modulesDir` custom directory names now support executable lookup and CommonJS plugin resolution across `pnpm run`, `pnpm exec`, `pnpm version` hooks, and lifecycle scripts [#3604](https://github.com/pnpm/pnpm/issues/3604).

- `pnpm install-test` now accepts `--no-bail` directly and in recursive runs [#3777](https://github.com/pnpm/pnpm/issues/3777).

#### Workspace and project configuration

- `pnpm` commands run in a project not included in the workspace now act on that project alone [#3561](https://github.com/pnpm/pnpm/issues/3561).

- `pnpm-workspace.yaml` edits now preserve scalar YAML anchors and aliases [#8245](https://github.com/pnpm/pnpm/issues/8245).

- `pnpm-workspace.yaml` now expands environment variable placeholders with fallback syntax in enum-valued settings such as `nodeLinker` [#14914](https://github.com/pnpm/pnpm/issues/14914).

- `pnpmfile` configuration now loads a `.js` file as CommonJS or an ES module, following the nearest `package.json` [#15141](https://github.com/pnpm/pnpm/issues/15141).

- `updateConfig` hook settings are now honored by `pnpm peers check`, `why`, `list`, `ll`, `licenses`, `audit`, `sbom`, `fetch`, `patch`, `patch-commit`, `patch-remove`, `approve-builds`, and `runtime` [#15047](https://github.com/pnpm/pnpm/issues/15047), [#15049](https://github.com/pnpm/pnpm/issues/15049).

- `readPackage` hook changes or removal now take added dependencies out of `pnpm-lock.yaml` and update dependencies when an existing lockfile is present [#3735](https://github.com/pnpm/pnpm/issues/3735), [#15136](https://github.com/pnpm/pnpm/issues/15136).

- `package.yaml` projects now record their pinned pnpm under `packageManagerDependencies` in `pnpm-lock.yaml` [#15167](https://github.com/pnpm/pnpm/issues/15167).

- `packageManagerDependencies` pinning `@pnpm/exe` beside `pnpm` is no longer rewritten in `pnpm-lock.yaml` [#14926](https://github.com/pnpm/pnpm/issues/14926).

- `pnpm` now preserves CRLF line endings when modifying project manifests [#3529](https://github.com/pnpm/pnpm/issues/3529).

- `loglevel` setting is now honored when configured in `pnpm-workspace.yaml`, global configuration, or `PNPM_CONFIG_LOGLEVEL` [#3122](https://github.com/pnpm/pnpm/issues/3122).

- `storeDir` values loaded from global configuration or `PNPM_CONFIG_STORE_DIR` now expand a leading `~/` to the user's home directory [#6560](https://github.com/pnpm/pnpm/issues/6560).

- `--shared-workspace-lockfile` now produces a warning when passed on the command line outside a workspace [#1617](https://github.com/pnpm/pnpm/issues/1617).

#### Windows

- `pnpm install` on Windows now runs dependency build scripts from long global virtual store paths and normalizes scoped package paths in lifecycle script `PATH` entries [#15111](https://github.com/pnpm/pnpm/issues/15111).

- `pnpm install` across projects sharing a global virtual store on Windows no longer fails with `Access is denied`, file-exists errors, or transient sharing violations [#15114](https://github.com/pnpm/pnpm/issues/15114), [#15176](https://github.com/pnpm/pnpm/issues/15176), [#15171](https://github.com/pnpm/pnpm/issues/15171).

- `pn`, `pnpx`, `pnx`, and `pnpm` now run when Git Bash, MSYS2, or Cygwin launches them through a Windows path [#14884](https://github.com/pnpm/pnpm/issues/14884).

- `pnpm dlx` now reuses cached packages when Windows creates directory junctions for its cache links [#15171](https://github.com/pnpm/pnpm/issues/15171).

- `pnpm pipeline --watch` now resolves Windows short paths so multiple path representations share the build cache [#15105](https://github.com/pnpm/pnpm/issues/15105).

#### CLI commands and output

- `pnpm remove` now runs the project's own `preuninstall`, `uninstall`, and `postuninstall` scripts [#3276](https://github.com/pnpm/pnpm/issues/3276).

- `pnpm remove -r` now fails before modifying manifests if any requested dependency is absent from all selected projects [#2319](https://github.com/pnpm/pnpm/issues/2319).

- `pnpm update --peer` now updates ranges in `peerDependencies` [#8081](https://github.com/pnpm/pnpm/issues/8081).

- `pnpm update` now moves `devEngines.runtime` and `engines.runtime` version ranges to the resolved Node.js version [#14988](https://github.com/pnpm/pnpm/issues/14988).

- `pnpm update -g` no longer reinstalls unchanged packages [#12002](https://github.com/pnpm/pnpm/issues/12002).

- `pnpm add -g`, `pnpm update -g`, and `pnpm remove -g` now recover a global package group whose `node_modules` directory was deleted [#15093](https://github.com/pnpm/pnpm/issues/15093).

- `pnpm add -g` now installs local tarballs when `PNPM_HOME` contains `..` path segments [#15118](https://github.com/pnpm/pnpm/issues/15118).

- `pnpm version` now reads `tagVersionPrefix` from `pnpm-workspace.yaml`, global config, or `PNPM_CONFIG_TAG_VERSION_PREFIX` when creating and reading Git tags [#15044](https://github.com/pnpm/pnpm/issues/15044).

- `pnpm publish` now allows a detached Git HEAD in CI environments [#5894](https://github.com/pnpm/pnpm/issues/5894).

- `pnpm store prune` now removes unreferenced files and packages from the content-addressable store [#3635](https://github.com/pnpm/pnpm/issues/3635), as well as expired or superseded `pnpm dlx` cache data [#15171](https://github.com/pnpm/pnpm/issues/15171).

- `pnpm cache list-registries` now prints decoded registry URLs [#15046](https://github.com/pnpm/pnpm/issues/15046).

- `pnpm deploy` no longer triggers an install when running scripts in a read-only deployed filesystem [#11617](https://github.com/pnpm/pnpm/issues/11617).

- `pnpm -r list --json` now outputs a single JSON array when `sharedWorkspaceLockfile` is `false`, and `--long` and `--parseable` read each project's own modules directory [#15011](https://github.com/pnpm/pnpm/issues/15011).

- `pnpm sbom` now validates SPDX identifiers and expressions before emitting them as CycloneDX license IDs or expressions, falling back to a license name for non-SPDX values such as `UNLICENSED` [#14786](https://github.com/pnpm/pnpm/issues/14786).

- `pnpm change check` now validates pending change intents in `.changeset/` [#15183](https://github.com/pnpm/pnpm/issues/15183).

- `pnpm --filter` and `pnpm -F` shell completion now suggests workspace package names [#15216](https://github.com/pnpm/pnpm/issues/15216). Completion candidates containing control or invisible formatting characters are omitted so package and script names cannot inject terminal escape sequences.

- `pnpm run` and `pnpm run-script` shell completion now suggests package scripts [#15034](https://github.com/pnpm/pnpm/issues/15034).

- `pnpm --version` no longer creates a temporary file in the project directory during store detection [#15264](https://github.com/pnpm/pnpm/issues/15264).

- `pnpm setup` now describes displayed configuration changes as "The following configuration changes were made" [#15100](https://github.com/pnpm/pnpm/issues/15100).

- `minimumReleaseAge` approval prompts in `pnpm install` and `pnpm update -g` now count and display each package version once [#15083](https://github.com/pnpm/pnpm/issues/15083), [#15091](https://github.com/pnpm/pnpm/issues/15091).

- `.npmrc` authentication warnings now report when an empty environment variable removes an auth token and name the affected key [#4806](https://github.com/pnpm/pnpm/issues/4806).

- The install summary now names the version each dependency resolved to when `node-linker` is `hoisted` [#15161](https://github.com/pnpm/pnpm/issues/15161).

- `pnpm install` now re-links a package's global virtual store slot after `allowBuilds` changes [#15117](https://github.com/pnpm/pnpm/issues/15117).

## 12.5.1

### Patch Changes

- pnpm now reports an unknown task setting in `pnpm-workspace.yaml` and carries on. It used to refuse to start, so a project could not use a task setting that only the pnpm version its `packageManager` pins reads. The setting is still an error when the running pnpm is that pinned version.

- Python interpreter installation now retries historical release metadata requests. It caches the release list for up to 24 hours and refreshes it once after a lookup miss. When a release omits the current platform, the search samples at most eight other releases before reporting that the lookup is inconclusive.

- Python `registries` entries now route packages by exact names or trailing-prefix patterns in `packages`. Registry declaration order no longer affects resolution. A matched package resolves exclusively from its assigned registry, including transitive and build dependencies. Use `packages: ["*"]` to declare the default index.

- `pnpm install` no longer fails with "Too many levels of symbolic links" when a Cargo configuration file above the workspace is a symlink, such as a `~/.cargo/config.toml` linked from a dotfiles repository.

- `pnpm install` now returns "Already up to date" in a workspace where `dedupeDirectDeps` left a project without a `node_modules` directory of its own. Such a project forced a full install on every run.

- `pnpm install` no longer refuses the repeat-install fast path just because a changed `pnpm-lock.yaml` is 16 MiB or larger. Such a lockfile forced a full install on the run after every change.

## 12.5.0

pnpm 12.5.0 makes Python a first-class ecosystem, accepts Package URLs in `pnpm add`, names whole platforms in `supportedArchitectures`, and gives tasks machine-wide concurrency limits. It also fixes an install that could reuse one package's downloaded tarball for another.

### Minor Changes

#### Installing packages

- `pnpm add` accepts a [Package URL](https://github.com/package-url/purl-spec) in place of a package name. `pnpm add pkg:npm/express@4.18.2` saves `express` to `package.json`. `pnpm add pkg:cargo/serde@1.0.188` saves `serde` to `Cargo.toml`. `pnpm add pkg:pypi/requests@2.31.0` saves `requests` to `pyproject.toml`. `pkg` is now a reserved specifier prefix, whatever case it is written in, so a named registry can no longer be called `pkg`.

- A `registries` entry can now name the ecosystem it serves.

  ```yaml
  registries:
    https://internal.example/simple/:
      ecosystem: pypi
    https://pypi.org/simple/:
      ecosystem: pypi
    https://index.crates.io/:
      ecosystem: cargo
  ```

  `ecosystem` accepts `npm`, `cargo` and `pypi`. An entry that does not name one serves npm, as every entry did before.

  An ecosystem with several indexes searches them in the order they are declared. The first index that has a package supplies it, so the one declared last answers what none before it had.

  A `registries` entry may not carry credentials. pnpm reads them from `.npmrc`, matched by origin, for a PyPI index as for every other package source.

#### Configuring pnpm

- `supportedArchitectures` now accepts a list of platforms, in place of the `os`, `cpu` and `libc` axes.

  ```yaml
  supportedArchitectures:
    - linux-x64
    - darwin-arm64
    - win32-x64
  ```

  An install prepares for the platforms the list names, and for those only. A platform reads as `<os>-<cpu>`, with a C library on Linux, as in `linux-x64-musl` or `linux-x64-manylinux_2_28`. The Rust target triple of the same machine is accepted too, so `x86_64-unknown-linux-gnu` names the platform `linux-x64` names. A Linux platform that names no C library is the glibc platform. `current` is the platform the install runs on.

  The `os`, `cpu` and `libc` mapping keeps working and keeps its meaning.

- Added concurrency groups for tasks. A task in `pnpm-workspace.yaml` can name a `concurrencyGroup`. The new `concurrencyGroups` setting gives each group a limit. At most that many tasks of the group run at once on the machine, counted across every pnpm process, `pnpm pipeline` included. A task past the limit waits for a running one to finish. A script that calls `pnpm run` for a task of the same group runs under the slot its parent holds.

  ```yaml
  tasks:
    test:rust:
      concurrencyGroup: cargo
  concurrencyGroups:
    cargo: 2
  ```

- `tools` names the programs pnpm downloads, and `mirror` says where each one comes from.

  ```yaml
  tools:
    node:
      mirror: https://mirror.example.com/node/download
      channels:
        nightly: https://nightly.example.com/
    bun:
      mirror: https://mirror.example.com/bun
    python:
      mirror: https://mirror.example.com/python-build-standalone/releases
  ```

  `node`, `bun` and `python` can be named. Any other tool is refused.

  `mirror` is the base a tool's own layout hangs off.

  `channels` sends one release channel elsewhere. A channel neither it nor `node-mirror:<channel>` names is left to `mirror`. Only `node` publishes channels, so naming them for another tool is refused.

  Set it in the global `config.yaml` or in `PNPM_CONFIG_TOOLS`. A `pnpm-workspace.yaml` that names a tool mirror is ignored.

  `pnpm pack-app` downloads the Node.js it embeds through `tools.node`. `node-mirror:<channel>` keeps working and names the same thing as an entry under `channels`.

#### Python interpreters and environments

- `pnpm install` now chooses a Python interpreter for each project instead of installing every project with one interpreter [#14945](https://github.com/pnpm/pnpm/issues/14945). A project is installed with the first interpreter on the machine that its `requires-python` accepts, so a workspace can hold projects that support different Python versions. pnpm reads `.python-version` too, and prefers the version it asks for. Set `python.executable` in `pnpm-workspace.yaml` to name one interpreter for every project.

- `pnpm install` now installs a Python interpreter when no interpreter on the machine fits the project [#14945](https://github.com/pnpm/pnpm/issues/14945). The builds are [python-build-standalone](https://github.com/astral-sh/python-build-standalone)'s, which uv and rye install too. One interpreter is shared by every project on the machine, and a later install uses it without downloading anything. `runtimeOnFail` decides what an install with no interpreter that fits does, the way it does for a Node.js runtime. `error` reports the project instead of installing one. `warn` and `ignore` install with an interpreter the machine has that the project's `requires-python` rejects. `tools.python.mirror` names a mirror.

- Python environments now live in the store. Each project keeps only its `.venv` link, which points at the project's current environment generation under `python-envs` in the store. A repository with many Python projects no longer holds a `.pnpm/python-envs` directory in each of them. The next install relinks a `.venv` that an earlier release published. The old `.pnpm/python-envs` directory is left in place, since a running program may still use it, and can be deleted once none does. With `frozenStore` set, pnpm writes nothing to the store, so environments stay in the project's `.pnpm/python-envs` [#15014](https://github.com/pnpm/pnpm/issues/15014).

- Python environments now use `packageImportMethod` to import wheel files from the store. Use `clone-or-copy` for copy-on-write clones with a copy fallback, or `copy` for independent files. Hardlinked files share writes with the store and other environments.

  Isolated Python build environments keep backend writes private with copy-on-write clones or copies.

#### Python projects and workspaces

- `pnpm install` now installs a Python project's own package, so the project can be imported and the commands in `[project.scripts]` run right after an install [#14945](https://github.com/pnpm/pnpm/issues/14945). The installed package points at the source tree, so an edit to a module takes effect without another install. pnpm installs the package of a project that declares a `[build-system]`. `tool.uv.package` overrides that either way.

- `pnpm install` now installs a Python project in the workspace from its own source. Declare it under `[tool.uv.sources]`, as `shared = { workspace = true }` or `shared = { path = "../shared", editable = true }`. pnpm builds the project with the backend it declares. It installs the build editable, so an edit to the project takes effect without another install.

  Approve the build backend under `allowBuilds` in `pnpm-workspace.yaml` as a Package URL, as `pkg:pypi/hatchling: true`. An install that has not approved a backend does not build the projects that need it. The message names the key to add.

  `pnpm install` now refuses a requirement that names a project in the workspace when nothing declares where it comes from. It used to take that name from the index.

- The members of a uv workspace can now share one Python environment. Set `shared-environment = true` under `[tool.pnpm.python]` in the `pyproject.toml` that declares `[tool.uv.workspace]`. `pnpm install` then resolves every member as one graph into one `pylock.toml` and one `.venv` at the workspace root. Two members that require versions of a distribution no release satisfies at once are refused with an error naming both. Each project still gets an environment of its own by default [#15015](https://github.com/pnpm/pnpm/issues/15015).

- Python projects can now select extras and dependency groups through `[tool.pnpm.python]` in `pyproject.toml` [#14945](https://github.com/pnpm/pnpm/issues/14945). Workspace `python.extras` and `python.groups` defaults now skip names a project does not define.

- `pnpm install` now reads dynamic Python project metadata from the build backend [#14945](https://github.com/pnpm/pnpm/issues/14945). Projects with only a `requirements.txt` file now get a Python environment and lockfile.

#### Python dependencies and lockfiles

- pnpm can now resolve `pylock.toml` for several platforms and Python versions at once. `supportedArchitectures` names the platforms to lock for and `python.versions` the versions. Every platform is paired with every version. One committed lockfile then serves Linux CI and macOS or Windows contributors [#14945](https://github.com/pnpm/pnpm/issues/14945).

  ```yaml
  supportedArchitectures:
    - linux-x64-manylinux_2_28
    - darwin-arm64
    - win32-x64
  python:
    enabled: true
    versions: ['3.12', '3.13']
  ```

  The lockfile pins the wheel each environment takes for a distribution. It marks a package only some environments install. `pnpm install` takes the packages and wheels of the environment its interpreter matches, and refuses an interpreter none of them stand for. pnpm resolves a project that declares environments itself, not through the server `pnprServer` names. Naming neither setting locks for the interpreter running the install.

- `python.overrides` and `python.constraints` pin the versions a Python resolution may pick [#14945](https://github.com/pnpm/pnpm/issues/14945). pnpm reads uv's own overrides and constraints from `pyproject.toml` too.

- `pnpm install` now supports Python dependencies from Git repositories [#14945](https://github.com/pnpm/pnpm/issues/14945). Direct wheel URLs are also supported. Sources can be declared in `[tool.uv.sources]`. Git dependencies require `allowBuilds` approval.

- `pnpm install` can install a Python release that publishes no wheel this interpreter accepts, by building the source distribution the index serves beside it [#14945](https://github.com/pnpm/pnpm/issues/14945). The archive is pinned in `pylock.toml` by name and SHA-256. A later install replays it from the store, offline included. Building a source distribution runs the release's own build backend. Approve it with `pkg:pypi/<distribution>: true` under `allowBuilds`.

  A resolution that finds no version of a distribution now says why. It tells apart a distribution no index publishes, one whose releases publish nothing this interpreter can install, and one whose versions the project's requirements exclude.

### Patch Changes

#### Installing packages

- pnpm no longer reuses one package's downloaded tarball for another package whose resolution pins a different integrity hash to the same URL [#15021](https://github.com/pnpm/pnpm/issues/15021).

- `pnpm install` and `pnpm add` now report an error when `package.json`, `pnpm-lock.yaml`, `pyproject.toml` or another file they snapshot before installing is a named pipe or a device. The command used to wait forever for something to write to it.

- `pnpm install --prod` and `pnpm install --dev` now record every dependency group in `pnpm-lock.yaml`. `node_modules` still holds only the groups the filter selects. They used to write the filter into the lockfile, so a later `pnpm install --frozen-lockfile` rejected it. `pnpm prune --prod`, `pnpm prune --dev`, and `pnpm prune --no-optional` behave the same way [#14912](https://github.com/pnpm/pnpm/issues/14912).

- POSIX bin shims now convert a Windows-form path such as `C:\node_modules\.bin\tsc` correctly. The shim mangled the backslashes in such a path and could not reach the package it runs. Installing again replaces the shims already in `node_modules` [#14867](https://github.com/pnpm/pnpm/issues/14867).

- Two pnpm processes installing one workspace at the same time no longer fail on Windows with "Access is denied" while writing `node_modules/.pnpm-workspace-state-v1.json`. The write now retries the transient lock the other process holds, as pnpm's other file writes do.

- pnpm now reads the manifest from the tarball when a pnpmfile `resolvers` hook returns a resolution without one. Such a package installed alone, with none of its own dependencies and no warning [#15000](https://github.com/pnpm/pnpm/issues/15000).

- `pnpm install` now merges Git conflict markers in `pnpm-lock.yaml`. It parses both sides of the conflict and keeps the versions they locked. A conflict in the config dependencies recorded at the top of the lockfile is merged too [#14880](https://github.com/pnpm/pnpm/issues/14880).

#### Cargo projects

- `pnpm install` can now generate `Cargo.lock` for workspaces with path or Git `[patch]` and `[replace]` overrides. Adding, removing, and updating crates also preserve these overrides [#14950](https://github.com/pnpm/pnpm/issues/14950).

  Cargo lockfile resolution blocks unsupported Git transport helpers declared by transitive dependencies.

- `pnpm install` now vendors recursive Git submodules for Cargo dependencies at their pinned commits. Cargo builds can use these sources offline. Set Git's `protocol.file.allow` to `always` to fetch local file submodules. pnpm fetches cached Git crates again on the first online install [#14951](https://github.com/pnpm/pnpm/issues/14951).

- `pnpm install` now generates `Cargo.lock` for workspaces with Git dependencies, including a dependency that omits a package version. It also downloads the Rust standard library's dependencies when Cargo configuration enables `build-std` [#14944](https://github.com/pnpm/pnpm/issues/14944).

- `pnpm install` now handles weak Cargo features, written `crate?/feature`. Resolution failed when one dependency turned on an optional crate and another asked for a weak feature of it [#14960](https://github.com/pnpm/pnpm/issues/14960). The generated `Cargo.lock` now also includes the dependencies weak features reference, which Cargo rejected with `--locked` for crates such as `uuid` [#14978](https://github.com/pnpm/pnpm/issues/14978).

- `pnpm install` now generates `Cargo.lock` when a crate version it considers depends on a release the registry carries only as yanked. pnpm rules that version out and resolves the rest of the graph. Resolution failed with an error such as `no non-yanked version of napi-build satisfies ^3.0.0-beta` [#14952](https://github.com/pnpm/pnpm/issues/14952).

- `pnpm install` now falls back to an older semver-incompatible version of a crate when the newest one a dependency range allows cannot be resolved. Ranges such as `>=1, <3` span several of them [#14962](https://github.com/pnpm/pnpm/issues/14962).

#### Python projects

- `pnpm install` now honors uv workspace members when discovering Python projects. When no uv workspace declares a project, pnpm skips projects under conventional example, demo, documentation, template, `test`, `tests`, and test fixture directories [#15058](https://github.com/pnpm/pnpm/issues/15058).

- `pnpm install --filter <selector>` now installs only the Python projects the selection asks for. A Python project that shares a directory with an npm workspace project is selected with that project. A Python project in a directory of its own is selected by the distribution it declares, by its path, or through the `[tool.uv.sources]` entries that reach it. Under `--fail-if-no-match`, a selector that names only a Python project is a match. `pnpm add --filter <selector> pypi:<package>` writes the requirement to every selected project [#14945](https://github.com/pnpm/pnpm/issues/14945).

- `pnpm install` now installs wheels whose `RECORD` hashes disagree with their contents. The wheel archive's locked SHA-256 hash remains verified. pnpm writes correct hashes to the installed `RECORD` [#15061](https://github.com/pnpm/pnpm/issues/15061).

- `pnpm install` now installs a Python wheel whose `WHEEL` file lists tags that differ from the ones in its filename. A wheel whose filename tags were changed after the build, such as `mysql-connector-python`, was rejected [#14945](https://github.com/pnpm/pnpm/issues/14945).

- A Python release whose wheel metadata declares a requirement pnpm cannot read no longer fails the install. pnpm now resolves the project against the other releases of that package, and reports the unreadable requirement when none of them works.

- `pnpm install` no longer fails when a Python index lists a file pnpm cannot use, such as a release with no SHA-256 digest or an unreadable wheel filename. That file is left out and the project resolves against the remaining releases.

- `pnpm add pypi:<package>` in a directory that has no `pyproject.toml` now names the missing file and says where to run the command. It used to fail with a bare `No such file or directory (os error 2)` [#14945](https://github.com/pnpm/pnpm/issues/14945).

#### Performance

- `pnpm audit` no longer hangs on dependency graphs with many shared dependencies [#15005](https://github.com/pnpm/pnpm/issues/15005).

- Sped up `pnpm install` in Python workspaces with many projects. Projects now prepare concurrently. Projects with identical registry requirements also share fresh dependency resolutions [#14945](https://github.com/pnpm/pnpm/issues/14945).

- Repeat installs through the Node-API bindings now return "Already up to date" when the project manifests still match `pnpm-lock.yaml`. Before, every such install reinstalled the whole tree. An install also no longer reinstalls when `pnpm-lock.yaml` differs from the installed dependencies only by packages no project depends on or by top-level keys pnpm does not define.

#### Other commands

- `pnpm deploy` now links commands exposed by workspace dependencies into the deployed project's `node_modules/.bin` directory [#14899](https://github.com/pnpm/pnpm/issues/14899).

- `pnpm dlx` and `pnx` now prompt to approve dependency build scripts in interactive terminals [#14943](https://github.com/pnpm/pnpm/issues/14943). Cached packages with pending builds also prompt for approval. Without an interactive terminal, use `--allow-build` to allow the required builds.

- `pnpm add -g` and `pnpm update -g` now ignore incomplete unrelated global package groups when every command from the replaced group is retained. Operations that could remove a global command still require complete ownership information.

- `pnpm pack` now writes tarball entries grouped by file extension and file name, the order npm uses. Packages that ship many same-named files, such as template collections, pack much smaller [#14766](https://github.com/pnpm/pnpm/issues/14766).

- `pnpm outdated --long` fills the Details column with the package homepage again [#14886](https://github.com/pnpm/pnpm/issues/14886).

## 12.4.2

pnpm 12.4.2 includes security fixes for executable shims and GitHub Actions links, more reliable installs, faster peer dependency checks in workspaces, and Python lockfiles that work across compatible targets.

### Patch Changes

#### Security

- Dependency executables can no longer take over another package's POSIX bin shim through its shell helpers. Reinstall dependencies to replace existing shims [#14837](https://github.com/pnpm/pnpm/issues/14837).

  On Cygwin, MSYS2, and WSL, shims still use `PATH` for Windows path conversion, so dependency executables can still redirect them there.

- GitHub Actions homepage links no longer expose server credentials. GitHub server URLs now require HTTPS, with HTTP allowed only for loopback hosts.

#### Installing packages

- pnpm no longer crashes at startup on FreeBSD and other Unix-like platforms. Platforms other than Windows and macOS use `~/.local/share/pnpm/store` by default [#14859](https://github.com/pnpm/pnpm/issues/14859).

- `pnpm install` on Windows no longer fails with `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` when clearing `node_modules` containing linked dependencies, such as when changing `nodeLinker` [#14790](https://github.com/pnpm/pnpm/issues/14790).

- `pnpm install <pkg>` now accepts `--prod` and `--dev`, including `--prod=false` [#14868](https://github.com/pnpm/pnpm/issues/14868).

- `pnpm install` and `pnpm update` now honor `--ignore-workspace` in nested projects excluded from the surrounding workspace. The flag also skips that workspace's settings during the `packageManager` check [#14809](https://github.com/pnpm/pnpm/issues/14809).

- `pnpm install` on macOS no longer reuses stale files for `file:` tarball or git-hosted tarball dependencies.

- `pnpm install` in a single-project directory now detects `package.json` edits made while the previous install was finishing [#14890](https://github.com/pnpm/pnpm/issues/14890).

- `pnpm install --frozen-lockfile` now removes packages no longer reachable from any project in `pnpm-lock.yaml`. This also prevents repeated lifecycle script execution and unnecessary installs before `pnpm run` and `pnpm exec` with `verifyDepsBeforeRun` [#14891](https://github.com/pnpm/pnpm/issues/14891).

#### Resolving and updating dependencies

- Node.js runtime resolution now reports network failures from unofficial-builds.nodejs.org. These failures previously omitted musl builds from `pnpm-lock.yaml`, making its contents depend on network access [#14813](https://github.com/pnpm/pnpm/issues/14813).

- `pnpm install` now rejects invalid `peerDependencies` specifiers with `ERR_PNPM_INVALID_PEER_DEPENDENCY_SPECIFICATION`. A value such as `"foo": "foo@1.0.0"` previously created a broken directory link [#14791](https://github.com/pnpm/pnpm/issues/14791).

- `pnpm deploy` now writes plain registry versions in the deployed `package.json`, without peer dependency suffixes. The lockfile retains peer bindings, and npm aliases retain their target package names [#14873](https://github.com/pnpm/pnpm/issues/14873).

- `pnpm add <git repository>` now names repositories without a `package.json` as `@owner/repo`, allowing dependencies on equally named repositories from different owners [#14870](https://github.com/pnpm/pnpm/issues/14870).

- Peer dependency resolution now deduplicates packages whose child dependency resolves an optional peer in only some workspace projects, such as `next` with `styled-jsx`'s optional `babel-plugin-macros` peer [#14800](https://github.com/pnpm/pnpm/issues/14800).

- `pnpm update` now settles the lockfile in one run when an upgrade removes the package providing an optional peer dependency [#14895](https://github.com/pnpm/pnpm/issues/14895).

- `pnpm update --no-save` now preserves override-applied specifiers for dependencies it is not updating, preventing subsequent frozen installs from failing with `ERR_PNPM_OUTDATED_LOCKFILE` [#14836](https://github.com/pnpm/pnpm/issues/14836).

- `pnpm update --no-save` now succeeds under `minimumReleaseAgeStrict` when every resolved version is old enough [#14835](https://github.com/pnpm/pnpm/issues/14835).

#### Performance

- Workspace installs and `pnpm peers check` are faster when projects depend on each other, fixing a slowdown introduced in 12.3.0. Unmet peer dependencies of workspace packages are now reported only under projects that link them directly [#14906](https://github.com/pnpm/pnpm/issues/14906).

- Hoisted installs use less memory when packages are cached. Frozen-lockfile hoisted installs on macOS are also faster when reusable package directories are cached.

#### Python projects

- `pnpm install --frozen-lockfile` now reuses `pylock.toml` across compatible Python targets, including after kernel updates. Reuse requires unchanged requirements, index, and `requires-python`, compatible wheels, and a locked dependency graph matching the target's markers [#14843](https://github.com/pnpm/pnpm/issues/14843).

  The lockfile's `environments` marker now includes only the interpreter version and marker variables used by the dependency graph. Without `--frozen-lockfile`, pnpm warns and resolves again when the locked graph no longer matches the target.

- Python resolution no longer fails on malformed `Requires-Python` values, such as the trailing comma in `openpyxl` 3.0.x. pnpm treats these releases as declaring no interpreter range [#14910](https://github.com/pnpm/pnpm/issues/14910).

- `pnpm add pypi:...` now rejects unsupported `--save-prefix` values before editing the manifest or resolving dependencies.

#### Workspaces and scripts

- Scripts listed in `syncInjectedDepsAfterScripts` no longer fail with `ERR_PNPM_INJECTED_DEPS_SYNC_READ_DIR` when the lockfile contains an injected package copy that no project depends on.

- `shellEmulator` now expands `${VAR}`, `${VAR:-default}`, and `${VAR:+alternative}` in scripts [#14814](https://github.com/pnpm/pnpm/issues/14814).

- Cargo and Python project discovery now honors `!` exclusions in `pnpm-workspace.yaml` `packages`, skipping both parsing and generated source configuration for excluded projects [#14844](https://github.com/pnpm/pnpm/issues/14844).

- `pnpm --filter "./packages/{app,lib}"` now selects either alternative. Brace alternatives can nest, span path separators, and combine with other wildcards.

- GitHub Actions updates now stop if an action reference changes during version resolution, and preserve unrelated workflow edits.

#### CLI and output

- `pn`, `pnpx`, and `pnx` now run the pnpm installed alongside them, even when that directory is absent from `PATH` or another pnpm comes first [#14803](https://github.com/pnpm/pnpm/issues/14803).

- `pnpm --version` now reports failures to install or record a project's pinned pnpm, then prints the running CLI's version. It also honors `--store-dir` and `--store` [#14831](https://github.com/pnpm/pnpm/issues/14831).

- `pnpm self-update` no longer reinstalls the active version when it was installed by the standalone installation script [#14823](https://github.com/pnpm/pnpm/issues/14823).

- `pnpm t` and `pnpm tst` work again as aliases for `pnpm test`.

- `pnpm sbom` now emits valid repository URLs in CycloneDX `externalReferences[].url` and SPDX `homepage`. Shorthands such as `vercel/ms` become `git+https` URLs, embedded credentials are removed, and invalid repository values are omitted [#14773](https://github.com/pnpm/pnpm/issues/14773).

## 12.4.1

pnpm 12.4.1 fixes installs that failed on filesystems refusing hard links or clones, on Android, and under `nodeLinker: hoisted`. Repeat installs are faster.

### Patch Changes

#### Installing packages

- `pnpm install` no longer fails with `Operation not permitted` when the filesystem refuses a hard link or a copy-on-write clone [#14722](https://github.com/pnpm/pnpm/issues/14722). Under `packageImportMethod: auto` and `clone-or-copy`, pnpm copies the file instead. EdenFS checkouts, which have no hard links, and rootless containers, which refuse the clone syscall, both hit this. An explicit `packageImportMethod: hardlink` or `clone` still reports the error.

  pnpm also copies a package file whose store entry has reached the filesystem's limit on names for one file, 1024 on NTFS and 65000 on ext4. Such a file failed the install under `packageImportMethod: hardlink`, and under `auto` it stopped pnpm hard linking for the rest of the install.

- `pnpm install` no longer writes a package file through a symlink left at the path it is importing to. Copying such a file overwrote whatever the link pointed at, and created that file when the link pointed nowhere. An executable package file also made the link's target executable.

- Fixed `pnpm install` and `pnpm dlx` on Android. Registry requests crashed because pnpm found no system CA certificates, so pnpm uses bundled ones there [#14777](https://github.com/pnpm/pnpm/issues/14777). Imports also failed with "Permission denied" on filesystems that deny hard links and reflinks, and now fall back to copying [#14780](https://github.com/pnpm/pnpm/issues/14780).

- `pnpm install` no longer fails with "Invalid cross-device link" while preserving a package's nested `node_modules` directory during a Docker build [#14758](https://github.com/pnpm/pnpm/issues/14758).

- `pnpm install` no longer fails on a package tarball that carries a file at the archive root, such as the `._*` entries macOS `tar` adds [#14701](https://github.com/pnpm/pnpm/issues/14701). The file is installed at the root of the package.

  A `file:` tarball packed without the usual `package/` directory is now recorded under the name and version from its own `package.json`. It was recorded under the alias the dependency was given, at version 0.0.0.

- Under `nodeLinker: hoisted`, `pnpm install` no longer re-imports packages that are already in place. A repeat install replaced the whole `node_modules` tree and reported `Packages: +N`. A package is still imported when its directory is missing, when its `package.json` no longer carries the installed version, when it is a `file:` dependency, and when it is patched. Lifecycle scripts no longer run again for a package left in place, and `pnpm rebuild` and a change to `allowBuilds` still reach it.

- `pnpm install` now runs a dependency's build scripts again when its side-effects cache entry has no files to restore [#14717](https://github.com/pnpm/pnpm/issues/14717). Such builds were skipped and nothing was put in their place, so a script whose whole effect lands outside its own package directory, such as a git hook installer, never took effect. pnpm no longer publishes empty artifacts to the shared side-effects cache either.

#### Resolving and linking dependencies

- `pnpm install`, `pnpm add`, and `pnpm dedupe` now apply `ignoredOptionalDependencies` [#14729](https://github.com/pnpm/pnpm/issues/14729). Matching optional dependencies are left out of the lockfile and are not installed. pnpm 12 installed them whenever it resolved dependencies from scratch.

- `pnpm install` no longer links a transitive dependency to a workspace package when `linkWorkspacePackages` is `true` and the dependency is declared with a plain version range [#14781](https://github.com/pnpm/pnpm/issues/14781). Enabling `preferWorkspacePackages` does not change this. Set `linkWorkspacePackages: deep` to link them.

- `pnpm install` no longer leaves dangling dependency links in workspace packages located above the workspace root [#14726](https://github.com/pnpm/pnpm/issues/14726).

- `pnpm install` and `pnpm add` no longer leave a dangling symlink in `node_modules` when a project starts depending directly on a package that the lockfile holds only as a transitive dependency with resolved peer dependencies [#14714](https://github.com/pnpm/pnpm/issues/14714).

- `pnpm dedupe` now keeps a compatible auto-installed peer when another workspace project depends on a newer major [#14697](https://github.com/pnpm/pnpm/issues/14697). Repeated runs alternated between compatible and incompatible peer versions.

- `pnpm peers check` no longer reports a peer dependency declared as `workspace:^`, `workspace:~`, or a bare `workspace:` as unmet [#14770](https://github.com/pnpm/pnpm/issues/14770). pnpm reported these as unmet whatever version the linked workspace project supplied.

#### Performance

- Sped up repeat installs [#14540](https://github.com/pnpm/pnpm/issues/14540). pnpm checks the store's files only for the packages it links into `node_modules`, instead of every package in the lockfile. Creating the command shims in `node_modules/.bin` makes about 1,500 fewer filesystem calls in a 76 project workspace. Installs that use the global virtual store read their slot paths from the cache directory instead of deriving them every time. Verifying a large lockfile also allocates less memory.

- Sped up `pnpm install` in Cargo workspaces with many member crates. Repeated installs reuse verified Cargo checksum metadata.

- Installing several packages from the same Git repository and commit now downloads the source once per install [#14725](https://github.com/pnpm/pnpm/issues/14725). Each package still runs its prepare scripts in its own copy of the checkout.

#### Running scripts and tasks

- pnpm now passes Ctrl+C on to the script or command it started and waits for it to shut down [#14723](https://github.com/pnpm/pnpm/issues/14723). pnpm exited first, so a script that was still writing landed on the shell prompt.

- `pnpm run "/pattern/" --no-bail` now lets every matched script finish after one of them fails [#14718](https://github.com/pnpm/pnpm/issues/14718). The command exits with `ERR_PNPM_RUN_FAILED`, and its message lists the scripts that failed in the order they were selected.

- `pnpm pipeline` no longer fails on a project that tracks a symlink, such as a `CLAUDE.md` pointing at `AGENTS.md` [#14692](https://github.com/pnpm/pnpm/issues/14692). Changing a symlinked input's target invalidates that task's cache, and `pnpm pipeline --no-cache` no longer hashes task inputs.

#### Commands

- `pnpm add -g`, `pnpm update -g`, and `pnpm remove -g` no longer change global bins or install directories after reading only part of an installed package group [#13796](https://github.com/pnpm/pnpm/issues/13796). If any declared package manifest is missing, malformed, or unreadable, pnpm now fails before it activates or removes anything and leaves the existing global installation intact.

- `pnpm dedupe` now processes every workspace project by default, including workspaces that keep a separate lockfile per project [#14732](https://github.com/pnpm/pnpm/issues/14732). Workspace filters select which projects it processes, and `--fail-if-no-match` exits with an error when no project matches.

- `pnpm update <name>@<version>` now keeps the range operator the manifest declares [#14745](https://github.com/pnpm/pnpm/issues/14745). Running `pnpm update react@19.3.0` on `"react": "^19.2.8"` writes `"react": "^19.3.0"`. A `jsr:` entry keeps its `jsr:` prefix, and a plain `pnpm update` now moves a `jsr:` range the way it moves an npm range.

- `pnpm --filter` directory selectors now support `?` wildcards and character classes such as `[ab]`. A `*` or `?` wildcard no longer selects a directory whose name starts with a dot, as on pnpm 11.

- `pnpm deploy --legacy` now prefers the dependency versions pinned in the source workspace lockfile when they still satisfy the deployed project's range [#13857](https://github.com/pnpm/pnpm/issues/13857).

- `pnpm sbom` now leaves out a package's author field when the manifest author name is empty or contains only whitespace [#14685](https://github.com/pnpm/pnpm/issues/14685). In a filtered or split workspace run, only a project with no `author` field inherits the workspace root's author.

  `pnpm sbom --sbom-format spdx` now writes `creationInfo.created` with whole seconds, such as `2026-09-08T10:38:21Z` [#14684](https://github.com/pnpm/pnpm/issues/14684). The fractional seconds it carried were rejected by strict SPDX consumers.

#### Configuration

- The `updateConfig` pnpmfile hook now receives the resolved configuration, including settings that came from `.npmrc`, the command line, or a default [#14676](https://github.com/pnpm/pnpm/issues/14676). Scoped registries are reported under `registriesByScope`, and a hook may rewrite that map to change where packages are fetched from. Registry credentials are reported under `configByUri`, as pnpm 11 reports them. An unset setting is left out rather than reported as `null`.

- `pnpm audit --fix` and the `minimumReleaseAgeStrict` approval prompt now keep the comments in `minimumReleaseAgeExclude` when they append an entry to it in `pnpm-workspace.yaml`. The rest of the list is left as written, and the `trustPolicyExcludePrune` and `minimumReleaseAgeExcludePrune` cleanups keep the comments of the entries they retain.

  `pnpm install` and `pnpm dedupe` now run those cleanups too [#14759](https://github.com/pnpm/pnpm/issues/14759). Only `pnpm add`, `pnpm update`, and `pnpm remove` pruned the entries that the freshly written lockfile no longer resolves.

- `pnpm config set --global node-download-mirrors` no longer rejects the key [#13611](https://github.com/pnpm/pnpm/issues/13611). The global config file already accepted `nodeDownloadMirrors`, but the command refused to write it.

- `NO_PROXY` entries that start with a dot, such as `.npmjs.org`, now bypass the proxy for the domain and its subdomains [#14686](https://github.com/pnpm/pnpm/issues/14686).

- pnpm no longer creates a project `pnpm-lock.yaml` when `devEngines.packageManager.onFail` is `download` and lockfile writing is off through `lockfile: false` or `--no-lockfile` [#14728](https://github.com/pnpm/pnpm/issues/14728). pnpm still switches to the pinned version.

- pnpm now writes `node_modules/.package-map.json` only when `nodeExperimentalPackageMap` is enabled. Nothing reads the file without that setting, and an install that stops writing the map removes the one a previous install left.

#### Windows

- `pnpm pipeline` no longer fails with intermittent access denied errors when concurrent tasks save their cache entries on Windows.

- Windows filesystem operations now retry permission errors for up to one second [#14682](https://github.com/pnpm/pnpm/issues/14682). A permanent permission error delayed the failure by a minute. Sharing and lock violations keep their one minute retry budget.

#### Messages and output

- pnpm now warns when the root `package.json` declares a non-empty `workspaces` array and the project has no `pnpm-workspace.yaml` [#2255](https://github.com/pnpm/pnpm/issues/2255). Such an install linked no project and said nothing about why.

- `ERR_PNPM_PACKAGE_MANAGER_REMOVE_MODULES_DIR` now names the file or directory in `node_modules` that pnpm could not clean up. It reported only the underlying OS error, such as "Access is denied (os error 5)".

- `pnpm --help` no longer describes pnpm as experimental.

## 12.4.0

### Minor Changes

- pnpm can now manage npm, Python, and Cargo dependencies in the same workspace. Enable `python.enabled` or `cargo.enabled` in `pnpm-workspace.yaml`, then use `pnpm install` to install them together.

  - Add Python packages with `pnpm add pypi:<package>`. pnpm uses `pyproject.toml`, `pylock.toml`, and a managed `.venv`. Frozen and offline installs are supported, and `pnpm run` and `pnpm exec` make the environment's executables available [#14566](https://github.com/pnpm/pnpm/issues/14566).
  - Add Rust crates with `pnpm add crate:<package>`. pnpm supports crates.io and custom sparse registries configured with `cargo.indexUrl`. Registry authentication supports pnpm credentials and, for crates.io, `CARGO_REGISTRY_TOKEN` or `$CARGO_HOME/credentials.toml`.

  Both ecosystems support faster dependency resolution through `pnprServer`, with local resolution as a fallback when the server does not support it.

- Added `pnpm pipeline [name]` to install frozen dependencies and run workspace tasks declared in `pipelines`. It selects affected projects, runs their task graph, and continues running tasks after a task fails.

  Tasks support `inputs`, `outputs`, `env`, and `cache` settings. Cached results restore task outputs and replay logs. Cargo tasks can reuse local build state between worktrees with `tasks.<name>.cargoTargetDir`. Set `includeWorkspaceRoot: true` to include root tasks.

  Use `pnpm pipeline --dry-run` to preview the task graph without installing configuration dependencies or running workspace hooks.

- Added support for Android on arm64 and x64, FreeBSD on x64, and Linux on ppc64le, s390x, and RISC-V (riscv64 with glibc) [#14431](https://github.com/pnpm/pnpm/issues/14431), [#14597](https://github.com/pnpm/pnpm/issues/14597), [#7582](https://github.com/pnpm/pnpm/issues/7582).

- Added `trustPolicyExcludePrune` to automatically remove unused versions and packages from `trustPolicyExclude` when running `pnpm add`, `pnpm update`, or `pnpm remove`. It is disabled by default. Package name patterns such as `@scope/*` are kept, and cleanup is skipped when `sharedWorkspaceLockfile` is `false`.

- Added `pnpm change check` for CI validation of package versions against the `versioning.epics` bands and `versioning.fixed` groups in `pnpm-workspace.yaml`. It reports all violations, including packages that are not part of the current release.

### Patch Changes

- Registry metadata is now kept separate for registries with different URL paths or schemes. This prevents installs from using another registry's package versions or tarball URLs, and keeps metadata fetched over HTTP from being reused for HTTPS [#13558](https://github.com/pnpm/pnpm/issues/13558).

  The first install after upgrading refetches registry metadata. The package store is unchanged. `pnpm cache view` now shows full registry URLs. Scripts that parse the directory names from `pnpm cache list-registries` or `pnpm cache list` need updating.

- Patches that add build scripts or a `binding.gyp` now trigger a build, subject to build approval. Unapproved builds appear under "Ignored build scripts" [#14648](https://github.com/pnpm/pnpm/issues/14648).

- Build scripts can now be rejected before installing a package with `pnpm add --allow-build=!<pkg>`, including global installs. `pnpm approve-builds <pkg>` and `pnpm approve-builds !<pkg>` also save decisions when no packages are awaiting approval. They warn if the named package is not awaiting approval [#14067](https://github.com/pnpm/pnpm/issues/14067).

- A registry configured in `.npmrc` now takes precedence over registry settings saved by `pnpm login` in the global `config.yaml`. This fixes installs using the wrong registry after login [#14614](https://github.com/pnpm/pnpm/issues/14614).

- Large downloads over slow connections no longer time out while data is still arriving. `fetch-timeout` now limits how long a request can go without making progress [#14604](https://github.com/pnpm/pnpm/issues/14604).

- Sped up installs in workspaces with many projects when reusing a warm global virtual store [#14540](https://github.com/pnpm/pnpm/issues/14540).

- `pnpm deploy` is faster in large workspaces and no longer fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` when the project includes a `.pnpmfile.mjs` [#14539](https://github.com/pnpm/pnpm/issues/14539), [#14671](https://github.com/pnpm/pnpm/issues/14671).

- `pnpm add --workspace <pkg>` works again. It saves the dependency with the `workspace:` protocol and links it from the workspace. The command fails if no workspace project provides the package [#14602](https://github.com/pnpm/pnpm/issues/14602).

- `pnpm add` and `pnpm install` now accept protocol-prefixed selectors such as `jsr:@scope/pkg`, `npm:pkg@^1.0.0`, and `workspace:pkg@*` [#14590](https://github.com/pnpm/pnpm/issues/14590). Installs with JSR dependencies in the lockfile also no longer fail with `ERR_PNPM_META_FETCH_FAIL` [#14649](https://github.com/pnpm/pnpm/issues/14649).

- Boolean flags now accept explicit inline values. For example, `pnpm install --prod=false` installs devDependencies, while `--prod=true` skips them [#14553](https://github.com/pnpm/pnpm/issues/14553).

- `pnpm install <pkg>` now accepts `--offline` and `--prefer-offline`, as `pnpm add <pkg>` already did [#14194](https://github.com/pnpm/pnpm/pull/14194).

- Fixed `pnpm install --frozen-lockfile` rejecting a freshly generated lockfile when overrides use relative `file:` or `link:` paths in a workspace [#14555](https://github.com/pnpm/pnpm/issues/14555).

- Fixed installs with config dependencies failing on symlinked lockfiles, such as those used by Bazel and Nix, when the config dependencies have not changed. Updates that would write through a symlink remain disallowed. Updating config dependencies also preserves lockfiles that start with a byte order mark [#14372](https://github.com/pnpm/pnpm/issues/14372).

- Fixed package manager version pins being written to the wrong lockfile when `lockfileDir` is set. The pins also remain consistent across commands when version switching is disabled, avoiding unnecessary lockfile changes [#14633](https://github.com/pnpm/pnpm/issues/14633), [#14575](https://github.com/pnpm/pnpm/issues/14575).

- `pnpm import` now respects `lockfileDir` and branch lockfiles without modifying other lockfiles. Failed imports restore the destination lockfile [#14563](https://github.com/pnpm/pnpm/issues/14563).

- `pnpm patch-commit` now produces valid patches when files are added or deleted. `pnpm install` also accepts patches that delete files without listing their contents, and patch files with CRLF line endings [#14559](https://github.com/pnpm/pnpm/issues/14559), [#14557](https://github.com/pnpm/pnpm/issues/14557).

- Fixed version ranges with partial upper bounds. For example, `<=16` now includes all 16.x versions, and `>=0.11 <=3` correctly accepts 3.0.1 [#14419](https://github.com/pnpm/pnpm/issues/14419).

- Workspace package patterns now support `.` and `..` segments and repeated slashes. Patterns such as `./packages/*` and exclusions such as `!./packages/foo` now match correctly [#14571](https://github.com/pnpm/pnpm/issues/14571).

- `packageConfigs` settings now apply to the specified projects when `sharedWorkspaceLockfile` is `false`, including `overrides`, `hoist`, `modulesDir`, `saveExact`, and `savePrefix`. Workspaces with a shared lockfile report which entries were ignored [#14556](https://github.com/pnpm/pnpm/issues/14556).

- `pnpm run` and `pnpm exec` no longer report a changed workspace structure after a successful install when `sharedWorkspaceLockfile` is `false` and `verifyDepsBeforeRun` is enabled [#14588](https://github.com/pnpm/pnpm/issues/14588).

- Commands run from a project's subdirectory now find the nearest ancestor with a manifest. This fixes commands such as `pnpm bin` returning paths under the wrong directory. `pnpm init` still creates its manifest in the current directory, and `pnpm exec` still runs there [#14622](https://github.com/pnpm/pnpm/issues/14622).

- Relative `scriptShell` paths in `pnpm-workspace.yaml` now resolve from the workspace root, including when scripts run in nested packages. Bare command names such as `bash` still use `PATH` [#14422](https://github.com/pnpm/pnpm/issues/14422).

- Fixed installing the pnpm version pinned in `packageManager` when `nodeLinker` is `hoisted`. Managed Node.js, Deno, and Bun installations also work when the global config uses `nodeLinker: hoisted` [#14595](https://github.com/pnpm/pnpm/issues/14595).

- The JavaScript pnpm can again switch to a project's pinned pnpm version on platforms without a native binary for that version, such as Alpine Linux with pnpm 10 or Intel Macs with pnpm 11. If a native pnpm version does not support the platform, the error now names the missing target [#13622](https://github.com/pnpm/pnpm/issues/13622).

- Provisioning Yarn 6 now uses `GH_TOKEN` or `GITHUB_TOKEN` when available to avoid GitHub's anonymous API rate limit in CI. Tokens are only sent when `strict-ssl` is enabled.

- Fixed concurrent installs sharing a global virtual store on macOS failing with "failed to import ... No such file or directory" [#14560](https://github.com/pnpm/pnpm/issues/14560).

- Fixed `pnpm setup` failing with `ERR_PNPM_DIRECTORY_FETCHER_PATH_ESCAPE` on Windows. Local `file:` dependencies whose directories are symlinks or junctions are now packed correctly [#14618](https://github.com/pnpm/pnpm/issues/14618).

- On Windows, installs now retry replacing command shims temporarily locked by another process [#14549](https://github.com/pnpm/pnpm/issues/14549).

- Fixed argument forwarding on Windows with `shellEmulator` enabled. Paths ending in a backslash, line breaks, and literal shell expressions are preserved [#14548](https://github.com/pnpm/pnpm/issues/14548).

- Windows store paths now consistently use backslashes in `pnpm store path` output and in the `storeDir` and `virtualStoreDir` fields of `node_modules/.modules.yaml`.

- Invalid certificates in `ca` or `cafile` no longer cause an `Invalid CA certificate` error. Valid certificates still apply, and blank `cert` or `key` values are treated as unset [#14646](https://github.com/pnpm/pnpm/issues/14646).

- Installs now respect the archive extraction concurrency limit even after a download is abandoned [#14585](https://github.com/pnpm/pnpm/issues/14585).

- `pnpm audit` summaries now exclude advisories ignored through `auditConfig.ignoreGhsas` and report them separately. When all advisories are ignored, the summary says so [#14535](https://github.com/pnpm/pnpm/issues/14535).

- `pnpm pack --json` now reports errors as JSON. Lifecycle script output appears before the final JSON output.

- `pnpm outdated -r` now wraps the `Dependents` column, keeping the table readable when many workspace projects use the same dependency [#14591](https://github.com/pnpm/pnpm/issues/14591).

- Shell completions now support the `pn` alias in bash, fish, pwsh, and zsh [#11955](https://github.com/pnpm/pnpm/issues/11955).

- `pnpm version` now accepts `-m` as a short alias for `--message` [#14567](https://github.com/pnpm/pnpm/issues/14567).

## 12.3.4

### Patch Changes

- Sped up dependency resolution in large workspaces [#14352](https://github.com/pnpm/pnpm/issues/14352).

- pnpm 12 now accepts the boolean settings as command-line flags on every command that takes them in pnpm 11, for example `pnpm install --unsafe-perm`, `pnpm add foo --offline`, and `pnpm install --dangerously-allow-all-builds`. pnpm 12 rejected them with `unexpected argument`, which failed every install on Vercel, whose build runs `pnpm install --unsafe-perm` [#14346](https://github.com/pnpm/pnpm/issues/14346).

  `pnpm remove` now accepts `--unsafe-perm`, the same flag `pnpm install`, `pnpm add`, and `pnpm update` take.

## 12.3.3

### Patch Changes

- Fixed concurrent installs sharing a store occasionally failing with an ENOENT error while importing a package file [#14353](https://github.com/pnpm/pnpm/issues/14353).

- Sped up writing the lockfile in large workspaces [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Sped up dependency resolution in large workspaces [#14352](https://github.com/pnpm/pnpm/issues/14352).

- pnpm now runs through Node.js when it was installed by a tool that skips build scripts, such as Vercel's `packageManager` provisioning, Bun, Deno, or `npm install --ignore-scripts`. Those installs previously failed with `syntax error near unexpected token ')'`. They still cannot run pnpm on Windows. On macOS only a shell can start it [#14346](https://github.com/pnpm/pnpm/issues/14346).

## 12.3.2

### Patch Changes

- `pnpm audit --fix update` no longer aborts when a vulnerable package has no safe version inside its declared range [#14508](https://github.com/pnpm/pnpm/issues/14508). The run updates every package it can and lists the rest as remaining.

- `pnpm install` no longer reruns root lifecycle scripts when the global virtual store contains an unfinished-build marker in a package slot that the current lockfile does not use [pnpm/pnpm#14485](https://github.com/pnpm/pnpm/issues/14485).

- Sped up installs that have no lockfile. pnpm now links packages whose dependency subtree has no peer dependencies into the virtual store while resolution is still running.

- `pnpm run` and `pnpm exec` now start without reinstalling on filesystems that keep sub-millisecond mtimes, such as NTFS. Previously, every run on those filesystems reinstalled first [pnpm/pnpm#14486](https://github.com/pnpm/pnpm/issues/14486).

- `pnpm import` now keeps the versions recorded in `package-lock.json`, `npm-shrinkwrap.json`, or `yarn.lock` when it generates `pnpm-lock.yaml`. A range in `package.json`, a catalog, or an override still decides which versions are eligible, and the recorded version is preferred among them. The generated lockfile previously could pin newer versions than the source lockfile [#14476](https://github.com/pnpm/pnpm/issues/14476).

  `pnpm import` in a workspace now imports every workspace project into the shared lockfile. It previously imported only the project in the current directory.

  `pnpm import` now fails with `ERR_PNPM_LOCKFILE_NOT_FOUND` when none of the three source lockfiles is present. It also fails with `ERR_PNPM_YARN_LOCKFILE_PARSE_FAILED` when it cannot parse `yarn.lock`. It previously generated a lockfile from scratch in both cases.

  `pnpm import` always resolves locally. It warns when `--pnpr-server` or the `pnpr-server` setting is given and does not use the server.

- Sped up installs in large workspaces. Discovering the workspace projects no longer enumerates every matched directory to learn which manifest files it holds [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Sped up installs in large workspaces. The resolver and the peer pass allocate less for every dependency edge [#14352](https://github.com/pnpm/pnpm/issues/14352).

- `pnpm self-update`, `pnpm with`, and automatic package-manager version switching no longer wait through registry retry delays when a configured registry has no signatures and `registry.npmjs.org` is unavailable [#14483](https://github.com/pnpm/pnpm/issues/14483).

- Sped up installs in large workspaces. Saving the lockfile is faster, and the install finishes without waiting for memory cleanup [#14352](https://github.com/pnpm/pnpm/issues/14352).

- `pnpm install` now relinks workspace packages when `publishConfig.linkDirectory` changes. Frozen installs report an outdated lockfile until it is regenerated [pnpm/pnpm#14488](https://github.com/pnpm/pnpm/issues/14488).

- The pnpm npm wrapper keeps its placeholder shebang-less so pnpm 11 can install pnpm 12 through the version store. Wrapper installs must allow lifecycle scripts to install the native binary [#14502](https://github.com/pnpm/pnpm/issues/14502).

- Sped up dependency resolution when there is no lockfile, and for the dependencies a lockfile does not cover.

- Sped up installs in large workspaces. Workspace `link:` targets and importer ids are now derived from the paths' suffixes under the workspace root [#14352](https://github.com/pnpm/pnpm/issues/14352).

- `pnpm install` now reports "Already up to date" when local tarball dependencies have not changed [#14495](https://github.com/pnpm/pnpm/issues/14495).

- `pnpm update` now accepts `--ignore-scripts` and skips lifecycle scripts during the update [pnpm/pnpm#14512](https://github.com/pnpm/pnpm/issues/14512).

- Sped up installs that restore a deleted `node_modules` from a warm global virtual store. pnpm no longer re-links packages that are already fully present in the global virtual store [#14510](https://github.com/pnpm/pnpm/issues/14510).

## 12.3.1

### Patch Changes

- Sped up installs in large workspaces: the anchor for re-rendering workspace `link:` targets is now derived once per project instead of once per dependency edge, and project ordering hashes paths by their raw bytes [#14352](https://github.com/pnpm/pnpm/issues/14352).

- After a self-update from pnpm 12.2 to 12.3, global commands such as `node`, `npm`, and `yarn` failed with `unexpected argument '--shim' found`. Global commands now launch normally, and their first launch migrates the global bin directory to native shims. When self-update downgrades to pnpm 12.2 or older, it keeps the newer native shims so those commands continue to work.

- Sped up installs in large workspaces. The check that verifies each project against the lockfile now runs the projects in parallel [#14352](https://github.com/pnpm/pnpm/issues/14352).

## 12.3.0

### Minor Changes

- Every context-aware global command (`node`, `deno`, `bun`, and the shims created with `pnpm shim add`) is now a native executable on every platform, so environment variables whose names are not valid shell identifiers reach these commands. On Windows, `<name>.exe` replaces the `.cmd` and `.ps1` shims for them. Shims written by earlier pnpm 12 releases are migrated on the next global install or self-update.

- `pnpm remove` and `pnpm update` now accept `--trust-lockfile`, `--no-trust-lockfile`, `--trust-policy`, `--trust-policy-exclude` and `--trust-policy-ignore-after`, the same flags `pnpm install` and `pnpm add` take, so the supply-chain settings can be overridden for a single run. `pnpm remove` verifies the lockfile against the active policies the way `pnpm install` does, and `--trust-lockfile` skips that pass for every entry, not only the package being removed.

  `pnpm` now also honors `--config.trust-lockfile=<value>`, and accepts the bare `--trust-lockfile` / `--no-trust-lockfile` spelling on the commands that previously took the setting from the config file alone.

### Patch Changes

- `pnpm add <local directory>`, `pnpm add <local tarball>`, `pnpm add file:<path>` and `pnpm add <tarball URL>` work again. A specifier given without a `<name>@` prefix is no longer read as a registry package name and rejected with `ERR_PNPM_PACKAGE_MANAGER_ADD_RESOLVE_LATEST` [#14437](https://github.com/pnpm/pnpm/issues/14437).

- Fixed `pnpm deploy --legacy` ignoring `allowUnusedPatches` supplied through `--config.allow-unused-patches` or the `PNPM_CONFIG_ALLOW_UNUSED_PATCHES` environment variable [pnpm/pnpm#14450](https://github.com/pnpm/pnpm/issues/14450).

- Fixed `pnpm install --lockfile-only` writing a lockfile that referenced a missing peer-suffixed snapshot when an npm-aliased dependency took part in a cyclic peer dependency graph. The following `pnpm install --frozen-lockfile` failed with `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY` [#14449](https://github.com/pnpm/pnpm/issues/14449).

- `pnpm config` now accepts `-g`/`--global`, `--location`, and `--json` before its subcommand [pnpm/pnpm#14421](https://github.com/pnpm/pnpm/issues/14421).

- `pnpm dedupe` now converges in one pass when it re-resolves a lockfile created by pnpm 11, so a second run no longer changes the lockfile [#14455](https://github.com/pnpm/pnpm/issues/14455).

- Fixed detached child processes being terminated on Windows when another program launches `pnpm` directly, without a shell, as `nr` from `@antfu/ni` does [#14447](https://github.com/pnpm/pnpm/issues/14447).

- Fixed `pnpm docs <package>@<version>` ignoring the requested version. It now opens the selected version's homepage and reports a missing version instead of opening the package-level homepage [pnpm/pnpm#14428](https://github.com/pnpm/pnpm/issues/14428).

- Sped up installs in large workspaces. `pnpm-lock.yaml` is now read while the workspace projects are being discovered [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Fixed filtered and recursive `pnpm run` and `pnpm exec` hanging when a script reads from the terminal. Interactive prompts work again in a script that pnpm never runs alongside another one, such as a single `--filter`ed project, `--workspace-concurrency=1`, a dependency chain, or a task declaring `concurrency: 1` [#14397](https://github.com/pnpm/pnpm/issues/14397).

- Fixed false unmet peer errors for auto-installed peers in linked workspace packages.

- Fixed npm global installs on Windows so the PowerShell shims invoke `pnpm.exe`.

- Fixed `pnpm with current <command>` when global options precede it, such as `pnpm --workspace-root with current --version` [pnpm/pnpm#14413](https://github.com/pnpm/pnpm/issues/14413).

  A short-option cluster that mixes a global flag with an option owned by the command, such as `pnpm -ro dist pack-app`, is now parsed like the same options written after the command.

  An option written before the command name is now reported as an unknown option unless that command accepts it, instead of being taken for the command to run. `pnpm -P exec echo` and `pnpm -z exec echo` fail the way `pnpm --tag next exec echo` does.

- Apply pure insertions in zero-context patches at the correct line instead of one line early.

- Improved peer dependency resolution performance when many packages reuse the same peer ranges.

- `pnpm outdated` and `pnpm update` now follow local actions and reusable workflows referenced with GitHub's self-repository syntax (`uses: $/.github/actions/setup`) when looking for outdated GitHub Actions, the same way they follow `./` references.

- The `pnpm install --help` descriptions of `--prod` and `--dev` no longer claim that the flags take precedence over `NODE_ENV`. pnpm does not read `NODE_ENV` when selecting which dependency groups to install [#14445](https://github.com/pnpm/pnpm/issues/14445).

- Sped up installs in large workspaces. The check that decides whether the lockfile needs updating no longer compares every project against every lockfile entry [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Sped up dependency resolution in large workspaces that use `link:` dependencies [#14352](https://github.com/pnpm/pnpm/issues/14352).

- On Linux, pnpm now resolves registry hostnames through the system resolver (`getaddrinfo`), as it already does on macOS and Windows and as pnpm 11 did. Previously, an `/etc/resolv.conf` containing an option the bundled pure-Rust resolver did not recognize, such as `options no_tld_query`, made pnpm ignore the configured nameservers and silently query Google's public DNS instead [#14469](https://github.com/pnpm/pnpm/issues/14469).

- Sped up dependency resolution in large workspaces. The resolver builds fewer lookup keys for each dependency [#14352](https://github.com/pnpm/pnpm/issues/14352).

- `catalogMode` and `--save-catalog` no longer move a local path, tarball, or `workspace:<path>` specifier into a catalog. Such a specifier is resolved against the project that declares it, so one catalog entry cannot mean the same directory for every project that references it [#14437](https://github.com/pnpm/pnpm/issues/14437).

- Sped up installs in large workspaces. The workspace dependency graph is now built once per run instead of twice [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Sped up writing `pnpm-lock.yaml` in large workspaces [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Fixed non-frozen installs through a pnpr server failing instead of regenerating a conflicted lockfile.

- `pnpm update --interactive` renders its checklist the way pnpm 11 does. Group headings and column headers are separators the cursor skips instead of checkboxes that select nothing. The columns of one group line up with the next. `a` toggles all and `i` inverts the selection. The confirmed selection is echoed as a list of package names [#14423](https://github.com/pnpm/pnpm/issues/14423).

- Fixed `pnpm config` commands targeting global configuration to skip project package manager version switching, allowing registry authentication to be configured before pnpm downloads a project-pinned version [pnpm/pnpm#14463](https://github.com/pnpm/pnpm/issues/14463).

- Fixed pnpm retaining the surrounding quotes in `.npmrc` values, including auth tokens expanded from environment variables. This restores authentication with registries configured using `:_authToken="${TOKEN}"` [pnpm/pnpm#14427](https://github.com/pnpm/pnpm/issues/14427).

- Fetch and tarball errors no longer print the secrets of the URL they name. Inline `user:pass@` credentials and the query string or fragment of a signed URL are hidden, so a failed install or `pnpm add <url>` cannot leak them into terminal scrollback or CI logs.

- When `dist-tags.latest` names a version whose manifest pnpm cannot read, the error now names that version and the field it could not decode, instead of reporting the tag as empty.

- Retry transient Windows file-lock errors, including sharing violations, while linking dependencies with the default (isolated) `nodeLinker`. This fixes [pnpm/pnpm#14407](https://github.com/pnpm/pnpm/issues/14407).

- `pnpm run`, `pnpm exec`, `pnpm rebuild`, and the script shortcuts such as `pnpm test` now load the pnpmfile, so `updateConfig` hook settings such as `extraEnv` and `extraBinPaths` reach the scripts they spawn [#14433](https://github.com/pnpm/pnpm/issues/14433).

- The `pnpm` executable of the npm package now works when the package was installed without running its install scripts, as under `--ignore-scripts` or the default build-script block of pnpm and Bun [#14346](https://github.com/pnpm/pnpm/issues/14346). In that case it runs through Node.js and, in a terminal, says how to switch to the native binary.

- Sped up installs in large workspaces. The resolver no longer copies the whole lockfile before resolving [#14352](https://github.com/pnpm/pnpm/issues/14352).

- `minimumReleaseAgeStrict` now defaults to `true` when `minimumReleaseAge` is explicitly configured, whether in `pnpm-workspace.yaml`, the global `config.yaml`, a `PNPM_CONFIG_*` variable, or a CLI flag. The built-in 1440-minute default stays non-strict. Previously an explicit cutoff was treated as non-strict, so immature versions were silently added to `minimumReleaseAgeExclude` instead of being gated with a prompt [#14409](https://github.com/pnpm/pnpm/issues/14409).

- Preserve environment variables whose names are not valid shell identifiers when launching Node.js installed by `pnpm runtime set node --global` on Unix [pnpm/pnpm#14417](https://github.com/pnpm/pnpm/issues/14417).

- Fixed `pnpm repo` and `pnpm docs` failing to open the Windows browser from WSL [pnpm/pnpm#14467](https://github.com/pnpm/pnpm/issues/14467).

- `pnpm link`, `pnpm outdated`, and `pnpm import` now apply pnpmfile `updateConfig` hooks before resolving dependencies.

- Fixed standalone installations to preserve the bundled `node-gyp` files used to build native dependencies.

- Fixed resolution against registries whose version manifests carry `_npmUser`, `dist.attestations`, `dist.unpackedSize`, `dist.fileCount`, or `peerDependenciesMeta` in a shape npm does not use. Such a version was skipped as though it had never been published, so `pnpm add` could fail with "no version found for the latest tag" even though the registry served it.

- `pnpm unpublish` now completes the two-factor authentication a registry asks for instead of failing with `ERR_PNPM_UNAUTHORIZED` while logged in. A 401 that is an OTP challenge starts the web-based authentication flow, or prompts for a classic one-time password. The obtained password is reused by every request of the run [#14464](https://github.com/pnpm/pnpm/issues/14464).

- On Windows, pnpm now resolves host names through the system resolver instead of its own DNS client. The built-in client bound a UDP socket for every lookup, which made Windows Defender Firewall ask to allow `pnpm.exe` again after every `pnpm self-update` [#14405](https://github.com/pnpm/pnpm/issues/14405).

## 12.2.1

### Patch Changes

- Restored the `pnpm` executable target without a file extension so pnpm 12.1 and earlier can upgrade to newer pnpm 12 releases on POSIX systems.

## 12.2.0

### Minor Changes

- Catalogs can now resolve workspace dependencies through the `workspace:` protocol.

### Patch Changes

- Fixed `pnpm audit --fix` failing with `ERR_PNPM_INVALID_FIX_OPTION` when used without a value, including when another flag follows it, as in `pnpm audit --fix --json` [#13261](https://github.com/pnpm/pnpm/issues/13261). Fixed `pnpm audit --fix=override` ignoring the `saveExact` and `savePrefix` settings when writing vulnerability overrides [#11523](https://github.com/pnpm/pnpm/issues/11523).

- Authenticate Node.js runtime downloads from `nodeDownloadMirrors` with URL-scoped npm registry credentials, including bearer tokens, basic auth, and `tokenHelper` [pnpm/pnpm#14334](https://github.com/pnpm/pnpm/issues/14334).

- Fixed detached child processes being terminated after successful commands on Windows.

- Sped up installs in large workspaces by resolving each named `workspace:` dependency (`workspace:*`, `workspace:^`, `workspace:1.2.3`) once and reusing it across every project that declares it, instead of re-resolving it per project.

- Fixed `pnpm install --fix-lockfile` to derive its repair and filtered-merge views from one lockfile snapshot.

- Load pnpmfile `updateConfig` hooks before packing so hook-provided catalogs resolve in `pnpm pack`, `pnpm publish`, and `pnpm stage publish` [pnpm/pnpm#14377](https://github.com/pnpm/pnpm/issues/14377).

- `pnpm deploy` no longer requires `injectWorkspacePackages` to be enabled. A linked workspace dependency is rewritten to a `file:` dependency in the dedicated deploy lockfile, and the peer dependencies it declares are bound to the deployed graph's own resolution.

  When a peer resolves to more than one version in that graph the binding is ambiguous, and choosing between the candidates is exactly what injecting the package would have decided, so the deploy still fails — now with `ERR_PNPM_DEPLOY_AMBIGUOUS_PEER`, which names the package, the peer, and the competing versions, instead of refusing every non-injected workspace up front, and suggests pinning the peer to one version with an `overrides` entry as the way to keep deploying without injection [#9386](https://github.com/pnpm/pnpm/issues/9386).

- Fixed global virtual store hashes for dependency cycles. Every package that transitively depends on an allowed build now includes the engine in its store path, independent of traversal order [pnpm/pnpm#14341](https://github.com/pnpm/pnpm/issues/14341).

- Fixed `ERR_PNPM_CMD_SHIM_CHMOD` when several installs run at once against a shared global virtual store. One install could remove a command shim while another was making it executable ([pnpm/pnpm#14353](https://github.com/pnpm/pnpm/issues/14353)).

- Fixed the PowerShell shim generated by `npm install -g pnpm` on Windows so it invokes the native `pnpm.exe` binary [pnpm/pnpm#14362](https://github.com/pnpm/pnpm/issues/14362).

- Fixed context-aware global shims on WSL2 so native Linux installations dispatch through the project runtime.

- `pnpm install` no longer writes global `minimumReleaseAgeExclude` entries to the project's `pnpm-workspace.yaml` [pnpm/pnpm#14347](https://github.com/pnpm/pnpm/issues/14347).

- Fixed `catalog:` ranges in workspace package peer dependencies being reported as unmet [pnpm/pnpm#14361](https://github.com/pnpm/pnpm/issues/14361).

- `globalDir` and `globalBinDir` are honored wherever they are set, so `pnpm add -g` no longer fails with `ERR_PNPM_GLOBAL_BIN_DIR_NOT_IN_PATH` after `pnpm config set -g global-bin-dir` [#14336](https://github.com/pnpm/pnpm/issues/14336). The global `config.yaml` is read again, `PNPM_CONFIG_GLOBAL_DIR` / `PNPM_CONFIG_GLOBAL_BIN_DIR` reach the directories derived from them, and a leading `~/` is expanded before that derivation. A project's `pnpm-workspace.yaml` still cannot set either key.

- Fixed the install progress line reporting `added 0` under `nodeLinker: hoisted`, even when packages were linked into `node_modules` [#14348](https://github.com/pnpm/pnpm/issues/14348).

- An auto-installed optional peer is now resolved to a version its declared peer range accepts, even when the workspace root depends on that package at a version outside the range. Previously the root's version was used and then reported as an unmet optional peer [#13867](https://github.com/pnpm/pnpm/issues/13867).

- Fixed `pnpm run "/pattern/"` running matching scripts one at a time in a single project. Matching scripts now run concurrently up to `workspaceConcurrency`, and their output is prefixed so concurrent lines remain distinguishable [pnpm discussion 14357](https://github.com/orgs/pnpm/discussions/14357).

- Fixed a slowdown at the end of a resolving install in a large workspace. The peer-dependency report now inspects only the projects the resolution flagged, rather than every project in the lockfile ([pnpm/pnpm#14359](https://github.com/pnpm/pnpm/issues/14359)).

- Speed up workspace discovery for literal directories and conventional trailing-star patterns.

  Workspace patterns now follow the same dot-directory rule as pnpm 11: a wildcard no longer matches a dot-prefixed directory, so `packages/*` and `**` skip `packages/.cache` and `.git`. A pattern that names a dot-prefixed directory still matches it, as `packages/.cache` and `packages/.*` do.

- `pnpm audit` now ends its output with a trailing newline, including the `--json`, `--fix`, and `--ignore` output.

- Retry transient Windows file-lock errors while replacing hoisted packages during installation.
  This fixes [pnpm/pnpm#14349](https://github.com/pnpm/pnpm/issues/14349).

- Fixed command-line `--side-effects-cache` overrides being ignored when `pnpm-workspace.yaml` uses the object form of `sideEffectsCache` [pnpm/pnpm#14338](https://github.com/pnpm/pnpm/issues/14338).

- Speed up workspace project discovery in large monorepos: workspace patterns are now probed concurrently and the discovered projects' `package.json` files are read in parallel [#14352](https://github.com/pnpm/pnpm/issues/14352).

- Fixed repeated `pnpm dedupe` runs alternating between peer resolutions when a peer is provided through an npm alias.

- Fixed `pnpm repo <package>` and `pnpm docs <package>` resolving bare package names through the `latest` tag, and prevented malformed package ranges from crashing registry selection.

- Fixed non-ASCII characters in configuration values being mangled during environment-variable substitution. Paths such as `storeDir: ./café-store` are now preserved [#14383](https://github.com/pnpm/pnpm/issues/14383).

## 12.1.0

### Minor Changes

- `pnpm login` and `pnpm adduser` now record the granted token in the global `config.yaml`, under the `_auth` setting, with `--scope`'s scope routed to that registry under `registries`. `pnpm logout` removes it from there, and still from an `auth.ini` an earlier version wrote. Tokens already in `auth.ini` keep working.

- A `scope` set in a project's `pnpm-workspace.yaml` is now ignored, with a warning naming where to set it instead. `pnpm login` records the scope as a `@scope:registry` route in the machine-global `auth.ini`, which outranks `~/.npmrc` in every project — so a repository-committed file could redirect a scope such as `@acme` for all of a user's other projects after one routine login. Use `--scope`, the `PNPM_CONFIG_SCOPE` environment variable, or the global config file instead [#13557](https://github.com/pnpm/pnpm/issues/13557).

- Verified remote build artifacts are persisted in the shared store with their signed origin metadata. Later installs reverify the artifact against current trust, policy, platform, and source before reuse, while invalid remote variants are quarantined per channel ([pnpm/pnpm#13771](https://github.com/pnpm/pnpm/issues/13771)).

- Persist completed recursive tasks so `--resume-from` skips exactly the work that passed during a matching interrupted or failed `pnpm -r run` / `pnpm -r exec` invocation. When no compatible state exists, pnpm retains its graph-based resume behavior.

- Workspace install, rebuild, pack, publish, stage, and lifecycle work now starts as soon as its dependencies finish instead of waiting for an unrelated topological group.

- Added per-task concurrency limits to workspace task orchestration. Set `tasks.<name>.concurrency` in `pnpm-workspace.yaml` to limit how many instances of that task may run across workspace projects at once:

  ```yaml
  tasks:
    build:
      concurrency: 2
  ```

- `sideEffectsCache` now declares the whole of how a package's build output is reused — whether one is restored, whether one is saved, and the remote tier that shares it between machines:

  ```yaml
  sideEffectsCache:
    read: true
    write: true
    remote:
      org: acme
      packages: ['native-addon']
  ```

  `sideEffectsCache: true`, `sideEffectsCacheReadonly`, `remoteSideEffectsCache`, and its `organization` field all keep working. Where a field is set under both spellings the one above wins; where it is set under only one, it is kept.

  Two behaviors change, both bringing this CLI in line with what the Rust one already did: `sideEffectsCacheReadonly: true` now blocks writing to the cache, and setting it alongside `sideEffectsCache: false` gives a read-only view rather than switching the cache off entirely. A cache can also be declared write-only now, to populate one the run does not read.

- Workspace task orchestration ([pnpm/rfcs#23](https://github.com/pnpm/rfcs/pull/23)). `pnpm -r run` and `pnpm -r exec` now schedule per task instead of in topological chunks: a task starts as soon as the tasks it depends on have finished, so a project no longer waits for unrelated projects that happen to share its chunk.

  A new `tasks` section in `pnpm-workspace.yaml` declares what a task depends on, using the `^` convention:

  ```yaml
  tasks:
    build:
      dependsOn: ['^build']
    test:
      dependsOn: ['build']
    lint: {}
  ```

  `^name` means the named task in each of the project's workspace dependencies; a bare `name` means the task in the same project; an entry with no `dependsOn` declares an empty dependency list. A task with no entry behaves as `dependsOn: ['^<its own name>']`, which is exactly what the previous chunked ordering implied — an unconfigured workspace gets the scheduler improvement and nothing else changes meaning. A project without the script is reported skipped and passes its edges through to its own dependencies, so a scriptless package does not sever a chain.

  Also part of this change:

  - A dependency cycle among the tasks of a run is now an error naming the participating tasks (`ERR_PNPM_TASK_CYCLE`) instead of silently running in an arbitrary order. Setting `ignoreWorkspaceCycles: true` downgrades the error to a warning: the cycle's tasks run in an arbitrary order relative to each other.
  - `--resume-from` now skips exactly the transitive dependencies of the anchor package; work unrelated to the anchor still runs.
  - Under `--no-bail`, tasks whose dependencies failed are reported as skipped, not failed, and do not add to the exit code.
  - With `--bail` (the default), the first failure still ends the run at once and nothing new is dispatched — including scripts already queued behind the concurrency limit.
  - `pnpm -r run --dry-run <script>` prints the task graph that would execute without running anything (including skipping the `verifyDepsBeforeRun` check); `--json` emits the tasks and their resolved dependency edges.
  - Output is inherited rather than piped only when at most one script can ever be in flight (`--workspace-concurrency=1`, or the graph forces the scripts to run one after another).

- Added macOS and Windows x64 and arm64 support to remote shared build artifacts [pnpm/pnpm#13771](https://github.com/pnpm/pnpm/issues/13771).

- Generalized the experimental shared-artifact protocol so candidates and signed payloads identify a discriminated subject. Dependency side effects use package and source-integrity subjects, while workspace tasks use project and task subjects.

  This changes shared-artifact request bodies and signed payloads. A pnpr server and its clients have to be on matching versions.

### Patch Changes

- An `_auth` entry in the global config file no longer decides which registry packages come from when something else says. A `registry` or `registries` declared in `pnpm-workspace.yaml` or the global config now wins over the route inferred from a stored credential, which still applies where nothing else declares one. The `pnpm_config__auth` environment variable is unchanged: it stays the way to point a CI runner at a mandated proxy, and still overrides what a repository declares.

- Fixed `pnpm deploy --legacy` to exclude dependencies that are only reachable from unselected workspace projects after `pnpm fetch`.

- Fixed dependency-verification install logs corrupting `pnpm exec` output and ignoring `--silent` [pnpm/pnpm#14197](https://github.com/pnpm/pnpm/issues/14197).

- `pnpm clean` / `pnpm purge` run from a workspace subdirectory now remove each project's own `node_modules` instead of emptying the workspace root's for every project [#14239](https://github.com/pnpm/pnpm/issues/14239). A custom `modulesDir` is resolved against each project directory too.

- `pnpm dlx <pkg>@catalog:` now resolves the specifier through the calling workspace's catalogs instead of failing with `ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC` [#14294](https://github.com/pnpm/pnpm/issues/14294).

- Fixed `pnpm doctor` reporting a version that does not match `pnpm --version` [pnpm/pnpm#14225](https://github.com/pnpm/pnpm/issues/14225).

- Pacquet now strips exactly one leading path component from `./`-prefixed tarball entries, matching pnpm and npm's tar extraction semantics and keeping shared store keys consistent.

- Installs whose lockfile carries platform or engine constraints are up to ~150 ms faster when resolution runs: the `node --version` probe behind the installability checks now starts before the lockfile is parsed and finishes while dependencies resolve, instead of running afterwards.

- Treat empty scripts selected by a regular expression as missing before running dependent tasks.

- Filter hidden scripts matched by a regular expression during recursive runs when a visible script also matches.

- Fixed `.mjs` pnpmfile hooks failing to load on Windows, including hooks supplied by config dependencies [pnpm/pnpm#14301](https://github.com/pnpm/pnpm/issues/14301).

- Fixed automatically switched pnpm versions forcing all descendant pnpm processes to use the same version [pnpm/pnpm#14309](https://github.com/pnpm/pnpm/issues/14309).

- Fixed `pnpm deploy --prod` failing when an excluded dev dependency was also declared as an optional peer dependency [pnpm/pnpm#14302](https://github.com/pnpm/pnpm/issues/14302).

- Fixed `pnpm pack` to respect the `files` field when deciding whether to include root-level changelog, history, and notice files.

- `pnpm update -g` no longer downgrades a global package. `--latest` resolves the `latest` dist-tag, which can point at an older release than the one installed — after `pnpm add -g <pkg>@next`, for instance [#14270](https://github.com/pnpm/pnpm/issues/14270).

  `pnpm update -g` also no longer changes the pnpm version. pnpm's own global install belongs to `pnpm self-update` [#14270](https://github.com/pnpm/pnpm/issues/14270).

- When multiple versions of the same package expose the same binary, pnpm now links the binary from the highest version [#14249](https://github.com/pnpm/pnpm/issues/14249).

- `pnpm update` no longer replaces the specifier a project declares for a dependency that is also listed in `overrides`. A `catalog:` reference stays a `catalog:` reference, and a declared range stays as written, instead of being rewritten to the version the override resolved to [#12115](https://github.com/pnpm/pnpm/issues/12115).

- `pnpm update` no longer moves the range a project declares for a dependency that `overrides` also lists, even when the override repeats that range verbatim. Previously the updated `package.json` disagreed with the lockfile, so the next `pnpm install --frozen-lockfile` failed with a specifier mismatch [#14224](https://github.com/pnpm/pnpm/issues/14224).

- Allowed pnpm's shared-artifact client to connect to an artifact-only pnpr tier.

- Rebuilding `node_modules` from an up-to-date lockfile is up to ~200 ms faster: the `node --version` probe that installability checks and store keying need now runs concurrently with the store's warm-cache reads instead of before them.

- Remove the duplicate colon from the one-time password prompt.

- Print errors as JSON on stdout when `--json` is passed to `pnpm view` or its aliases (`info`, `show`, and `v`).

- Installs complete faster on workspaces with many projects: each project's `node_modules` is now linked concurrently.

- Fixed `patchedDependencies` matching for git-hosted dependencies during fresh and frozen installs [pnpm/pnpm#14273](https://github.com/pnpm/pnpm/issues/14273).

- `pnpm pm <command>` works again: the `pm` prefix, which forces pnpm's built-in command over a `package.json` script of the same name, is recognized instead of failing with `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL` / `Command "pm" not found`. `pnpm pm clean` and `pnpm pm purge` now remove `node_modules` even when the project (or the workspace root) declares a `clean` / `purge` script [#14226](https://github.com/pnpm/pnpm/issues/14226).

- The settings that pnpm accepts as command-line flags are recognized again: `--package-import-method`, `--hoist-pattern`, `--public-hoist-pattern`, `--no-hoist`, `--global-dir`, `--virtual-store-dir`, `--modules-dir`, `--child-concurrency`, `--no-lockfile`, `--strict-peer-dependencies`, `--side-effects-cache`, `--side-effects-cache-readonly`, `--trust-policy`, `--trust-policy-exclude`, `--trust-policy-ignore-after`, and `--optimistic-repeat-install`. Each is accepted anywhere on the command line, spelled either `--setting=value` or `--setting value`, and overrides the same setting read from `pnpm-workspace.yaml` or `.npmrc` [#14281](https://github.com/pnpm/pnpm/issues/14281).

- `pnpm add`, `pnpm update`, and `pnpm remove` now save `package.json` before failing with `ERR_PNPM_IGNORED_BUILDS`. The dependency they were asked to change is already materialized by that point, so the manifest has to record it — otherwise the next install removes the packages again.

- The progress output no longer overwrites the lines above it once it grows taller than the terminal window [#14270](https://github.com/pnpm/pnpm/issues/14270).

- Restoring a dependency's build from the remote side-effects cache no longer downloads files the store already holds.

- Recognize `pnpm install --fix-lockfile`, including filtered installs, and regenerate broken lockfile metadata while preserving compatible locked versions [pnpm/pnpm#14250](https://github.com/pnpm/pnpm/issues/14250).

- Fixed intermittent `Access is denied` failures when concurrent global commands hand off the global bin lock on Windows.

- Fixed the `--shamefully-hoist` CLI option being rejected [pnpm/pnpm#14235](https://github.com/pnpm/pnpm/issues/14235).

- The environment variables for the remote side-effects cache are named for the setting they configure: `PNPM_SIDE_EFFECTS_CACHE_REMOTE_KEY_ID`, `..._BUILDER_ID`, `..._IMAGE_DIGEST`, `..._ARCHITECTURE_BASELINE`, `..._PRIVATE_KEY`, `..._BUILD_ENV`, `..._TRUSTED_KEYS` and `..._PUBLISH`. The `PNPM_REMOTE_SIDE_EFFECTS_CACHE_*` names keep working, and the new one wins when both are set.

- Installs that run no build scripts finish faster, especially in workspaces with many projects.

- A `devEngines.packageManager` range pin on pnpm is now recorded in `pnpm-lock.yaml`'s `packageManagerDependencies` when the running pnpm already satisfies it, using the running version and keeping the range as the recorded specifier. Previously only an exact pin — or a range resolved on the way through a version switch — reached the lockfile, so a range pin written by hand (or by any tool other than `pnpm add` / `pnpm self-update`) left the project without the shared resolution the pin exists to provide.

- Workspace installs are substantially faster (~0.7 s on a 60-project workspace): after hoisting, pnpm now shims only the bins of publicly hoisted workspace packages instead of re-walking every project's `node_modules` to rediscover bins that were already linked.

- Fixed a large install-time regression on macOS for installs that rebuild `node_modules` from a warm store [#14231](https://github.com/pnpm/pnpm/issues/14231). APFS serializes file-cloning and hard-linking syscalls volume-wide, so importing packages one file at a time from many threads was bounded by a per-volume ceiling and got slower the more CPU cores the machine had. On macOS, `pnpm install` now materializes each package once into the store's `links` directory (the same canonical slots `enableGlobalVirtualStore` uses) and copies it into `node_modules/.pnpm` with a single copy-on-write directory clone per package, replacing tens of thousands of per-file syscalls with one per package. Applies with the default `nodeLinker: isolated` when `enableGlobalVirtualStore` is off and `packageImportMethod` is `auto`, `clone`, or `clone-or-copy`; hoisted, global-virtual-store, and explicit `hardlink`/`copy` installs are unchanged.

- Stop in-flight recursive `run` and `exec` commands when bailing after the first failure.

- Warm installs that rebuild `node_modules` on macOS are about 10% faster: creating each package's virtual-store directory now issues fewer filesystem calls.

- An `_auth` credential in an `.npmrc` now authenticates even when its base64 is written without the trailing `=` padding (or with extra padding, or with whitespace inside it), instead of failing with a 401. An `_auth` that is not valid base64, or that carries no `:` between the username and the password, now fails with `ERR_PNPM_AUTH_INVALID_BASE64` / `ERR_PNPM_AUTH_MISSING_SEPARATOR` [#14257](https://github.com/pnpm/pnpm/issues/14257).

- Colored output is no longer printed as raw escape sequences in the Windows Command Prompt [#14292](https://github.com/pnpm/pnpm/issues/14292). Commands such as `pnpm list` now style their output there.

## 12.0.0

### Major Changes

- Git dependencies on known hosts (GitHub, GitLab, Bitbucket) are now treated as identities rather than transport choices. Every representation of the same repository — `github:owner/repo`, `owner/repo`, `git+https://…`, `git+ssh://git@…` — resolves through the host's canonical HTTPS URL, and the lockfile never records an SSH URL for them. Repositories whose archive endpoint is anonymously reachable resolve to the host's archive (fast tarball download); all others resolve to a `git` clone of the canonical HTTPS URL, which every machine with access to the repository can fetch.

  To reach a private hosted repository over SSH, configure the machine (not the project) with git's own URL rewriting, for example:

  ```sh
  git config --global url."git@github.com:".insteadOf https://github.com/
  ```

  pnpm shells out to `git`, so the rewrite applies to all of pnpm's git operations automatically. URLs of unknown hosts (self-hosted servers) are unaffected and keep their exact URL, including SSH. URLs with embedded credentials are also kept verbatim and never resolve to a host archive.

  This removes the network probing that previously decided between HTTPS and SSH at resolution time, which could record a transport that only worked on the machine that happened to run the resolution (e.g. an SSH URL that broke CI runners without SSH keys).

- A project's `pnpm-workspace.yaml` may no longer carry a setting pnpm does not recognize. Such a setting used to be ignored in silence — a misspelled `minimumReleaseAge` dropped the policy it was meant to set, and nothing said so. Now it is reported, suggesting the closest real setting name when the key looks like a typo, and it fails the command with `ERR_PNPM_UNRECOGNIZED_WORKSPACE_SETTINGS` when the project pins a pnpm version the running pnpm satisfies: with the pin honored, the setting cannot be meant for a different pnpm version, so it is a mistake to fix rather than a key to ignore. Everywhere else it is a warning, so a project that has yet to be cleaned up keeps working.

  The `pnpm config` subcommands never fail on such a setting, so a broken file can still be inspected and repaired, and `pnpm config get <key>` prints the value with no warnings at all. Keys the global config file cannot set are likewise split between workspace-only settings (still directed to `pnpm-workspace.yaml`) and settings unknown to this version.

- Dependency cycles are now broken canonically during peer resolution: the members of each cycle are ordered by package id, and the edges that close a cycle are always cut at the same place, no matter where the installation walks into the cycle from. Previously the cut depended on the walk path, so installing the same dependencies could produce different lockfiles depending on importer order or resolution order [#13846](https://github.com/pnpm/pnpm/issues/13846), and a peer-resolution verdict computed for one occurrence of a cyclic package could be wrongly reused at another [#13865](https://github.com/pnpm/pnpm/issues/13865).

  With canonical cycle breaking the lockfile is a pure function of the dependency graph: repeated installs, reordered importers, and reordered dependencies all produce byte-identical lockfiles. Peer dependencies of packages inside a cycle keep nearest-wins resolution along the canonical order, and a dependency edge that closes a cycle references an occurrence of its target resolved at the importer level. On large cycle-heavy workspaces peer resolution is 2–3× faster, uses about 25% less memory, and produces a substantially smaller lockfile (fewer redundant peer variants).

  Existing lockfiles keep working: headless (`--frozen-lockfile`) installs consume them unchanged, and installs that skip resolution leave them untouched. The first install that actually re-resolves (for example after a dependency change) re-keys walk-order-dependent peer variants of cyclic packages once.

- `packageImportMethod: auto` now tries hardlinks before cloning on Linux. A reflink materializes a new inode and copies extent bookkeeping inside the filesystem's metadata trees, where a hardlink is one directory entry — on btrfs this roughly halves the time an install spends materializing `node_modules` from a warm store. ext4 installs are unchanged (cloning was never supported there, so `auto` already hardlinked), and macOS keeps clone-first, where APFS `clonefile` is the platform's cheap primitive. Cloning remains the fallback when the store refuses hardlinks, and remains available explicitly via `packageImportMethod: clone`.

- Under `engineStrict`, an install fails when an incompatible package is reached through a regular `dependencies` edge of an installable package, even when that whole subtree hangs off an `optionalDependencies` entry. pnpm v11 installs the package and emits an install-check warning instead. Packages reachable only through optional edges, or through a package that was itself skipped, are still skipped in both versions [#13286](https://github.com/pnpm/pnpm/issues/13286).

### Minor Changes

- Globally installed bins can now follow the project you run them in. The new `globalShims` setting is a record of package names to policies that selects which globally installed packages get project-aware shims; it defaults to `{ node: true, deno: true, bun: true }` and merges key-wise, so `globalShims: { bun: false }` switches one default off and `globalShims: { typescript: true }` adds another package. With the default, a project that pins Node.js through `devEngines.runtime` or `engines.runtime` gets the pinned stable release — authenticated against the Node.js release-team signatures — downloaded on first use and run whenever you type `node` inside the project, with no shell hooks. Candidates that are not signature-verified (Deno, Bun, Node.js prereleases, and ordinary package bins you enable) ask "Do you trust this project?" once per candidate and remember the answer machine-locally; the record values name the policy per package: `"auto"` (or its shorthand `true`) defers to artifact authentication, `"always"` switches without ever asking (useful in CI), and `"prompt"` always asks, even for authenticated candidates. Set `globalShims: false` to disable the feature, or `PNPM_SHIM_BYPASS=1` to bypass it for one invocation. On Windows, programs can keep spawning the global `node.exe` directly, without a shell.

- pnpm installs the other package managers now, not just itself: npm, Yarn Classic, Yarn Berry, Yarn 6 (`yarnpkg/zpm`), and Bun. Each is resolved and fetched through the trusted package-manager registries, and an npm-published one is verified against npm's signature for its exact version before it is executed.

  Three things use it:

  - A git-hosted dependency is prepared with the package manager it asks for. Its `packageManager` / `devEngines.packageManager` pin is honored, and a `yarn.lock` written by Yarn Classic no longer gets installed by Yarn Berry. pnpm provides that package manager when the dependency pinned a version, or when the host cannot satisfy what the dependency needs — so a repository built with Yarn now installs on a machine that has only pnpm, while a host that already has a suitable one keeps using its own.
  - `pnpm dlx` (`pnx`) runs one of them for a single command: `pnx yarn@4 install`, `pnx npm@11 ci`, `pnx bun@1.3.0 install`. Naming a package manager, or a runtime (`node`, `deno`, `bun`), there now provisions the real thing instead of installing the npm package that shares its name — unless the specifier locates a package rather than asking for a released version (`pnx yarn@npm:yarn@1.22.22`, `pnx yarn@yarnpkg/berry`), which installs what it names — `pnx yarn@4` was previously a missing version, since Yarn 4 is published as `@yarnpkg/cli-dist`, and `pnx node@22` now runs that Node.js release rather than a wrapper that downloads one. `--package` naming a package manager picks which of its commands to run, so `pnx --package npm@11 npx create-something` runs that npm's `npx`.
  - `pnpm shim add yarn` links a `yarn` command that runs whatever version the current project pins, and `pnpm shim rm` / `pnpm shim ls` manage those shims. It works for any package, not only package managers. Shims are never created as a side effect of `pnpm setup` or an install — a shim shadows the rest of your `PATH`, so pnpm only writes one when asked.

  Installing a package manager globally (`pnpm add -g yarn`) now makes it follow a project's pin too, the way a globally installed Node.js already follows `devEngines.runtime`: the pinned version runs where a project pins one, and the globally installed copy is the fallback everywhere else. An explicit `globalShims` entry, including `false`, is left as you set it.

  `pnpm add` follows the same rule about what a name means. `pnpm add -g yarn@4` installs Yarn Berry — it used to fail, because npm's `yarn` package stops at Classic — and `pnpm add -g node@22` / `pnpm add -g deno@2` install that Node.js or Deno release rather than a wrapper package that downloads one. In a project, naming a package manager records which one the project uses instead of installing it as a dependency, and naming a runtime records it under `engines.runtime` as `node@runtime:22` already did.

  The declaration goes where the package manager reads it. Yarn is started from a project pin by corepack, which reads only `packageManager` and only accepts an exact version there, so `pnpm add yarn@4` resolves the line and writes `"packageManager": "yarn@4.18.0"` — the same thing `corepack use yarn@4` writes, down to the `+sha512.…` integrity for the Yarn Classic line that corepack pins its tarball with. Every other package manager is recorded in `devEngines.packageManager`, which holds a range. Only one of the two fields is ever left behind: they declare the same thing, and corepack refuses to run a project whose declarations disagree.

  A JavaScript package manager on a machine without Node.js gets a managed LTS runtime to run on.

  What changes for a project coming from v11: `pnpm add yarn` records the project's package manager instead of installing the npm package that shares the name (that package is still reachable as `pnpm add yarn@npm:yarn@1.22.22`), `pnpm add -g yarn` installs the current Yarn line rather than Classic, `pnpm add -g node` / `pnpm add -g deno` and `pnx node` / `pnx deno` install a Node.js or Deno release rather than a wrapper package, and a globally installed package manager defers to a project's pin where there is one.

- Added an opt-in proof of concept that lets installs reuse a dependency's build output across machines, by publishing and restoring signed, organization-scoped artifacts through pnpr instead of running the lifecycle scripts locally.

  Configure it with the new `remoteSideEffectsCache` setting. A workspace names the eligible `organization` and `packages`; everything describing the act of signing — `publish`, `keyId`, `builderId`, `trustedKeys`, `privateKey` and the provenance fields — is refused in `pnpm-workspace.yaml` and read from the global config file or the environment instead.

- Added the `audit.ignorePrune` setting. When set to `true`, `pnpm audit --fix` removes ignored GHSA entries that no longer appear in the audit report.

- `pnpm init` now pins the latest pnpm version, instead of the version of pnpm that ran the command. A project scaffolded by an outdated pnpm therefore no longer inherits that staleness through its own `devEngines.packageManager` / `packageManager` pin [#7490](https://github.com/pnpm/pnpm/issues/7490).

  The version is read from the `latest` tag on the package-manager registries. When that lookup cannot answer — no network, an unreachable or slow registry, `offline`, or a `latest` that the `minimumReleaseAge` / `trustPolicy` settings reject — `pnpm init` pins the running version as before, and never fails or hangs on the lookup. A `latest` that is older than the running pnpm is never pinned either.

- Allowed `pnpm update --patches` to refresh registry revisions through a configured pnpr server while retaining locked package versions.

- Added explicit registry revision selection with `<version>+rN` and `pnpm update --patches` for refreshing revision artifacts without changing package versions. Registry-backed lockfile policy checks recognize historical revisions, and pnpr now preserves safe revision histories from upstream registries.

- Added support for registry replacement tarballs using standard integrity values, explicit revision fields, registry routing from the `registries` setting, non-redirecting integrity-addressed URLs, canonical safe-integer revision numbers, and pnpr proxying for immutable upstream revision artifacts.

- Running `pnpm setup`, `pnpm self-update`, or a command that modifies the global installation (such as `pnpm add --global`) through `sudo` now fails with `ERR_PNPM_SUDO_NOT_SUPPORTED` instead of silently operating on the root user's home directory. pnpm keeps global packages and configuration in the invoking user's home directory, so these commands never need root permissions. Read-only global commands (such as `pnpm bin --global`) still work under sudo.

- `pnpm stage approve` now approves several staged packages at once. Run it without a stage id to pick from the staged versions interactively, or pass a list of stage ids. The whole batch is approved with a single one-time password, and pnpm asks for a new one only once the registry stops accepting it. Inside a workspace, the selected packages are approved in dependency order, and a package whose workspace dependency could not be approved is skipped instead of being published against a dependency that never reached the registry.

### Patch Changes

- Deprecated the pnpmfile `filterLog` hook in pnpm v12. The Rust CLI ignores it and emits a warning.

- The built-in compatibility database no longer adds dependencies that were detected by static analysis of published packages. Those entries named packages that are only imported for their types, so installing them was at best unnecessary and at worst broke the dependent: `@typescript-eslint/types` gained a `typescript` dependency resolved to the newest release, which put TypeScript 7 under older `@typescript-eslint` versions and made ESLint fail with "Cannot read properties of undefined (reading 'Intrinsic')". The database keeps its `@yarnpkg/extensions` entries and pnpm's own curated ones.

- When no directory above the project accepts a hard link — inside an AI agent sandbox that only grants write access to the project, or a container with just the project mounted writable — the default store is now created at `<project>/node_modules/.pnpm-store` instead of in the pnpm home directory. In those environments the home store is either read-only or on another volume, which forces every package to be copied instead of hard linked [#13525](https://github.com/pnpm/pnpm/issues/13525).

## 12.0.0-rc.11

### Minor Changes

- `pnpm stage approve` now approves several staged packages at once. Run it without a stage id to pick from the staged versions interactively, or pass a list of stage ids. The whole batch is approved with a single one-time password, and pnpm asks for a new one only once the registry stops accepting it. Inside a workspace, the selected packages are approved in dependency order, and a package whose workspace dependency could not be approved is skipped instead of being published against a dependency that never reached the registry.

### Patch Changes

- Under `nodeLinker: isolated`, a Bit root-component member whose materialized copy carries no `package.json` now receives sibling symlinks for the dependencies its own lockfile snapshot declares, instead of a symlink to every other member of the root. The all-member fallback remains only when no snapshot exists.

- The update notification now suggests `pnpm self-update` when `PNPM_HOME` manages the pnpm in use, and the [standalone install script](https://pnpm.io/installation) otherwise — under Corepack, or when another package manager installed pnpm. `pnpm self-update` under Corepack names the standalone install script too.

## 12.0.0-rc.10

### Patch Changes

- Fixed pnpm v11 incorrectly reporting `confirmModulesPurge` as unrecognized when set in `pnpm-workspace.yaml`. The Rust CLI now identifies the unsupported option as a pnpm v11 setting instead of suggesting an unrelated setting.

- A `+<algorithm>.<hash>` build in a `devEngines.packageManager` version no longer makes `pnpm install --frozen-lockfile` fail with `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` on a lockfile a plain install kept rewriting identically [#14124](https://github.com/pnpm/pnpm/issues/14124).

- The built-in compatibility database no longer adds dependencies that were detected by static analysis of published packages. Those entries named packages that are only imported for their types, so installing them was at best unnecessary and at worst broke the dependent: `@typescript-eslint/types` gained a `typescript` dependency resolved to the newest release, which put TypeScript 7 under older `@typescript-eslint` versions and made ESLint fail with "Cannot read properties of undefined (reading 'Intrinsic')". The database keeps its `@yarnpkg/extensions` entries and pnpm's own curated ones.

- `pnpm install --frozen-lockfile` no longer fails with `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` when the pinned pnpm version recorded in `pnpm-lock.yaml` has to be re-resolved before it can be installed. It runs the pnpm version the lockfile pins and leaves the lockfile unchanged [#14124](https://github.com/pnpm/pnpm/issues/14124).

- Under `nodeLinker: hoisted`, peer-resolution variants of an injected directory dependency (a `file:` snapshot) are materialized as separate copies again instead of collapsing onto the first-seen variant. Each copy keeps its own peer-resolved dependency set, so a project pinning one peer version no longer resolves another project's variant — Bit root components with conflicting peers across injected copies rely on this.

- Fixed `pnpm install --merge-git-branch-lockfiles --frozen-lockfile` failing with `ERR_PNPM_OUTDATED_LOCKFILE` when a branch lockfile predates the removal of a dependency, or its move to another dependency group [#13966](https://github.com/pnpm/pnpm/issues/13966). A dependency that no project declares anymore is no longer reinstated by the merge, and the packages it was the only path to are dropped with it.

- Record the pnpm version a project pins even when the install has nothing else to do. Adding a `devEngines.packageManager` (or `packageManager`) pin to a project whose dependencies are already installed left `packageManagerDependencies` unwritten, so `pnpm install --frozen-lockfile` failed with `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` while a plain `pnpm install` reported "Already up to date" without recording it [#14124](https://github.com/pnpm/pnpm/issues/14124).

- `pnpm install --frozen-lockfile` no longer fails when `pnpm-lock.yaml` records the pinned pnpm version alongside an engine package the running pnpm does not install it from. An entry pinning another version is still refused, and a plain install rewrites the block [#14124](https://github.com/pnpm/pnpm/issues/14124).

## 12.0.0-rc.9

### Major Changes

- A project's `pnpm-workspace.yaml` may no longer carry a setting pnpm does not recognize. Such a setting used to be ignored in silence — a misspelled `minimumReleaseAge` dropped the policy it was meant to set, and nothing said so. Now it is reported, suggesting the closest real setting name when the key looks like a typo, and it fails the command with `ERR_PNPM_UNRECOGNIZED_WORKSPACE_SETTINGS` when the project pins a pnpm version the running pnpm satisfies: with the pin honored, the setting cannot be meant for a different pnpm version, so it is a mistake to fix rather than a key to ignore. Everywhere else it is a warning, so a project that has yet to be cleaned up keeps working.

  The `pnpm config` subcommands never fail on such a setting, so a broken file can still be inspected and repaired, and `pnpm config get <key>` prints the value with no warnings at all. Keys the global config file cannot set are likewise split between workspace-only settings (still directed to `pnpm-workspace.yaml`) and settings unknown to this version.

### Minor Changes

- Added global build approvals [pnpm/pnpm#14101](https://github.com/pnpm/pnpm/issues/14101).

- Added recursive global outdated checks [pnpm/pnpm#14101](https://github.com/pnpm/pnpm/issues/14101).

- `pnpm config get` and `pnpm config list` now show the settings pnpm acts on under their documented names:

  - `registries` shows the registries pnpm resolves from, merged across every source (`.npmrc`, `pnpm-workspace.yaml`, the global config, CLI flags), in the shape the setting is written in: keyed by registry URL, with the default registry declared as the bare `@` scope. Built-in routes are included — the `@jsr` scope and the `npmjs` and `gh` prefixes — unless pointed elsewhere. Previously `pnpm config get registries` printed `undefined`.
  - `update` and `audit` show the effective sections, whichever spelling set them. The deprecated internal spellings (`updateConfig`, `auditConfig`, `auditLevel`) are no longer listed.
  - `catalogs` shows the complete resolved catalog set — the singular `catalog` block is its `default` entry — whichever spelling declared it.
  - The `registry` and `@scope:registry` entries show the merged routes rather than raw `.npmrc` values, so they always agree with the `registries` view.

- Added support for configuring `stateDir` in the Rust pnpm CLI [pnpm/pnpm#12042](https://github.com/pnpm/pnpm/issues/12042).

- Added bounded workspace concurrency for recursive run and exec commands [pnpm/pnpm#14101](https://github.com/pnpm/pnpm/issues/14101).

- `@pnpm/napi` gained reporter output, reverse dependency queries, and lockfile access.

  `install` and `rebuild` accept `options.reporter` and render pnpm's terminal output — progress line, packages-diff summary, lifecycle output, and the `Done in …` footer. Rendered output goes to stdout, or to an `onOutput` callback for a host that writes its own output through JavaScript. New reporting options: `hideLifecycleOutput`, `ignoredBuildsInstructionText`, and `hideLinkedPkgsDiff`.

  `getDependents` returns the reverse dependency trees behind `pnpm why`, annotated with the `package.json` fields named in `manifestFields`. `renderDependents` returns those trees rendered as tree, parseable, or JSON output.

  `readLockfile` and `writeLockfile` read and write `pnpm-lock.yaml` (or the current lockfile under the virtual store). `filterLockfileByImporters` returns a lockfile narrowed to what the named importers reach. `readModulesManifest` returns the `.modules.yaml` state of an installed `node_modules`.

  Top-level lockfile keys pnpm does not define are no longer dropped when a lockfile is loaded and saved, so state a tool records beside pnpm's own keys survives a rewrite.

- `pnpm` now supports per-branch lockfiles in its Rust engine:

  - `gitBranchLockfile` gives each git branch its own `pnpm-lock.<branch>.yaml`, so two branches can hold different resolutions without conflicting on one file. A branch that has no lockfile yet installs against the shared `pnpm-lock.yaml`.
  - `mergeGitBranchLockfiles` (and the `--merge-git-branch-lockfiles` flag on `pnpm install`) folds every branch lockfile back into `pnpm-lock.yaml` and deletes them, which is what merging a branch into the mainline needs.
  - `mergeGitBranchLockfilesBranchPattern` (and `--merge-git-branch-lockfiles-branch-pattern`) names the branches that merge automatically, so a mainline branch does not have to pass the flag by hand [#12042](https://github.com/pnpm/pnpm/issues/12042).

- Added `PNPM_CONFIG_VIRTUAL_STORE_ONLY` and `PNPM_CONFIG_ENABLE_MODULES_DIR` support to the Rust pnpm CLI.

- Added support for the `lockfileDir` setting and its `--lockfile-dir <dir>` flag on `pnpm install`, `add`, `update`, and `remove`. `pnpm-lock.yaml`, the root `node_modules` holding the virtual store, and the config dependencies now live in the given directory, each project is recorded under its path relative to it, and every project keeps its own `node_modules` of symlinks — so several projects can share one lockfile [#12042](https://github.com/pnpm/pnpm/issues/12042).

- Added support for the `preferSymlinkedExecutables` setting. On POSIX systems, `node_modules/.bin` entries are created as symlinks to the executable files instead of shell shims, and `NODE_PATH` pointing at the virtual store of the workspace root is exported to spawned scripts so they can resolve dependencies from the hoisted store. Like the TypeScript CLI, the setting turns on automatically when `nodeLinker` is set to `hoisted`.

- Added the six CLI flags the TypeScript pnpm CLI accepts but the Rust CLI did not [#14101](https://github.com/pnpm/pnpm/issues/14101):

  - `--stream` prints a recursive command's script output as it arrives, one line at a time, prefixed with the project it came from, instead of letting the scripts write to the terminal directly. `--parallel` implies it, as in pnpm.
  - `--aggregate-output` holds each script's streamed output until the script exits and then prints it as one block, so concurrent projects can't interleave.
  - `--reporter-hide-prefix` drops that project prefix from the scripts' own output lines. On a recursive `pnpm exec`, the opposite spelling `--no-reporter-hide-prefix` turns the prefixing on.
  - `--use-stderr` sends the reporter's output to stderr, leaving stdout for the command's own result.
  - `--ignore-workspace` runs the command as if the project were standalone: no workspace root is discovered, so `pnpm-workspace.yaml` contributes neither settings nor sibling projects, and a blocked dependency build is not scaffolded into its `allowBuilds`.
  - `--workspace-packages` overrides the `packages` patterns of `pnpm-workspace.yaml` for the run.

  The `stream`, `aggregateOutput`, `reporterHidePrefix`, `useStderr`, and `ignoreWorkspace` settings are now read from `pnpm-workspace.yaml`, the global `config.yaml`, and their `PNPM_CONFIG_*` environment variables too.

- Added support for the `shellEmulator` setting. With it enabled, the scripts `pnpm run` executes, a project's own lifecycle scripts, and dependencies' build scripts run in a built-in POSIX shell instead of the platform's (`sh -c`, or `cmd /d /s /c` on Windows), so scripts written for `sh` behave the same on every OS. `scriptShell` is not used while the emulator is on.

- The Rust engine now checks that a package read back from the store is the package it was recorded as. When the tarball's `package.json` names a different name or version than the store entry was keyed for — a broken lockfile, or a registry serving content that doesn't match its metadata — the install fails with `ERR_PNPM_UNEXPECTED_PKG_CONTENT_IN_STORE`. Set the new `strictStorePkgContentCheck` setting to `false` to downgrade the failure to a warning and install from the entry anyway [#12042](https://github.com/pnpm/pnpm/issues/12042).

- `pnpm` now supports three workspace settings in its Rust engine:

  - `includeWorkspaceRoot` (and the universal `--include-workspace-root` / `--no-include-workspace-root` flags) keeps the workspace root project in a recursive `run`, `exec`, `add`, or `test`, which otherwise leave it out.
  - `ignoreWorkspaceCycles` and `disallowWorkspaceCycles` control the report an install makes when workspace projects depend on each other in a cycle: it is a warning by default, an `ERR_PNPM_DISALLOW_WORKSPACE_CYCLES` error under `disallowWorkspaceCycles`, and silent under `ignoreWorkspaceCycles` [#12042](https://github.com/pnpm/pnpm/issues/12042).

- Added support for the remaining pnpm default settings, including recursive command controls, optional dependency selection, workspace-root checks, color modes, lockfile compatibility, and pack manifest options.

- Batch workspace publishing accepts a shared scope-specific credential, rejects mismatched credentials for a registry before publishing, and runs the `publish` and `postpublish` scripts after each completed registry group [pnpm/pnpm#14101](https://github.com/pnpm/pnpm/issues/14101).

- Added the commands the Rust CLI was still missing:

  - `pnpm get <key>` and `pnpm set <key> <value>` — the top-level spellings of `pnpm config get` and `pnpm config set`.
  - `pnpm store status` — reports the packages whose files no longer match the store they were expanded from, failing with `ERR_PNPM_MODIFIED_DEPENDENCY`; and `pnpm store add <pkg>...` — fetches packages into the store without writing a manifest, a lockfile, or `node_modules`.
  - `pnpm env use --global <version>` and `pnpm env list [<selector>]`, the deprecated Node.js-only front end to `pnpm runtime`.
  - `pnpm edit`, `pnpm profile`, `pnpm token`, and `pnpm xmas` now fail with `ERR_PNPM_NOT_IMPLEMENTED` pointing at the npm CLI, instead of being taken for a package script.

- An install that resolves the dependency graph now reports the unmet peer dependencies it leaves behind, matching the TypeScript CLI. By default it warns once — `Issues with peer dependencies found. Run "pnpm peers check" to list them.` — and with `strictPeerDependencies` it fails with `ERR_PNPM_PEER_DEP_ISSUES` after the artifacts are written, listing every unmet peer. This covers `pnpm install`, `add`, `remove`, `update` and `--lockfile-only`; `pnpm dedupe` reported the same verdict already, and now shares the reporting with them. `peerDependencyRules` are applied before the verdict, so a rule that covers every issue leaves nothing to report, and a `--filter`ed install reports only on the projects it installed. An install that skips resolution — a frozen install, or one whose `pnpm-lock.yaml` is already up to date — reports nothing, as in the TypeScript CLI; `pnpm peers check` inspects such a tree [#14098](https://github.com/pnpm/pnpm/issues/14098).

- Added `fetchWarnTimeoutMs` and `fetchMinSpeedKiBps` to the Rust pnpm CLI and its N-API bindings. Slow registry metadata requests and tarball downloads now emit pnpm-compatible warnings without exposing URL credentials, query parameters, fragments, or control characters [pnpm/pnpm#12042](https://github.com/pnpm/pnpm/issues/12042).

- Added filtered and split SBOM generation with per-project lockfiles, including reachable workspace projects and incomplete-graph validation [pnpm/pnpm#14101](https://github.com/pnpm/pnpm/issues/14101).

### Patch Changes

- Kept pending build approvals available after removing an unrelated dependency.

- Fixed resolving the `chcp` command on Windows during `pnpm setup` by looking for `chcp.com` before `chcp` [pnpm/pnpm#13991](https://github.com/pnpm/pnpm/issues/13991).

- A custom fetcher can no longer replace the archive integrity that `pnpm-lock.yaml` pins: the locked value is restored after a `canFetch` or `fetch` hook rewrites the resolution, and delegating a locked archive to a directory or git source now fails instead of installing unverified content.

  The Rust CLI now also loads the pnpmfiles named by the `pnpmfile` setting (a single path or an ordered list), and hands custom fetchers native `localTarball` and `remoteTarball` callbacks — including on a fresh install that has to compute a missing tarball integrity, which is then reused by later offline installs. File maps a fetcher returns are accepted only when they match what those native callbacks extracted.

- `pnpm dedupe` accepts the `pnpm install` options that pnpm documents for it — `--lockfile-only`, `--ignore-scripts`, `--offline`, and `--prefer-offline` — instead of rejecting them with `unexpected argument`. Without `--lockfile-only`, `pnpm dedupe` now also updates `node_modules`, as an install does [#14107](https://github.com/pnpm/pnpm/issues/14107).

- `pnpm dedupe` in the Rust engine now fails with `ERR_PNPM_PEER_DEP_ISSUES` when `strictPeerDependencies` is set and unresolved peer dependency issues remain after deduplication, matching the TypeScript CLI [#14099](https://github.com/pnpm/pnpm/issues/14099). Previously it only ever printed a warning, regardless of the setting.

- `pnpm deploy --prod` and `pnpm deploy --no-optional` no longer list the excluded dependency groups in the deployed `package.json` and `pnpm-lock.yaml`. The deployed lockfile referenced packages that the deploy left out of its graph, so installing in the deploy directory afterwards created dangling symlinks [#13623](https://github.com/pnpm/pnpm/issues/13623).

- `pnpm install --dev` and `pnpm deploy --dev` no longer install optional dependencies, and `--prod` now takes precedence when combined with `--dev`, matching the TypeScript pnpm CLI.

- A dependency published with `"bin": ""`, such as `url-loader@1.1.2`, no longer fails the install with `ERR_PNPM_CMD_SHIM_PROBE_SHIM_SOURCE` [#13962](https://github.com/pnpm/pnpm/issues/13962). An empty `bin` declares no command, as it does in pnpm v11, so no shim is written for the package; a `directories.bin` entry on the same package is still linked.

- A dependency pinned to an exact version carrying semver build metadata (`"@parcel/codeframe": "2.0.0-canary.1718+d8408010f"`) installs again instead of failing with `ERR_PNPM_NO_MATCHING_VERSION` [#14096](https://github.com/pnpm/pnpm/issues/14096). npm strips build metadata when it publishes a version, so pnpm strips it from the version it looks up, matching npm and pnpm v11.

- A package's `files` entries now match only at the package root, the way npm reads them. A bare `src` used to also match nested directories such as `example/src`, so a dependency installed from git could ship the repository's own example app. The same filter decides what `pnpm pack` and `pnpm publish` put in a tarball and what `pnpm deploy` copies, so those stop carrying the extra files too. Exclusions such as `!**/__tests__` and `!*.map` still match at any depth. A package already in the store keeps its old file set until it is fetched again.

- A `pnpm install --filter <selector>` run that has nothing to do now reports "Already up to date" without entering the install pipeline, the same way an unfiltered `pnpm install` already did [#14033](https://github.com/pnpm/pnpm/issues/14033).

- On Windows, upgrading pnpm no longer leaves a stale `pnpm.ps1` behind. PowerShell resolves `pnpm.ps1` ahead of `pnpm.cmd`, so a shim written by an older installation kept running the previous version. Linking the pnpm CLI's bins now deletes it [#13919](https://github.com/pnpm/pnpm/issues/13919).

- Settings written to a `pnpm-workspace.yaml` block that uses inline (flow) YAML — `catalog: { foo: ^1.0.0 }`, `overrides: { foo: 1.0.0 }`, `minimumReleaseAgeExclude: [foo@1.0.0]` — are now edited in place instead of failing or corrupting the file. `pnpm audit`, `pnpm link`, `pnpm approve-builds`, `pnpm patch`, `pnpm add --config`, and catalog updates all keep the block's flow style, its other entries, and its comments [#14108](https://github.com/pnpm/pnpm/issues/14108).

- A frozen install no longer rewrites the `packageManagerDependencies` block of `pnpm-lock.yaml`. When the pnpm version pinned by `devEngines.packageManager` (or by `packageManager`) is missing from the lockfile or no longer matches it, `--frozen-lockfile` now fails with `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE` instead of resolving the version and saving it, so a manifest whose pin was bumped without regenerating the lockfile can no longer pass CI [#14009](https://github.com/pnpm/pnpm/issues/14009).

- When a git-hosted dependency is blocked from running build scripts, the error now suggests an `allowBuilds` entry that actually approves it. It quoted the bare package name, which never matches a git-hosted package, so following the suggestion left the install failing the same way [#14002](https://github.com/pnpm/pnpm/issues/14002).

- A git dependency installed over HTTPS from a hosted repository now keeps its branch, tag, or version range in the specifier recorded in `package.json`. It was written back without one, so the next `pnpm update` moved the dependency to the repository's default branch [#13999](https://github.com/pnpm/pnpm/issues/13999).

- Added support for the `globalPnpmfile` setting, which names a user-level pnpmfile that runs for every project ahead of the project's own. Like pnpm, it is left out of the lockfile's `pnpmfileChecksum`, so editing it does not decide whether a lockfile is still current. `pnpmfile` and `globalPnpmfile` are now also readable from `PNPM_CONFIG_PNPMFILE` and `PNPM_CONFIG_GLOBAL_PNPMFILE`.

- Fix recursive `pnpm update <name>@<version>` so an exact pinned update stays scoped to the requested version line: copies of the same package on another major line — or, for a `0.x` request, another minor line — keep their locked resolution instead of being re-resolved along with the target.

- Under `nodeLinker: hoisted`, a dependency declared against a peer-resolution variant of a package version is no longer dropped from the installed layout. All variants of a version share one hoisted copy, and edges pointing at any of them now resolve to it, so the depending project keeps the package in its `.package-map.json` and the depending package keeps it in its `node_modules/.bin`.

- A repeat `pnpm install` with `nodeLinker: hoisted` is a no-op again when a workspace package declares the dependencies [#14001](https://github.com/pnpm/pnpm/issues/14001). The hoisted linker installs them into the root `node_modules`, but the up-to-date check previously looked under each package's own `node_modules` and reinstalled the whole tree every time. A hoisted install also no longer reports the packages it just wrote as broken.

- `ignorePnpmfile` can now be set in `pnpm-workspace.yaml` and read from `PNPM_CONFIG_IGNORE_PNPMFILE`, not only passed as `--ignore-pnpmfile`, so a project or a machine can turn pnpmfile hooks off once instead of adding the flag to every command. The flag still applies on top. As in pnpm, the global `config.yaml` cannot set it: a pnpmfile belongs to the project that ships it.

- Fixed pnpm failing to read `.modules.yaml` files containing long dependency paths [#13875](https://github.com/pnpm/pnpm/issues/13875). The manifest is now parsed as JSON (the format pnpm writes it in), falling back to the YAML parser only for manifests written by old pnpm versions.

- `--config.minimum-release-age` is honored again, along with `--config.minimum-release-age-exclude`, `--config.minimum-release-age-ignore-missing-time` and `--config.minimum-release-age-strict`. Each overrides the matching `pnpm-workspace.yaml` setting, and the exclude flag may be repeated to build a list [#13929](https://github.com/pnpm/pnpm/issues/13929).

- An unreadable `node_modules/.modules.yaml` no longer makes `pnpm install` delete `node_modules` and relink every package on each run. The unparsable state file is now reported as an error instead [#14062](https://github.com/pnpm/pnpm/issues/14062).

- `pnpm outdated` and `pnpm update --interactive` now leave out the dependencies listed in `updateConfig.ignoreDependencies`, instead of reporting them and offering them for update.

- Fixed `pnpm outdated` and `pnpm update --interactive` offering versions blocked by `minimumReleaseAge` [pnpm/pnpm#14004](https://github.com/pnpm/pnpm/issues/14004).

- `pnpm pack` writes tar entries in the POSIX ustar header form npm uses — `ustar\0` magic and the explicit `0` regular-file typeflag — instead of the GNU form with a NUL typeflag, which strict tar readers such as publint mistake for the end-of-archive marker [#13924](https://github.com/pnpm/pnpm/issues/13924).

- Fixed `--config.ignore-scripts=true` not being honored by CLI commands such as `pnpm pack` [#13986](https://github.com/pnpm/pnpm/issues/13986).

- `pnpm install <pkg>` now adds the package, the same as `pnpm add <pkg>` and matching the JavaScript CLI. It previously ended in a usage error: `pnpm i valibot` printed `error: unexpected argument 'valibot' found` instead of saving the dependency [#13886](https://github.com/pnpm/pnpm/issues/13886).

- Fixed Plug'n'Play projects to preload `.pnp.cjs` for dependency and project lifecycle scripts, `pnpm run`, and `pnpm exec`. The generated loader now also exposes the public Yarn PnP API surface.

- Workspace packages declared with a parent-relative pattern in `pnpm-workspace.yaml` (`../shared`, `../../docs/*`) are discovered again. They were dropped from the project list, so `pnpm list -r` and `--filter` did not see them and a frozen install of a lockfile that already held their importer entries failed with `ERR_PNPM_PACKAGE_MANAGER_UNSAFE_IMPORTER_PATH`.

- `pnpm pkg get` and `pnpm pkg set` now accept hyphens inside a dot-notation property path, so `pnpm pkg get dependencies.some-package-name` reads the key instead of failing with `ERR_PNPM_UNEXPECTED_TOKEN_IN_PROPERTY_PATH`. The bracketed and quoted forms already worked and are unchanged.

- A path named by the `pnpmfile` setting that is not on disk now fails with `ERR_PNPM_PNPMFILE_NOT_FOUND` and names the file, instead of surfacing as a generic pnpmfile execution failure. Discovery of the default `.pnpmfile.mjs` / `.pnpmfile.cjs` is unaffected: a project that ships neither still installs normally.

- `pnpm remove` now prunes undecided entries (`"set this to true or false"`) from `allowBuilds` in `pnpm-workspace.yaml` when `sharedWorkspaceLockfile: true` and the corresponding packages are removed [pnpm/pnpm#13892](https://github.com/pnpm/pnpm/issues/13892).

- Suggest `pnpm shim add <runtime>` after pinning a project runtime when no project-aware global shim is installed. Explicit project-aware shims now reject unrelated global bin conflicts and are restored after a matching global package is removed or replaced by a version that drops its bin.

- `pnpm -r update --latest --depth 0 <selector>` now fails with `ERR_PNPM_NO_PACKAGE_IN_DEPENDENCIES` when no project in the workspace declares a matching dependency, instead of silently doing nothing.

- Fixed repeat installs paying for a full lockfile comparison forever after a modification-time collision. When a `package.json` was last modified inside the same clock tick that the install recorded as its validation baseline — a fast install, a checkout that copied files with identical timestamps, or any filesystem that keeps only whole-second modification times — the manifest kept reading as possibly-modified, so every later `pnpm install` and `verify-deps-before-run` check re-compared the manifests against the lockfile instead of taking the fast path [#13907](https://github.com/pnpm/pnpm/issues/13907).

- The Rust CLI now honors five settings it recognized but ignored: `updateNotifier`, `legacyDirFiltering`, `initAuthorName` / `initAuthorEmail` / `initAuthorUrl`, `initLicense`, and `initVersion`. `pnpm install` and `pnpm add` check once a day for a newer pnpm and print how to get it (turn it off with `updateNotifier: false`); a `{<dir>}` filter selector can go back to matching the subtree below the directory with `legacyDirFiltering: true`; and `pnpm init` writes the configured author, license, and version into the `package.json` it scaffolds. `PNPM_CONFIG_INIT_VERSION` is now read as well.

  `maxsockets`, npm's spelling of `maxSockets`, is no longer ignored: both spellings are read from `pnpm-workspace.yaml`, the global config file, the environment, and the command line, in that increasing order of precedence — a value passed on the command line now wins even when the two sides spelled the setting differently.

  A `lastUpdateCheck` timestamp dated in the future — after a clock change, a restored snapshot, or a hand-edited state file — no longer silences the update check until that time comes around.

  `legacyDirFiltering` no longer reaches the workspace-root selectors pnpm generates for itself: the `!{<workspace-root>}` exclusion a recursive `run` / `exec` / `add` / `test` appends, and the `{<workspace-root>}` inclusion `--workspace-root` appends. Read as subtree matches they named every project below the root, so a recursive command under the setting selected nothing at all, and `--workspace-root` pulled in every project below the root instead of the root alone [#14101](https://github.com/pnpm/pnpm/issues/14101).

- `pnpm sbom` now honours `--filter-prod`, the full `--filter` selector syntax (dependency queries such as `pkg...`, `{dir}` and glob paths, `[since]` change queries, exclusions), and `--workspace-root`. Selectors that match no project print `No projects matched the filters` and write no SBOM, and `--split` emits its per-project SBOMs in a stable order.

  The universal `--fail-if-no-match` flag is supported too: any filtered command whose selectors match no workspace project now exits with code 1 [#14064](https://github.com/pnpm/pnpm/issues/14064).

- `pnpm sbom` now fails with `ERR_PNPM_SBOM_MISSING_IMPORTERS` when `pnpm-lock.yaml` has no entry for a selected project, instead of writing an SBOM that under-reports that project's dependencies. Previously this crashed with `Cannot read properties of undefined (reading 'devDependencies')`.

- `pnpm self-update` now rewrites a simple `devEngines.packageManager.version` range (`^`/`~`) to the newly installed version, keeping the operator — matching how `pnpm update` and `pnpm runtime set` rewrite ranges. Complex ranges such as `>=8.0.0` that the new version satisfies are still left unchanged [#13935](https://github.com/pnpm/pnpm/issues/13935).

- `pnpm update` now preserves the existing range operator when updating a prerelease dependency. See pnpm/pnpm#7002.

- `pnpm update <name>@<version>` now fails with `ERR_PNPM_UPDATE_VERSION_ON_INDIRECT_DEP` when the package is not a direct dependency of any selected project, instead of quietly updating it to whatever a fresh install would resolve. There is nowhere to record the version in that case, so the request cannot be honored, and the error points at the `overrides` entry that does pin a transitive dependency. Ranges and tags are unaffected, and a package that any selected project declares directly still takes its version as before.

- `trustPolicy: no-downgrade` no longer aborts the install with `ERR_PNPM_MISSING_TIME` on registries that serve no per-version `time` field when `minimumReleaseAgeIgnoreMissingTime` is set. The trust check reads the same publish dates the `minimumReleaseAge` check does, so it now honors the same opt-in and skips the affected package with a warning [#12446](https://github.com/pnpm/pnpm/issues/12446).

  `minimumReleaseAgeIgnoreMissingTime` no longer lets a lockfile entry the registry does not list pass the `minimumReleaseAge` check during lockfile verification. The opt-in covers a registry that cannot date its releases; a packument that does date every version it lists is saying it never published this one, which stays a hard failure.

  The missing-`time` warning now names the check it is reporting on, so a package whose `minimumReleaseAge` and `trustPolicy` checks are both skipped warns about both instead of only the first.

- `pnpm update <pkg>@<tag>` now saves the version the dist tag resolved to in `package.json`, keeping the range operator the dependency already declared, instead of saving the tag itself. A dependency declared through a `catalog:` reference, a `workspace:` or `npm:` alias, or a path or git specifier keeps its declaration, and one that already tracks a dist tag records the tag asked for [#14092](https://github.com/pnpm/pnpm/issues/14092).

- `pnpm update <pkg>@<version>` now updates only the selected packages and leaves unrelated dependencies unchanged. A selector that renames the package it installs — `pnpm update <alias>@npm:<pkg>@<version>` or the `jsr:` equivalent — now targets the package the alias installs rather than the alias.

- `pnpm version <bump>` with `--dry-run` no longer edits `package.json` files. It now only reports the bumps it would make, and skips the working tree check, the version lifecycle scripts, the commit, and the tag [`pnpm/pnpm#13953`](https://github.com/pnpm/pnpm/issues/13953).

- On Windows, `pnpm store path` now returns a conventional drive path without the `\\?\` verbatim prefix when the project and pnpm home are on different drives [#13987](https://github.com/pnpm/pnpm/issues/13987).

## 12.0.0-rc.8

### Minor Changes

- `packageImportMethod: auto` now tries hardlinks before cloning on Linux. A reflink materializes a new inode and copies extent bookkeeping inside the filesystem's metadata trees, where a hardlink is one directory entry — on btrfs this roughly halves the time an install spends materializing `node_modules` from a warm store. ext4 installs are unchanged (cloning was never supported there, so `auto` already hardlinked), and macOS keeps clone-first, where APFS `clonefile` is the platform's cheap primitive. Cloning remains the fallback when the store refuses hardlinks, and remains available explicitly via `packageImportMethod: clone`.

  This ships with pnpm 12 only: pnpm 11's importer deliberately keeps clone-first, since changing what the default materializes on disk is not a point-release change.

### Patch Changes

- `pnpm approve-builds` now removes `onlyBuiltDependencies`, `onlyBuiltDependenciesFile`, `neverBuiltDependencies`, and `ignoredBuiltDependencies` from `pnpm-workspace.yaml` when it writes `allowBuilds`. Those settings were replaced by `allowBuilds` in pnpm 11 and silently ignored since, so a workspace migrated from pnpm 10 kept them around looking active.

- `pnpm audit` no longer reports a patched version that was never published or is deprecated. The inferred patched range (e.g. `>=4.17.24` from `<=4.17.23`) is now checked against the registry packument, and the report is corrected to the lowest non-deprecated published version that satisfies it (e.g. `>=4.18.1` when `4.17.24` does not exist and `4.18.0` is deprecated). When no published version satisfies the range, the report shows `Patched versions: None`. This also prevents `pnpm audit --fix` from adding overrides or `minimumReleaseAgeExclude` entries for patches that do not exist [#13824](https://github.com/pnpm/pnpm/issues/13824).

  `pnpm audit --fix` and `pnpm audit --fix update` no longer add a `minimumReleaseAgeExclude` entry when the registry packument shows that the minimum patched version was never published. Previously such entries were written for versions that do not exist, which would have let a later publish of that version bypass the `minimumReleaseAge` gate [#11563](https://github.com/pnpm/pnpm/issues/11563).

  The `--json` output of `pnpm audit` now returns `patched_versions: null` for advisories whose inferred patch is not available (never published, skipped, yanked, or deprecated), making it easier for tooling to distinguish "no fix available" from "fix available at version X".

- Re-fetch full registry metadata when `minimumReleaseAge` is enabled and an abbreviated packument's `time` map omits timestamps for some versions. This prevents mature versions from being filtered out and resolution from falling back to the lowest matching version [pnpm/pnpm#13741](https://github.com/pnpm/pnpm/issues/13741).

- A config dependency carrying an inline integrity (the `<version>+<integrity>` form, or the object form without a `tarball`) now takes its tarball URL from the registry's packument instead of deriving it from the registry URL, so migrating one costs an extra metadata request. On a registry that serves tarballs from a path pnpm cannot derive, GitLab's group endpoint for one, installing such a config dependency failed with a 404 while the same package installed fine as a regular dependency [#13765](https://github.com/pnpm/pnpm/issues/13765).

- Don't treat files like `license16.json` as a package license when deciding if the workspace LICENSE file should be included in the packed package.

- Reduced warm update overhead by limiting virtual-store bin linking and ignored-script build bookkeeping to packages materialized by the current install.

- `pnpm init` now pins the exact pnpm version instead of a `^` range, and records it in the `packageManager` field alongside `devEngines.packageManager`. Corepack reads only `packageManager` and accepts nothing but an exact version, so it rejected the generated `package.json` with "expected a semver version" [pnpm/pnpm#13969](https://github.com/pnpm/pnpm/issues/13969). A package created inside an existing workspace is still left unpinned — it follows the pin at the workspace root — and `--no-init-package-manager` still scaffolds a manifest without any pin. In pnpm 12, `pnpm init` also honors `initType` and its `--init-type` flag, so the manifest it writes is the same one pnpm 11 writes.

- `node-linker=hoisted` installs no longer produce broken layouts on graphs with version conflicts. Three hoister fixes, aligning with `@yarnpkg/nm` (which the TypeScript CLI delegates to):

  - A version-conflicted package depended on by several packages kept its conflicting transitive dependencies under only one of the dependents, so requiring them through any other dependent resolved the wrong (root-hoisted) version — for example an ESM `parse-entities@4` resolving `character-entities-legacy` v1 instead of v3, which crashes with `ERR_IMPORT_ATTRIBUTE_MISSING` on Node.js 22. Hoist decisions are now made per parent path on decoupled copies (ports upstream's `decoupleGraphNode`).
  - Peer-resolution variants of one package version now collapse onto a single copy (ports pnpm v11's `depPathByPkgId` mapping) instead of conflict-nesting a copy under every dependent — on peer-variant-heavy graphs (such as `bit`'s) the old behavior also made the per-path walk explode.
  - Hoisting no longer shadows names a subtree resolves through an ancestor directory: a candidate is refused when a nearer ancestor holds a different version of its name (upstream's "filled by parent" scan) or when the hoist root's subtree already resolves that name from above (upstream's `usedDependencies` gate).

- `pnpm update --no-save <pkg>@<version>` now keeps the manifest's declared importer specifier in `pnpm-lock.yaml` when the requested version satisfies that range, so a subsequent `--frozen-lockfile` install no longer fails because the lockfile records the requested version as the specifier.

- Reduced registry metadata requests during dependency resolution by reusing cached metadata when lockfile preferences prove that no uncached version can win [pnpm/pnpm#13976](https://github.com/pnpm/pnpm/issues/13976).

- Improved install performance: the store-index writer's shutdown now overlaps the install's final lockfile and `.modules.yaml` writes instead of extending the install's tail.

- A setting in the global `config.yaml` that pnpm does not read from that file, or that is written in kebab-case instead of camelCase, is now reported instead of being ignored silently.

- A forced full re-resolution (config changes the fast lockfile update cannot absorb, such as a changed override or `packageExtensions`) no longer moves dependencies whose recorded versions still satisfy their ranges. The prior lockfile now pins each still-satisfied edge even when its recorded subtree cannot be reused wholesale, so open ranges like `@types/node: "*"` keep their locked versions instead of collapsing onto the highest locked version and churning the lockfile.

- Improved fresh resolution performance when package metadata is already cached.

- Improved fresh installs by reusing the store index and verified-files cache during dependency materialization.

- A runtime installed through `devEngines.runtime` now matches the host when `supportedArchitectures` lists several platforms. Listing `os: [darwin, linux]` and `cpu: [x64, arm64]` used to install the runtime built for the first entry of each list, so a machine running Linux on arm64 got a macOS x64 Node.js that could not execute [#13898](https://github.com/pnpm/pnpm/issues/13898).

- `pnpm self-update <tag>` no longer downgrades when the dist-tag points at the pnpm version already running and that version is younger than `minimumReleaseAge`. The maturity cutoff moved the tag back to the previous mature release, so `pnpm self-update next-12` on v12.0.0-rc.4 switched to v12.0.0-rc.3.

- Improved install performance: large tarballs are now verified and extracted while they download, so the biggest packages — whose downloads finish last — no longer add their whole extraction to the end of the install.

## 12.0.0-rc.7

### Minor Changes

- `node_modules/.modules.yaml` no longer records the registries an install resolved from, and the recorded copy is dropped from the file on the first install that rewrites it.

  It dated from the lockfile format that spelled a dependency's path relative to its registry, where reading an installed tree meant knowing the registries it was installed with. Dependency paths have not carried a registry for several major versions, and the recorded copy outlived its use: `pnpm list`, `pnpm why`, and single-project installs preferred it over the project's own configuration, so a project whose registry had changed since its last install was still read through the old one.

  They now use the configured registries, like every other command already did.

- When `enableGlobalVirtualStore` is on, every process pnpm spawns for the project (`pnpm run`, `pnpm exec`, lifecycle scripts) now receives a `NODE_PATH` pointing at the project's hoisted `node_modules`, plus a `NODE_OPTIONS` `--import` flag that registers a resolve hook restoring `NODE_PATH` lookups for ESM imports. Dependencies that import undeclared ("phantom") packages keep resolving under the global virtual store — for both CommonJS and ESM — without installing the `@pnpm/plugin-esm-node-path` config dependency [pnpm/pnpm#9618](https://github.com/pnpm/pnpm/issues/9618). Tools run by `pnpm dlx` resolve such dependencies too: the JS CLI passes them the same environment, while the Rust CLI's dlx cache is self-contained, so its layout already exposes them.

- A registry can now declare that its abbreviated metadata carries the `time` field, so `resolutionMode: time-based` reads the full metadata document only from the registries that need it:

  ```yaml
  resolutionMode: time-based
  registries:
    https://npm.internal.example/:
      supportsTimeField: true
  ```

  `registry.npmjs.org` omits `time` from abbreviated metadata, so a time-based resolution has to fall back to the much larger full document. That fallback used to be all-or-nothing: `registrySupportsTimeField` answered for every registry at once, so a project resolving from both the public registry and a Verdaccio instance either paid for full metadata everywhere or claimed a `time` field npmjs does not serve. The answer is now per registry, and `registrySupportsTimeField` remains the answer for every registry that does not declare one.

  The declaration is also sent to a pnpr server, which applies it to the resolution it runs on the client's behalf.

- A pnpr resolve request now carries the client's registries the way the `registries` setting declares them — keyed by URL, with the scopes routed to each, the bare-specifier prefix each answers to, and each one's `serverType` — in place of the prefix map it used to send.

  The server routes them through the same inversion the config reader runs, so a pnpr-served install resolves a scoped dependency from the registry that scope is routed to, which it previously could not: only the default registry and the prefix-addressed ones reached the server. A declared `serverType` reaches it too, so the tarball URLs pnpr omits from the lockfile match the ones the client reconstructs.

  Built-in scope routes the project has not pointed elsewhere are not declared, so a pnpr server's allowlist is not asked about `npm.jsr.io` on requests that resolve no JSR package.

  A registry a request only declares is no longer refused up front for being off the server's allowlist — a client describes its whole configuration, including scopes a given resolve never reaches, so a stray `@scope:registry` in a developer's `~/.npmrc` no longer fails every install against a pnpr server that does not serve it. The boundary moves to the fetch itself: an origin the resolve does reach is refused before the request leaves the server, with the same message.

  This changes the resolve and verify-lockfile request bodies. A pnpr server and its clients have to be on matching versions; the protocol is still experimental and unversioned.

- A resolve request now carries the client's `resolutionMode`, so an install delegated to a pnpr server picks versions the way the client would. `time-based` and `lowest-direct` reached the server as nothing at all, leaving it on its `highest` default: the returned lockfile pinned the highest satisfying version of every dependency, and the setting appeared to be ignored.

  This adds a field to the resolve request body. A server older than its client ignores it and keeps resolving `highest`; the protocol is still experimental and unversioned.

- The `registries` setting now declares a registry once, keyed by its URL, with everything about that registry in the entry: how it lays out tarball URLs, the scopes routed to it, and the bare-specifier prefix it answers to.

  ```yaml
  registries:
    https://artifactory.example.com/artifactory/api/npm/npm-virtual/:
      serverType: artifactory
      scopes: ['@acme', '@acme-internal']
      prefix: work
  ```

  - **`serverType`** tells pnpm how the registry lays out its tarball URLs, which decides whether a URL can be omitted from `pnpm-lock.yaml`:
    - **undeclared** (the default) — strict. Only the exact canonical URL is treated as reconstructible.
    - **`npm`** — the registry behaves like `registry.npmjs.org`, which also serves a scoped package from its percent-encoded path. Declare this for a faithful mirror or caching proxy of the public registry so its tarball URLs can be omitted too.
    - **`artifactory`** — JFrog Artifactory repeats the scope in a scoped package's tarball filename (`@acme/widget/-/@acme/widget-1.0.0.tgz`) where the npm registry strips it (`@acme/widget/-/widget-1.0.0.tgz`). Declaring it lets pnpm rebuild that URL, so it is omitted from `pnpm-lock.yaml` instead of being written out for every scoped package [pnpm/get-npm-tarball-url#16](https://github.com/pnpm/get-npm-tarball-url/issues/16).
  - **`scopes`** lists the `@`-prefixed scopes that resolve from this registry. A bare `'@'` is the scope-less default registry, the one the `registry` setting names.
  - **`prefix`** is the alias a dependency addresses this registry by, as in `"foo": "work:^1.0.0"`.

  The layout is never inferred from the registry URL, so nothing changes unless you declare it; `registry.npmjs.org` continues to behave as `npm` without being declared. Because the lockfile depends on `serverType`, it is read from `pnpm-workspace.yaml` only — a `serverType` in the global `config.yaml` is ignored, so one developer's machine cannot shape a lockfile their collaborators read back with a different layout. Credentials are rejected in this setting, in a key as well as in a field, and still belong in `.npmrc`. An entry that routes nothing to itself and matches no configured registry is reported as a warning rather than silently ignored.

  ### Migrating

  The older `registries` shape, a map of `<scope>: <url>` strings, still works and needs no change:

  ```yaml
  registries:
    '@acme': https://npm.acme.example/
  ```

  `namedRegistries` is deprecated in favor of the `prefix` field, and is still read for prefixes `registries` does not declare.

  `toLockfileResolution` and `isCanonicalRegistryTarballUrl` now take their registry and layout as an options object rather than positional arguments, so `@pnpm/lockfile.utils` and `@pnpm/resolving.tarball-url` get a major bump.

- Added `virtualStoreType`, which names where the virtual store lives — one store per machine, or one per project:

  ```yaml
  virtualStoreType: global   # or: project
  ```

  It is the canonical spelling of `enableGlobalVirtualStore`, which keeps working. When a project sets both, `virtualStoreType` wins. It can also be set through `PNPM_CONFIG_VIRTUAL_STORE_TYPE` and read back with `pnpm config get virtualStoreType`. The default is unchanged — `project`, so the shared store stays opt-in.

  The setting is independent of `nodeLinker`. `isolated` and `pnp` both work with either store type, and `hoisted` writes no virtual store at all, so it is unaffected.

### Patch Changes

- Fixed `pnpm patch-commit` in project and edit paths containing non-ASCII characters.

- Fixed `404` errors when installing from a registry that serves scoped packages only from a percent-encoded path, such as GitHub Enterprise Server. Outside `registry.npmjs.org`, a tarball URL that encodes the scope separator as `%2f` or `%2F` is no longer mistaken for one that pnpm can rebuild from the package name, version, and registry, so it is kept in `pnpm-lock.yaml` and requested verbatim on the next install [#13534](https://github.com/pnpm/pnpm/issues/13534).

- Fixed an inconsistency where `minimumReleaseAgeExclude` (and `trustPolicyExclude`) wildcard/bare-name rules behaved differently in the evaluator and normalizer. A bare rule now consistently evaluates as matching every version, preventing unexpected behavior and silent widening of version policy exemptions when pnpm rewrites the workspace manifest [pnpm/pnpm#13725](https://github.com/pnpm/pnpm/issues/13725).

- Fixed `pnpm update --global --latest` failing with a 404 error when a globally installed package was not added from the registry by name. Packages installed from a local path (`link:`/`file:`), a git repository, a tarball URL, an `npm:` alias, or a named registry now keep their spec during a global update instead of being looked up by name in the default registry. See pnpm/pnpm#12854.

- `pnpm outdated` and `pnpm update --interactive` now dereference `catalog:` specifiers before querying the registry. A catalog entry that is an npm alias (`'@types/zkochan__table': npm:@types/table@6.3.2`) no longer fails with `ERR_PNPM_OUTDATED_REGISTRY_ERROR` for the alias key, and `pnpm outdated --compatible` compares against the range the catalog holds instead of skipping the dependency.

- A failed packument request now reports the status the registry returned (`404 Not Found`) instead of "error decoding response body".

- Installs with a cold cache are significantly faster: lockfile verification no longer delays resolution or downloads and re-checks far less data over the network, and downloaded packages are linked while the remaining downloads are still in flight.

- Fixed `pnpm` installs using pnpr to honor the client's `autoInstallPeers`, `dedupePeers`, and `excludeLinksFromLockfile` settings [pnpm/pnpm#13389](https://github.com/pnpm/pnpm/issues/13389).

- The three registry lookups are now named for what they are keyed by, so that none of them is called `registries` — a name the `registries` setting itself has taken:

  | before | after |
  |---|---|
  | `Config.registries` | `Config.registriesByScope` |
  | `Config.namedRegistries` | `Config.registriesByPrefix` |
  | `Config.registryOptions` | `Config.registryOptionsByUrl` |

  The same rename applies to the `RegistryContext` fields, the `Registries` and `NamedRegistries` types (now `RegistriesByScope` and `RegistriesByPrefix`), `normalizeRegistries` / `normalizeNamedRegistries` (now `normalizeRegistriesByScope` / `normalizeRegistriesByPrefix`), and the `BUILTIN_NAMED_REGISTRIES` constant (now `BUILTIN_REGISTRIES_BY_PREFIX`).

  This is an internal rename: no setting, error code, lockfile field, or `.pnpmfile.cjs` hook field changes. A `preResolution` hook still reads `ctx.registries`, which is the name pacquet passes as well. The `registries` and `namedRegistries` settings are read under the names users write them.

  The pnpr resolve request sends `registriesByPrefix` where it sent `namedRegistries`. A pnpr server and its clients must be on matching versions, which is already the case for an experimental server.

- An install that had to re-hash store files to verify them now reports it. If that cost more than a second, it says how long — `The integrity of N files was checked in 2.5s.` — and if it was quick but covered more than a thousand files, it names the cause instead: their timestamps changed since the store recorded them, which a backup tool, an antivirus scan or a copied store can do.

- Installs are faster in workspaces that declare inter-workspace dependencies with plain ranges (`"*"`, `"^1.2.3"`) rather than the `workspace:` protocol. With `preferWorkspacePackages` enabled, linking such a dependency no longer makes a registry request that cannot change the outcome — and workspace packages that were never published no longer cost a 404 on every install.

- An override change is now absorbed by the fast lockfile update even when another, unchanged override uses the `catalog:` protocol. Previously any `catalog:`-valued override forced a full re-resolution whenever the override list changed, which could move unrelated packages in the lockfile (for example after `pnpm audit --fix` added an override).

- Reduced peak memory usage when installing large packages. A tarball whose compressed size is at least 16 MiB, or whose registry-reported unpacked size is at least 64 MiB, is now extracted by streaming the decompression directly into the content-addressable store instead of materializing the whole decompressed archive in memory, and its large files are hashed and written to the store incrementally.

- `pnpm why` and `pnpm list` no longer print stray `[90m`-style codes in their trees when the terminal supports colors. The bolded labels — the searched package in `pnpm why`, the project header and the matched package in `pnpm list` — dropped the escape byte of the styles they already carried, leaving the color codes as visible text.

## 12.0.0-rc.6

### Minor Changes

- Added `pnpm cache path`, which prints the directory pnpm uses for its metadata cache. CI setups can use it to cache that directory — including the lockfile verification log, which lets a job skip re-checking an unchanged lockfile against the configured supply-chain policies.

- pnpm installs the other package managers now, not just itself: npm, Yarn Classic, Yarn Berry, Yarn 6 (`yarnpkg/zpm`), and Bun. Each is resolved and fetched through the trusted package-manager registries, and an npm-published one is verified against npm's signature for its exact version before it is executed.

  Three things use it:

  - A git-hosted dependency is prepared with the package manager it asks for. Its `packageManager` / `devEngines.packageManager` pin is honored, and a `yarn.lock` written by Yarn Classic no longer gets installed by Yarn Berry. pnpm provides that package manager when the dependency pinned a version, or when the host cannot satisfy what the dependency needs — so a repository built with Yarn now installs on a machine that has only pnpm, while a host that already has a suitable one keeps using its own.
  - `pnpm dlx` (`pnx`) runs one of them for a single command: `pnx yarn@4 install`, `pnx npm@11 ci`, `pnx bun@1.3.0 install`. Naming a package manager, or a runtime (`node`, `deno`, `bun`), there now provisions the real thing instead of installing the npm package that shares its name — unless the specifier locates a package rather than asking for a released version (`pnx yarn@npm:yarn@1.22.22`, `pnx yarn@yarnpkg/berry`), which installs what it names — `pnx yarn@4` was previously a missing version, since Yarn 4 is published as `@yarnpkg/cli-dist`, and `pnx node@22` now runs that Node.js release rather than a wrapper that downloads one. `--package` naming a package manager picks which of its commands to run, so `pnx --package npm@11 npx create-something` runs that npm's `npx`.
  - `pnpm shim add yarn` links a `yarn` command that runs whatever version the current project pins, and `pnpm shim rm` / `pnpm shim ls` manage those shims. It works for any package, not only package managers. Shims are never created as a side effect of `pnpm setup` or an install — a shim shadows the rest of your `PATH`, so pnpm only writes one when asked.

  Installing a package manager globally (`pnpm add -g yarn`) now makes it follow a project's pin too, the way a globally installed Node.js already follows `devEngines.runtime`: the pinned version runs where a project pins one, and the globally installed copy is the fallback everywhere else. An explicit `globalShims` entry, including `false`, is left as you set it.

  `pnpm add` follows the same rule about what a name means. `pnpm add -g yarn@4` installs Yarn Berry — it used to fail, because npm's `yarn` package stops at Classic — and `pnpm add -g node@22` / `pnpm add -g deno@2` install that Node.js or Deno release rather than a wrapper package that downloads one. In a project, naming a package manager records which one the project uses instead of installing it as a dependency, and naming a runtime records it under `engines.runtime` as `node@runtime:22` already did.

  The declaration goes where the package manager reads it. Yarn is started from a project pin by corepack, which reads only `packageManager` and only accepts an exact version there, so `pnpm add yarn@4` resolves the line and writes `"packageManager": "yarn@4.18.0"` — the same thing `corepack use yarn@4` writes, down to the `+sha512.…` integrity for the Yarn Classic line that corepack pins its tarball with. Every other package manager is recorded in `devEngines.packageManager`, which holds a range. Only one of the two fields is ever left behind: they declare the same thing, and corepack refuses to run a project whose declarations disagree.

  A JavaScript package manager on a machine without Node.js gets a managed LTS runtime to run on.

  What changes for a project coming from v11: `pnpm add yarn` records the project's package manager instead of installing the npm package that shares the name (that package is still reachable as `pnpm add yarn@npm:yarn@1.22.22`), `pnpm add -g yarn` installs the current Yarn line rather than Classic, `pnpm add -g node` / `pnpm add -g deno` and `pnx node` / `pnx deno` install a Node.js or Deno release rather than a wrapper package, and a globally installed package manager defers to a project's pin where there is one.

- Resolving a Node.js runtime version (`devEngines.runtime` / `runtime:` specifiers) is now much faster: the per-version release metadata is cached in the pnpm cache directory after its signature is verified, and an exact stable version such as `runtime:22.23.2` no longer downloads the Node.js release index. A pinned runtime whose metadata was fetched once resolves without any network access, which removes the noticeable delay on the first `node` invocation in a project pinning an already-downloaded runtime [#13899](https://github.com/pnpm/pnpm/issues/13899).

### Patch Changes

- Corepack can run pnpm 12 again [#13018](https://github.com/pnpm/pnpm/issues/13018). Corepack installs no dependencies and runs no lifecycle scripts, so the native binary that the `pnpm` package normally receives from its platform-specific optional dependency was never there, and `corepack use pnpm@next-12` failed with `MODULE_NOT_FOUND`. The package now ships the `bin/pnpm.mjs` and `bin/pnpx.mjs` entry points Corepack looks for; they fetch the pinned native binary on first use — verified against npm's signature and checksum, honouring `COREPACK_NPM_REGISTRY` and the rest of Corepack's registry environment — and hand over to it. Installing pnpm with a package manager is unaffected and still runs the binary directly, with no Node.js startup in between.

- With a configured `pnprServer`, `pnpm install` skips the server exchanges it does not need, closing the gap where an up-to-date project paid a full resolve round trip that a direct install answered locally [pnpm/pnpm#13904](https://github.com/pnpm/pnpm/issues/13904):

  - The repeat-install "Already up to date" fast path now runs with a pnpr server configured.
  - An install whose `pnpm-lock.yaml` still satisfies every manifest skips the server resolve exchange and materializes `node_modules` from the on-disk lockfile.
  - The input-lockfile verification round trip is skipped when the local `lockfile-verified.jsonl` cache already covers the lockfile under the current policy; server-verified and server-resolved lockfiles are now recorded into that cache.
  - Changing the `trustPolicy*`, `minimumReleaseAgeStrict`, or `minimumReleaseAgeExclude` settings now invalidates the repeat-install fast path, matching the TypeScript CLI's workspace-state check.

- The published packages now ship a `THIRD-PARTY-NOTICES.md` file carrying the BSD 2-Clause license of the Yarn code that pnpm's hoisted-layout algorithm and built-in package-compatibility database are derived from.

## 12.0.0-rc.5

### Minor Changes

- **Breaking change.** Dependency cycles are now broken canonically during peer resolution: the members of each cycle are ordered by package id, and the edges that close a cycle are always cut at the same place, no matter where the installation walks into the cycle from. Previously the cut depended on the walk path, so installing the same dependencies could produce different lockfiles depending on importer order or resolution order [#13846](https://github.com/pnpm/pnpm/issues/13846), and a peer-resolution verdict computed for one occurrence of a cyclic package could be wrongly reused at another [#13865](https://github.com/pnpm/pnpm/issues/13865).

  With canonical cycle breaking the lockfile is a pure function of the dependency graph: repeated installs, reordered importers, and reordered dependencies all produce byte-identical lockfiles. Peer dependencies of packages inside a cycle keep nearest-wins resolution along the canonical order, and a dependency edge that closes a cycle references an occurrence of its target resolved at the importer level. On large cycle-heavy workspaces peer resolution is 2–3× faster, uses about 25% less memory, and produces a substantially smaller lockfile (fewer redundant peer variants).

  Existing lockfiles keep working: headless (`--frozen-lockfile`) installs consume them unchanged, and installs that skip resolution leave them untouched. The first install that actually re-resolves (for example after a dependency change) re-keys walk-order-dependent peer variants of cyclic packages once.

### Patch Changes

- Auto-installed peer dependencies are no longer resolved to their lowest satisfying versions under `resolutionMode: lowest-direct` or `time-based`. A hoisted peer is not a dependency the project declares, so it resolves like a transitive dependency — to the highest version satisfying the peer range (under `time-based`, the highest within the publish-date cutoff) [#13871](https://github.com/pnpm/pnpm/pull/13871).

- The resolved dependency graph and lockfile no longer depend on the order in which workspace projects are listed or discovered: importers are processed in project-id order, so reordering the `packages` globs in `pnpm-workspace.yaml` (or any other change to project listing order) produces a byte-identical lockfile [#13846](https://github.com/pnpm/pnpm/issues/13846). This also makes auto-installed peer placement, deprecation-warning attribution, and cycle back-edge bindings a function of the project set alone.

- Fixed non-deterministic lockfiles on cold installs of projects with cyclic peer dependencies: resolved peer variants could silently drop from the lockfile depending on traversal order [#13846](https://github.com/pnpm/pnpm/issues/13846), [#13865](https://github.com/pnpm/pnpm/issues/13865).

- A lockfile entry whose resolution is unchanged no longer loses its recorded `deprecated` marker when a registry serves the package's metadata inconsistently — re-resolving to the same version keeps the deprecation instead of silently dropping the line [#13846](https://github.com/pnpm/pnpm/issues/13846).

- `pnpm update` now writes the new version range back to `package.json` (and to the `catalog:` entry a dependency points at), instead of only updating the lockfile [#13879](https://github.com/pnpm/pnpm/issues/13879). The range operator the dependency already declared is preserved, and a dependency declared through a dist-tag (`"foo": "latest"`) keeps tracking the tag under both `pnpm update` and `pnpm update --latest`.

## 12.0.0-rc.4

### Minor Changes

- Added a new setting `minimumReleaseAgeExcludePrune`. When enabled, `pnpm add`, `pnpm update`, and `pnpm remove` prune the entries of `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` that the freshly written lockfile no longer resolves: versions that are gone are dropped (an entry is removed once none of its versions remain), and entries for packages that are no longer in the lockfile are removed too. Name patterns (`@scope/*`) are always kept. The cleanup is skipped when the install's lockfile does not cover the whole workspace (`sharedWorkspaceLockfile: false`), since entries another project still needs would look stale.

  Renamed `cleanupUnusedCatalogs` to `catalogPrune`, so that catalog pruning and release-age exclude pruning use one vocabulary. `cleanupUnusedCatalogs` continues to work; when both are set, `catalogPrune` wins.

- Added support for the `syncInjectedDepsAfterScripts` setting. It names the scripts after which every injected copy of the package that ran them is brought back in step with its source, so a build script no longer leaves the copies in the virtual store holding stale files.

### Patch Changes

- `pnpm add` no longer re-resolves the dependency graph when `pnpm-lock.yaml` already holds a version satisfying the request — promoting a transitive dependency to a direct one, or adding to a second workspace package what a first one already depends on, now only saves the dependency in `package.json` and records its importer entry. A satisfying locked version is necessary but not sufficient: the install still falls back to a full resolution for a dist tag, an alias, a `workspace:`/`catalog:`/git/tarball specifier, `--save-peer`, an overridden package, a `catalogMode` other than `manual`, and — under `resolutionMode: time-based` or `lowest-direct`, which resolve a direct dependency to the low end of its range — a range several locked versions satisfy.

- Global installs now switch over atomically. The command shims in the global bin directory point at a stable per-package link rather than at the directory a particular install produced, so `pnpm add -g` and `pnpm update -g` activate a new version by moving that one link instead of rewriting every shim. A command can no longer be missing from `PATH` while an install is in progress, and a failed install leaves the previous version in place.

- `pnpm audit --fix` and `pnpm audit --fix update` no longer add `minimumReleaseAgeExclude` entries for patched versions that were published before the `minimumReleaseAge` cutoff. The publish time of each minimum patched version is now checked against the registry metadata, and only versions young enough to be blocked by the age gate get an exclusion entry [#11563](https://github.com/pnpm/pnpm/issues/11563).

- Bounded the number of requests in flight to the `.pnpmfile.cjs` worker process. An install that runs the `readPackage` hook for thousands of packages at once no longer risks failing with `ERR_PNPM_PNPMFILE_FAIL` on a hook timeout spent waiting in the queue rather than running the hook, and holds fewer copies of the manifests it is hooking while it waits.

- `pnpm add <pkg>@<version>` and `pnpm update <pkg>@<version>` under `catalogMode: strict` no longer fail with `ERR_PNPM_CATALOG_VERSION_MISMATCH` when the catalog entry is a range that the wanted version satisfies. The dependency keeps using the catalog; only a version that really falls outside the catalog's range is rejected [#13715](https://github.com/pnpm/pnpm/issues/13715).

- Fixed `pnpm install` in CI to use frozen lockfile mode by default when an existing `pnpm-lock.yaml` is non-empty. An outdated lockfile now fails without being rewritten, while projects without a lockfile or with an empty lockfile can still generate one.

- A changed `catalogs` or `pnpm.overrides` block no longer has to be the only change for `pnpm install` to update the lockfile in place. Editing an override while also removing a dependency, or changing a catalog entry in the same commit as a range bump, is now absorbed in one pass instead of re-resolving the whole dependency graph [#13799](https://github.com/pnpm/pnpm/issues/13799).

  Fixed the lockfile an in-place override update wrote when the overridden package was also a catalog entry: the entry kept the version it had before the override moved the package. The same could happen in reverse, when a catalog entry moved a package an override pins. Both cases now re-resolve instead.

- `pnpm install` now updates the lockfile in place even when several kinds of changes happened since the last install — for example a removed dependency together with a widened `ignoredOptionalDependencies` list, or a dependency edit alongside a patch or settings change. Previously any combination of changes forced a full re-resolution [#13763](https://github.com/pnpm/pnpm/issues/13763).

- Resolving peer dependencies in a workspace whose dependency graph contains many peer-dependency cycles now needs less than half the memory and finishes about twice as fast. Verdicts computed inside dependency cycles are now cached and reused for the occurrences they are provably valid for, instead of being recomputed for every occurrence.

- `pnpm install` and `pnpm dedupe` no longer eat all the available memory while resolving a graph in which many packages declare the same missing peer dependency, such as the `react` peer the `@radix-ui` packages share [#13786](https://github.com/pnpm/pnpm/issues/13786).

- With `dedupeDirectDeps`, a project's symlink that becomes redundant — because the workspace root started providing the same dependency at the same resolution — is removed on the next install instead of surviving forever [#13775](https://github.com/pnpm/pnpm/issues/13775). The layout no longer depends on install history: an incremental install now ends up with the same `node_modules` a clean install of the same manifests produces.

- `pnpm deploy` injects workspace dependencies again, so the deploy directory is self-contained instead of symlinking back into the source workspace [#13754](https://github.com/pnpm/pnpm/issues/13754). Enabling `injectWorkspacePackages` with `dedupeInjectedDeps` disabled now also rewrites already-linked workspace dependencies to injected copies.

- `pnpm deploy --no-optional` no longer writes a lockfile whose snapshots reference optional dependencies that the deploy excluded.

- `pnpm --filter . deploy` deploys the project in the current directory instead of the projects nested under it, so deploying the workspace root now copies the root project and installs its workspace dependencies [#13758](https://github.com/pnpm/pnpm/issues/13758). `pnpm deploy --legacy` no longer rewrites the source workspace's `pnpm-lock.yaml`.

- Fixed `pnpm install` writing a different `pnpm-lock.yaml` for an unchanged project depending on the order its dependencies happened to resolve in, which showed up as spurious lockfile diffs between installs.

- Removing the last dependency that references a catalog entry via the fast lockfile update no longer leaves the stale catalog entry in `pnpm-lock.yaml`.

- `--frozen-lockfile` no longer rejects a lockfile pnpm just generated when `packageExtensions` adds a peer dependency to a workspace project. The peer is auto-installed and recorded in the importer entry, but the freshness check compared against the `package.json` on disk, which has no such peer, and reported the entry as a removed dependency [#13836](https://github.com/pnpm/pnpm/issues/13836).

- A git dependency whose clone (or shallow fetch) fails now reports which package it belongs to, under the `ERR_PNPM_GIT_FETCH_FAILED` code, with credentials in the repository URL redacted. When the lockfile records an SSH remote, the error also explains that fetching it needs an SSH key for that host, and that a lockfile entry written before pnpm v11.21 can be re-recorded over HTTPS with `pnpm update <package>` [#13743](https://github.com/pnpm/pnpm/issues/13743).

- An `integrity` recorded on a git dependency's resolution (`resolution: {type: git, repo, commit, integrity: sha512-…}`) is no longer treated as a checksum. pnpm never verifies a git checkout against such a hash — the commit pins the content — so it is now dropped when the lockfile is rewritten, and `pnpm sbom` no longer republishes it as a CycloneDX/SPDX checksum. Lockfiles carrying one also load again instead of failing with `ERR_PNPM_BROKEN_LOCKFILE` [#13042](https://github.com/pnpm/pnpm/issues/13042).

  `pnpm sbom` now also publishes the checksum of a `type: binary` runtime archive, which pnpm does verify.

- A git dependency whose `git ls-remote` fails now reports the `ERR_PNPM_GIT_RESOLVE_FAILED` code, naming the dependency instead of printing a bare `git` invocation, with credentials in the repository URL redacted. A specifier that does not ask for SSH resolves over HTTPS, because the URL recorded in the lockfile has to work on every machine that installs it, so the error explains how to substitute the transport on a machine that can only reach the host over SSH (`git config --global url."git@<host>:".insteadOf "https://<host>/"`) [#13743](https://github.com/pnpm/pnpm/issues/13743).

  A missing `git` executable is reported as one, instead of surfacing the raw failure to start the process.

  Credentials embedded in a git specifier are redacted from the "Could not resolve \<ref\> to a commit of \<repo\>" errors too.

  Resolving a public repository makes one `git ls-remote` round-trip instead of two.

- `pnpm install` after moving a dependency between `dependencies`, `devDependencies`, and `optionalDependencies` now updates the lockfile in place instead of re-resolving the whole dependency graph [#13696](https://github.com/pnpm/pnpm/issues/13696).

- `--ignore-pnpmfile` is accepted again, on every command pnpm takes it on: `install`, `add`, `update`, `dedupe`, `fetch`, `unlink`, `deploy`, `ci`, and `install-test` [#13808](https://github.com/pnpm/pnpm/issues/13808). The flag skips every pnpmfile hook the command would otherwise run: neither the workspace `.pnpmfile.cjs` nor the pnpmfiles of config dependencies are loaded, so no `readPackage`, `updateConfig`, `afterAllResolved`, custom resolver, or custom fetcher runs.

- `syncInjectedDepsAfterScripts` now removes the bin link of a bin the script dropped. Previously only new bins were linked, so a build step that stopped declaring one left its shim behind, pointing at a command that was no longer there.

- Fixed dependency resolution letting the order in which concurrent resolutions finished decide the outcome. When one package was reached from several places, whichever occurrence got there first decided the versions its dependencies were recorded at, so repeated installs of the same project could produce different `pnpm-lock.yaml` files.

- Widening a dependency's range no longer leaves the project on an older version. The lockfile update now points the project at the highest version of that dependency already in the lockfile that satisfies the new range — matching what a full resolution records — instead of keeping the locked version whenever it happened to satisfy, which could leave a duplicate behind. A range change that only an already-locked version satisfies is now also handled without re-resolving [#13778](https://github.com/pnpm/pnpm/issues/13778).

- The lockfile's `time:` section is no longer dropped when `pnpm-lock.yaml` is rewritten. `resolutionMode: time-based` records each direct dependency's publish date there and now reads it back as the fallback for a package whose registry metadata carries no publish date, so a later resolution derives the same cutoff instead of picking different subdependency versions [#13776](https://github.com/pnpm/pnpm/issues/13776).

- `resolutionMode` is no longer ignored when `minimumReleaseAge` is in effect. `lowest-direct` and `time-based` pick the lowest satisfying version of a direct dependency again; previously any active release-age cutoff — including the built-in default — silently forced the highest, so `resolutionMode` only worked when `minimumReleaseAge: 0` was set explicitly [#13752](https://github.com/pnpm/pnpm/issues/13752).

- Adding a package to a workspace no longer forces a full re-resolution when every dependency it declares is already locked for a sibling. The lockfile update writes the new project's importer entry from the versions the lockfile already holds; a dependency no locked version satisfies still reaches the resolver [#13696](https://github.com/pnpm/pnpm/issues/13696).

- Changing a `pnpm.overrides` entry to a version range now updates the lockfile in place when a version the lockfile already holds satisfies the range, instead of re-resolving the whole dependency graph. Only exact versions were handled before [#13696](https://github.com/pnpm/pnpm/issues/13696).

- `pnpm add <pkg>@<version>` and `pnpm update <pkg>@<version>` now move a catalog entry's resolution to the requested version. Previously, when the catalog entry was a range that covered the requested version but resolved to a different one, the request was dropped silently: nothing was installed, nothing was written, and no error was raised.

- Changing a parent-scoped `pnpm.overrides` entry (`"parent>child": "2.0.0"`) now updates the lockfile in place instead of re-resolving the whole dependency graph. Only the named parent's dependency moves; every other package keeps the version it had [#13795](https://github.com/pnpm/pnpm/issues/13795).

- Reduced peak memory usage while resolving peer dependencies. Workspaces with large, deeply peer-dependent dependency graphs could need gigabytes to install; the same install now needs meaningfully less.

- Removing a dependency, or moving one to another already-locked version, no longer re-resolves the whole dependency graph just because some package resolves a peer with the same name. The lockfile update now compares the peer suffixes against the exact `name@version` the removal severed, so a suffix that names a different — still present — version of that dependency is left alone [#13781](https://github.com/pnpm/pnpm/issues/13781).

- `pnpm install` no longer re-resolves dependencies inside a subtree the lockfile pinned when another dependency reaches the same package. Those packages kept their locked versions in `node_modules` while `pnpm-lock.yaml` recorded newer ones, so an install could quietly move a transitive dependency — including across a major version — without anything asking it to.

- A `.pnpmfile.cjs` `readPackage` hook that rewrites one of a project's *own* dependency specifiers is now honored: rewriting `"is-positive": "^1.0.0"` to `1.0.0` installs 1.0.0 and records `specifier: 1.0.0` for the importer. Previously the hook was applied only to the manifests of resolved dependencies, so a project's own specifier resolved against the raw range from `package.json` [#13769](https://github.com/pnpm/pnpm/issues/13769).

- `pnpm prune` now prints the `Scope: all N workspace projects` line when run inside a workspace, as it prunes every project of the workspace.

- Removing a package from a workspace now drops its importer entry from `pnpm-lock.yaml`, along with the dependencies only it needed. Previously the entry survived every later install, which kept those dependencies reachable and made the lockfile diverge from the one the TypeScript CLI writes [#13783](https://github.com/pnpm/pnpm/issues/13783).

- `pnpm remove` no longer re-resolves the dependency graph. The removed dependency's entries are dropped from `pnpm-lock.yaml` and anything they made unreachable is pruned, without registry access. The install still falls back to a full resolution when a surviving package resolves a peer dependency through the removed one.

- An install sharing a global virtual store no longer removes an incomplete package directory that another importer is still writing, which could fail with `failed to remove existing directory ... prior to swap: Directory not empty`. Such a directory is now repaired in place, and a package file left damaged by an interrupted install is restored instead of being kept.

- `pnpm sbom` no longer emits components for optional platform-specific dependencies that cannot be installed on the current platform (for example, the native `@rolldown/binding-*` variants for other operating systems). Such packages are present in the lockfile but are never downloaded, so their license (and other metadata) could not be resolved and they appeared in the SBOM without one. `pnpm sbom --lockfile-only` still describes the whole lockfile graph, which is platform-independent by design.

- Kept unselected workspace link targets shallow during filtered isolated installs.

- Reduced peak memory usage while resolving peer dependencies further: each occurrence in the dependency tree now shares its package id with the edge it came from instead of owning a copy of it.

- An `ssh://` git dependency pointing at a bracketed IPv6 host, such as `ssh://[::1]/repo.git`, is resolved now. Its colons were read as an SCP-style path separator, which turned the address into `[:/1]` and left the specifier unresolvable. Applies to both the TypeScript CLI and pacquet.

  In the TypeScript CLI, an `ssh://` git dependency written without user info — `ssh://git.example.com/team/repo.git`, `git+ssh://git.example.com:2222/team/repo.git` — no longer fails with `TypeError: Cannot read properties of undefined (reading 'includes')`. Only the `user@host` form worked before.

- Commands in a project that pins a pnpm version no longer read the whole `pnpm-lock.yaml` to get at the leading env document. Reading stops at the end of that document, so the cost no longer grows with the rest of the lockfile: reading the env document out of an 8 MB lockfile takes ~15µs instead of ~390µs.

- An install that drops the last dependent of a patched package no longer updates the lockfile in place and succeeds silently. Removing a dependency, widening `ignoredOptionalDependencies`, or adding a removal override could each prune the package while the patch stayed configured; such an install now falls back to a full resolution, which reports the unused patch with `ERR_PNPM_UNUSED_PATCH`. Under `allowUnusedPatches`, where the lockfile update is kept, the same install now warns that the patch went unused instead of saying nothing [#13827](https://github.com/pnpm/pnpm/issues/13827).

## 12.0.0-rc.3

### Patch Changes

- Command shims on POSIX again `exec` a target that has no interpreter — a runtime binary such as the managed Node.js, or any bin without a shebang — instead of waiting on it. A shim that waited reported a target killed by a signal as exit code `128+N` (for example `137` for `SIGKILL`), so callers that distinguish a signal death from an exit code, such as CI runners and process supervisors, saw the wrong outcome.

## 12.0.0-rc.2

### Minor Changes

- Globally installed bins can now follow the project you run them in. The new `globalShims` setting is a record of package names to policies that selects which globally installed packages get project-aware shims; it defaults to `{ node: true, deno: true, bun: true }` and merges key-wise, so `globalShims: { bun: false }` switches one default off and `globalShims: { typescript: true }` adds another package. With the default, a project that pins Node.js through `devEngines.runtime` or `engines.runtime` gets the pinned stable release — authenticated against the Node.js release-team signatures — downloaded on first use and run whenever you type `node` inside the project, with no shell hooks. Candidates that are not signature-verified (Deno, Bun, Node.js prereleases, and ordinary package bins you enable) ask "Do you trust this project?" once per candidate and remember the answer machine-locally; the record values name the policy per package: `"auto"` (or its shorthand `true`) defers to artifact authentication, `"always"` switches without ever asking (useful in CI), and `"prompt"` always asks, even for authenticated candidates. Set `globalShims: false` to disable the feature, or `PNPM_SHIM_BYPASS=1` to bypass it for one invocation. On Windows, programs can keep spawning the global `node.exe` directly, without a shell.

### Patch Changes

- `pnpm dlx` and `pnpm create` no longer fail with "Failed to read patch file" in a project that has `patchedDependencies`. As in pnpm, the package dlx runs is installed unpatched.

- Reduced the warm startup overhead of project-aware managed runtime shims.

- `ng build` and `nuxt build` now work under the global virtual store: pnpm's built-in compatibility extensions add the `tslib` dependency that `@angular/build` uses without declaring and the `unplugin` dependency that `@nuxt/vite-builder` v4 uses without declaring.

- The automatic `packageManager` version switch works again on registries whose tarball URLs point at a different host than the registry itself (load-balanced feed proxies, Artifactory-style mirrors). Package-manager entries are now always recorded with integrity-only resolutions — the download URL is derived from the trusted bootstrap registry instead — and entries persisted in an invalid shape by an earlier pnpm are discarded and re-resolved instead of failing every command [#13619](https://github.com/pnpm/pnpm/issues/13619).

- Registries that serve no npm signature metadata (private mirrors and feed proxies commonly strip `dist.signatures`) no longer break the automatic `packageManager` version switch and `pnpm self-update` [#13147](https://github.com/pnpm/pnpm/issues/13147). When the configured registry cannot provide a verifiable signature, pnpm now fetches the signature from `registry.npmjs.org` and verifies it against the same embedded npm keys over the installed integrity — which proves exactly the same thing. If no signature can be obtained from either source (for example, both are unreachable, or the registry publishes only a `shasum`), pnpm proceeds with a warning instead of failing, but only when the packages resolve through a registry configured in the user's own (non-project) configuration; the download stays pinned by the lockfile integrity, and a signature that exists but does not validate still fails the switch.

- `pnpm setup` no longer makes Node.js print a `MODULE_TYPELESS_PACKAGE_JSON` warning about `dist/worker.js` on every command. The `package.json` it writes next to a standalone executable now declares `"type": "module"`.

## 12.0.0-rc.1

### Major Changes

- Git dependencies on known hosts (GitHub, GitLab, Bitbucket) are now treated as identities rather than transport choices. Every representation of the same repository — `github:owner/repo`, `owner/repo`, `git+https://…`, `git+ssh://git@…` — resolves through the host's canonical HTTPS URL, and the lockfile never records an SSH URL for them. Repositories whose archive endpoint is anonymously reachable resolve to the host's archive (fast tarball download); all others resolve to a `git` clone of the canonical HTTPS URL, which every machine with access to the repository can fetch.

  To reach a private hosted repository over SSH, configure the machine (not the project) with git's own URL rewriting, for example:

  ```sh
  git config --global url."git@github.com:".insteadOf https://github.com/
  ```

  pnpm shells out to `git`, so the rewrite applies to all of pnpm's git operations automatically. URLs of unknown hosts (self-hosted servers) are unaffected and keep their exact URL, including SSH. URLs with embedded credentials are also kept verbatim and never resolve to a host archive.

  This removes the network probing that previously decided between HTTPS and SSH at resolution time, which could record a transport that only worked on the machine that happened to run the resolution (e.g. an SSH URL that broke CI runners without SSH keys).

### Minor Changes

- Added interactive group selection to `pnpm update --global --interactive`.

- `pnpm root -g` and `pnpm bin -g` now print warnings to stderr instead of stdout, so their stdout stays a clean, machine-readable path. Previously, running either command with `--global` in a project that pins a package manager (e.g. via the `packageManager` field) printed a warning like `[WARN] Using --global skips the package manager check for this project` ahead of the path, breaking programs that capture the output as a path [#13672](https://github.com/pnpm/pnpm/issues/13672).

  In pnpm 12, `pnpm root -g` and `pnpm prefix -g` are now supported (they previously failed with `ERR_PNPM_CLI_ROOT_GLOBAL_UNSUPPORTED` / `ERR_PNPM_CLI_PREFIX_GLOBAL_UNSUPPORTED`), and the reporter output of `dlx`, `create`, `config`, `sbom`, `with`, `store`, `prefix`, `root`, and `bin` goes to stderr, matching pnpm 11.

### Patch Changes

- Fixed `minimumReleaseAge` fallback for custom dist-tags so the selected version does not exceed the registry’s original tag target.

- Removing a dependency from `package.json` and reinstalling no longer re-resolves the dependency graph. The importer's entry is dropped from `pnpm-lock.yaml`, anything it made unreachable is pruned, and a catalog entry that loses its last referent is removed — all without registry access. Installs still fall back to a full resolution when a package that stays resolves a peer dependency through the removed one, since that would change the surviving package's entry rather than only prune.

- Dependencies declared with an empty version range (`"adler-32": ""`) install again instead of failing with `ERR_PNPM_NO_MATCHING_VERSION` [#13673](https://github.com/pnpm/pnpm/issues/13673). An omitted range means "any version", as it does in npm and pnpm v11, so packages that publish one — such as `js-xlsx`, `codepage`, and `ssf` — no longer need an `overrides` entry to install.

- Changing a catalog entry to a different exact version no longer re-resolves the dependency graph. The package is replaced in `pnpm-lock.yaml` directly, reusing the same check the `pnpm.overrides` fast path applies: every locked dependency of the package must still satisfy the new version's manifest. Installs fall back to a full resolution when anything other than the catalog reaches the package — an importer that depends on it directly, or another package that depends on it — since the graph would then need both versions.

- Fixed installs under `enableGlobalVirtualStore` failing with `failed to remove existing directory ... prior to swap: Directory not empty` (or `No such file or directory`) when peer variants of an injected `file:` dependency hash to the same slot. The link pass now materializes each unique slot directory once instead of racing one force-mode import per peer variant against the same path.

- The held-back-update warning printed by `pnpm update` no longer fires when `minimumReleaseAge` is the actual reason a newer version was not picked. The warning's baseline now applies the same maturity cutoff as the pick itself, so it no longer wrongly attributes the hold-back to "your manifests and already installed dependencies" or recommends an override that would defeat the age gate. See pnpm/pnpm#13071.

- Changing `autoInstallPeers`, `dedupePeers`, `peersSuffixMaxLength`, `excludeLinksFromLockfile`, or `injectWorkspacePackages` no longer re-resolves the dependency graph when the lockfile proves the setting cannot affect it: no package or project declares a peer dependency for the peer settings, and no project depends on a directory or on another workspace project for the link and injection settings. The new setting is recorded in `pnpm-lock.yaml` and the install proceeds from the existing resolution. Every other case still falls back to a full resolution.

- Adding, editing, or removing an entry in `patchedDependencies` no longer re-resolves the dependency graph. Resolution never reads a patch — it only records the patch file's hash against the package it matches — so the install now rewrites the affected entries in `pnpm-lock.yaml` and materializes the patched package from the store instead. Installs still fall back to a full resolution when the patched package is reachable as a peer dependency, and when the new configuration would leave a patch unused while `allowUnusedPatches` is off, so `ERR_PNPM_UNUSED_PATCH` is still reported.

- `pnpm install` again records immature versions picked under `minimumReleaseAge` (when `minimumReleaseAgeStrict` is off) in `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`, so a later frozen install of the same lockfile passes verification [#13687](https://github.com/pnpm/pnpm/issues/13687).

- Reduced peak install memory: cached registry metadata is now read on demand from the on-disk metadata cache instead of being held in memory for the whole resolution. Resolving a large peer-heavy graph (`@teambit/bit`) peaks at about 1.3 GB instead of 3.2 GB, and a full cold install of it stays under 2 GB [#13681](https://github.com/pnpm/pnpm/issues/13681).

- Lockfile verification now honors offline mode by using cached registry metadata instead of reaching the registry. When the required metadata is not available locally, verification reports the same `ERR_PNPM_NO_OFFLINE_META` condition used by offline resolution.

- POSIX shell shims now follow symbolic links before computing `basedir`, preventing execution failures when a shim is invoked via an external symlink on `PATH` [#13405](https://github.com/pnpm/pnpm/issues/13405).

- Speed up installs after adding `ignoredOptionalDependencies` patterns by removing newly ignored optional dependencies and pruning packages that are no longer reachable without resolving the dependency graph again.

- `pnpm self-update` no longer fails with `the installed pnpm wrapper is missing` when the global packages directory carries a `pnpm-workspace.yaml` of global settings (written there when a global install persists an `allowBuilds` decision). The engine install stays anchored to its own install directory instead of walking up and adopting that file as its workspace root. The `pnpm dlx` cache install gets the same anchoring, so a stray `pnpm-workspace.yaml` above the cache directory can no longer break it [#13697](https://github.com/pnpm/pnpm/issues/13697).

- Reduced peak memory usage and allocation churn during peer dependency resolution on workspaces with many peer-dependency issue occurrences [#13681](https://github.com/pnpm/pnpm/issues/13681).

- `pnpm update` without saving no longer records a version that the manifest's range excludes. The kept range stays authoritative: a requested version outside it is skipped with a warning, and a requested range, a dist tag, or `--latest` resolves within it instead of past it. Previously each of these could write a lockfile entry that contradicted its own specifier, which the next `pnpm install --frozen-lockfile` rejected with `ERR_PNPM_OUTDATED_LOCKFILE` [#12764](https://github.com/pnpm/pnpm/issues/12764).

- `pnpm version -r --json` now outputs `[]` instead of human-readable text when no pending changes exist [`pnpm/pnpm#13217`](https://github.com/pnpm/pnpm/issues/13217).

- On Windows, installation no longer fails with "A required privilege is not held by the client. (os error 1314)" when symlink creation requires elevation (e.g. Developer Mode is off) — pnpm now falls back to NTFS junctions in that case. Additionally, `pnpm clean` and `pnpm deploy --force` no longer fail with "Access is denied. (os error 5)" when removing the package links inside `node_modules` [#13694](https://github.com/pnpm/pnpm/issues/13694).

## 12.0.0-rc.0

### Minor Changes

- Running `pnpm setup`, `pnpm self-update`, or a command that modifies the global installation (such as `pnpm add --global`) through `sudo` now fails with `ERR_PNPM_SUDO_NOT_SUPPORTED` instead of silently operating on the root user's home directory. pnpm keeps global packages and configuration in the invoking user's home directory, so these commands never need root permissions. Read-only global commands (such as `pnpm bin --global`) still work under sudo.

### Patch Changes

- Archive entries whose paths use `\` as a separator are now read the same way pnpm reads them. A nested path spelled `bin\tool.js` by Windows publishing tooling resolves to `bin/tool.js`, and a path traversal spelled with backslashes is rejected instead of being stored verbatim.

- Fixed `file:` dependencies not being re-copied when their source directory changed. A `file:` dependency is copied into the store at install time rather than symlinked, so editing the local package's files and running `pnpm install` again left the previous copy in place — the lockfile is unchanged by such an edit, so the install treated the tree as up to date.

- Write blocked-build approval scaffolding to the discovered workspace manifest when using per-project lockfiles.

- Concurrent installs sharing a global virtual store no longer fail with `failed to remove existing directory ... prior to swap: Directory not empty`, and no longer briefly remove a package directory another process is reading.

- Fixed `link:` dependencies under `enableGlobalVirtualStore` so linked children are materialized and slots remain isolated by their resolved link targets.

- A headless install (`--frozen-lockfile`) now creates the command shims for a publicly hoisted workspace package's `bin`, matching what a normal install already did and what pnpm's own headless install does. Previously those shims were missing until the next non-frozen install.

- `pnpm fetch`, and any install run with `virtualStoreOnly`, no longer writes a `.pnp.cjs` loader under `nodeLinker: pnp`. These installs populate the virtual store without linking the project, so the loader would have claimed the project resolves out of a store it was never linked into. The importer links and `node_modules/.package-map.json` were already skipped; the PnP loader now follows the same rule.

- Prevent pnpm from removing project files when `modulesDir` resolves to the project root.

- Fixed `pnpm install` ignoring a `pnpm-lock.yaml` that carries a leading env lockfile document when the file has CRLF line endings or a UTF-8 byte order mark, as a `core.autocrlf` checkout on Windows produces. The lockfile was reported as broken with `multiple YAML documents detected` and every dependency was re-resolved from the registry [#13606](https://github.com/pnpm/pnpm/issues/13606).

- When no directory above the project accepts a hard link — inside an AI agent sandbox that only grants write access to the project, or a container with just the project mounted writable — the default store is now created at `<project>/node_modules/.pnpm-store` instead of in the pnpm home directory. In those environments the home store is either read-only or on another volume, which forces every package to be copied instead of hard linked [#13525](https://github.com/pnpm/pnpm/issues/13525).

- A stray non-directory entry in `node_modules` no longer fails an install. Files placed next to the installed dependencies are skipped rather than reported as an unreadable manifest.

## 12.0.0-beta.4

### Minor Changes

- **Security fix.** Affects projects using `namedRegistries` on pnpm 11.1.0–11.19.x. It is **semi-breaking** for those projects — see "If you use named registries" below.

  The lockfile recorded no marker for which registry a package came from. Packages were keyed by `name@version` alone, and entry lookup went through `refToRelative(ref, name)`, so a dependency you declared against one registry could be satisfied by an entry that was actually resolved from another. When two registries served the same name and version, both collapsed onto a single `packages:` entry and whichever resolved first decided the tarball every consumer got.

  That is a package-substitution risk: a package you expect from your private registry could be installed from a different registry that publishes the same name and version, and the lockfile recorded nothing that would let you tell.

  Packages resolved from a named registry are now recorded under registry-qualified keys (`<name>@<registryName>:<version>`, e.g. `foo@work:1.0.0`), so each registry gets its own entry and the lockfile pins which one a dependency came from.

  The lockfile format version is unchanged. Registry-qualified keys appear only for packages resolved from a named registry, so a project that does not use `namedRegistries` sees no difference, and older pnpm versions keep reading the file.

  ### If you use named registries

  Your next non-frozen install re-keys those entries, which shows up as a lockfile diff. Commit it — that diff is the fix being applied. Review it: an entry that moves to a registry you did not expect is worth investigating.

  Everyone working on the project should be on this version or newer before you do. An older pnpm reads the re-keyed lockfile fine — frozen installs are unaffected — but it does not produce registry-qualified keys itself, so any install that updates the lockfile writes those entries back to the old shape, and the next install on a current pnpm re-qualifies them. The result is a lockfile that flips back and forth, and while it is in the old shape the project is exposed again. Because the lockfile format version is deliberately unchanged, pnpm cannot detect this and warn you about it.

  There is no setting to keep the old behavior: the old shape is the vulnerability.

  Tarball URLs that follow the standard registry layout are no longer written to the lockfile for named-registry packages; they are recomputed from the `namedRegistries` setting on demand.

  To use named registries, map your aliases in `pnpm-workspace.yaml`:

  ```yaml
  namedRegistries:
    work: https://npm.enterprise.example.com/
  ```

  ### New built-in `npmjs:` alias

  `npmjs:` now resolves to `https://registry.npmjs.org/` with no configuration, alongside the existing `gh:` alias for GitHub Packages. It pins a dependency to the public registry even when `registry` points elsewhere, such as an internal proxy:

  ```json
  { "dependencies": { "left-pad": "npmjs:^1.3.0" } }
  ```

  `npm:` cannot do this — it is the alias protocol (`npm:<name>@<range>`) and resolves through whatever `registry` points at.

  **If you mirror or proxy npmjs, point the alias at your mirror:**

  ```yaml
  namedRegistries:
    npmjs: https://npm.internal.example.com/
  ```

  Built-in registry URLs are also the prefixes a lockfile's recorded tarball URL is matched against when pnpm verifies a package. Without the override, an entry whose tarball URL is on `registry.npmjs.org` is verified against the public registry rather than your mirror. This only affects lockfiles that record such URLs — a canonical URL for your configured registry is omitted from the lockfile and unaffected — and only when a tarball-URL, `minimumReleaseAge`, or `trustPolicy` check runs. Overriding the alias is the same escape hatch GHES users already have for `gh`.

  Every alias the lockfile references must stay in `namedRegistries`: reading an entry whose alias is gone fails with `ERR_PNPM_MISSING_NAMED_REGISTRY` rather than silently falling back to the default registry, since that would fetch a different package. Renaming an alias re-resolves the packages that used it.

  Named registry aliases that shadow a reserved dependency specifier prefix (`file`, `link`, `workspace`, `runtime`, `npm`, `jsr`, ...) are now rejected with `ERR_PNPM_RESERVED_NAMED_REGISTRY_NAME` instead of being silently shadowed by the corresponding resolver.

  `pnpm licenses` and `pnpm sbom` now keep the two artifacts apart as well: license records carry the registry alias, and SBOM components carry the purl `repository_url` qualifier.

### Patch Changes

- Installing a workspace whose projects auto-install peer dependencies is substantially faster. Each round of the peer-hoist loop no longer scans the whole workspace once per project, so the cost of resolution grows with the workspace instead of with its square.

- Installing a dependency chain whose packages carry peer dependencies no longer expands exponentially with the depth of the chain. A single project with a single such dependency could exhaust memory before finishing; it now resolves in tens of megabytes.

- Fixed non-deterministic resolution on multi-project workspaces: two consecutive installs of the same inputs could bind peer-suffixed packages to different (still valid) providers, rewriting `pnpm-lock.yaml` on every install [#13567](https://github.com/pnpm/pnpm/issues/13567).

- Installing a workspace now produces the same `pnpm-lock.yaml` every time. Two installs of the same workspace could previously bind a peer dependency to a different — still valid — version, which changed the lockfile without anything in the project changing.

- An empty `http-proxy`, `https-proxy`, `proxy`, or `no-proxy` value — from the `.npmrc`, `pnpm-workspace.yaml`, the CLI, or the `HTTP_PROXY` / `HTTPS_PROXY` / `PROXY` / `NO_PROXY` environment variables — no longer fails the install with `ERR_PNPM_INVALID_PROXY`. Empty settings read as unset, so a shell exporting `HTTP_PROXY=` disables the proxy, and an empty `proxy=` in the `.npmrc` no longer suppresses `HTTPS_PROXY` [#13533](https://github.com/pnpm/pnpm/issues/13533).

  `proxy=false` in the `.npmrc` or `proxy: false` in `pnpm-workspace.yaml` now turns proxying off instead of being read as a proxy host named `false`. `false` and `null` on `https-proxy` / `http-proxy` / `no-proxy` read as unset, and on the command line they are ordinary host names, since a flag carries its value verbatim.

- The env lockfile no longer pins `@pnpm/exe` alongside `pnpm` when the wanted pnpm version is 12 or newer. From v12 the unscoped `pnpm` package is itself the native executable, so `@pnpm/exe` is not published for it and resolving it would fail. The engine identity check now verifies the native binary through whichever package ships it.

- Resolution on large peer-heavy workspaces got faster: a Bit workspace with 114 projects and ~21,000 lockfile entries resolves in ~13.4s instead of ~16.0s. The resolved dependency graph is unchanged.

- Fixed nondeterministic peer bindings in large multi-project workspaces.

- Resolving a workspace whose dependency chains are deep is faster: deciding which missing peer dependencies another project's resolution already covers now answers once per shared chain segment instead of once per report.

- Peer resolution on large workspaces got faster: each hoist round now refreshes its view of the dependency graph from what the round changed instead of re-reading every resolved package. The resolved dependency graph is unchanged.

- `pnpm install` no longer crashes on a machine whose system certificate store is empty or absent — for example a minimal container or build sandbox that ships no CA certificates [#13588](https://github.com/pnpm/pnpm/issues/13588). Such a system now falls back to the Mozilla root certificates bundled into the binary, the same set Node.js ships, so both offline and online installs work again. Certificates from the system store, `NODE_EXTRA_CA_CERTS`, and the `.npmrc` `ca` / `cafile` settings keep taking precedence whenever any of them is available.

- Fixed the order in which pnpm matches a lockfile's recorded tarball URL against known registry URLs. Two registry URLs of equal length were previously ordered arbitrarily, so which one a tarball URL matched could differ between runs.

- `pnpm login` / `pnpm adduser` now read the `scope` setting from `pnpm-workspace.yaml`, the global `config.yaml`, and the `PNPM_CONFIG_SCOPE` environment variable, not only from the `--scope` command-line flag. When `scope` is configured, the granted token is keyed to that scope and the scope-to-registry mapping is recorded. `--scope` still takes precedence when both are set. Note that `scope` in an `.npmrc` is not read — pnpm keeps only auth and registry keys from that file.

- Resolution spends less time in its final peer pass: the package-name cycle graph it consults is now derived once per package instead of once per occurrence of that package.

- npm's `--prefix` is accepted as a spelling of `--dir`, and `--store` as a spelling of `--store-dir`, so `pnpm --prefix ../ run test` no longer fails with "unexpected argument '--prefix' found" [#13583](https://github.com/pnpm/pnpm/issues/13583).

- pnpm now ships `node-gyp` again, so packages whose install scripts shell out to it build out of the box. Previously they failed with `spawn node-gyp ENOENT` unless a `node-gyp` was already on `PATH` — affecting `node-gyp-build` with no matching prebuild, `node-pre-gyp`, a plain `"install": "node-gyp rebuild"`, and any package shipping a `binding.gyp` without an install script. As in pnpm 11, the whole `node-gyp` dependency tree is resolved from pnpm's own lockfile when pnpm is released, so it is frozen per release rather than resolved on your machine, and `npm_config_node_gyp`, a workspace `node-gyp`, and a package's own `node-gyp` dependency all still take precedence.

## 12.0.0-beta.3

### Patch Changes

- With `excludeLinksFromLockfile` enabled, a `link:` dependency pointing inside the workspace is no longer treated as an external link when it resolves a peer dependency, so the peer suffixes it produces stay identical to an install with the setting off. Injected (`file:`) workspace dependencies are no longer affected by the setting either [#13556](https://github.com/pnpm/pnpm/issues/13556).

- A registry dependency is now always recorded in `pnpm-lock.yaml` with an integrity hash, including under `--lockfile-only`. Packages from a registry that publishes no subresource-integrity metadata — `https://node-registry.bit.cloud/`, for one — were recorded without one, so the next `pnpm install --frozen-lockfile` failed with `ERR_PNPM_MISSING_TARBALL_INTEGRITY` [#13547](https://github.com/pnpm/pnpm/issues/13547).

- Dependency resolution is faster: package metadata is now filtered once per packument instead of once per dependency edge when `minimumReleaseAge` is active, and parsed semver versions and ranges are reused instead of re-parsed on every comparison.

- Reduced memory use when resolving peer-heavy dependency graphs and prevented nested hoisted graphs from expanding into excessive dependency paths.

## 12.0.0-beta.2

### Patch Changes

- `pnpm install` no longer fails when `pnpm-lock.yaml` exists but cannot be parsed. Matching the TypeScript CLI, the install now prints an "Ignoring broken lockfile" warning, resolves dependencies from the manifests, and rewrites the lockfile. `--frozen-lockfile` still fails on a broken lockfile.

- Fresh installs no longer download the tarballs of platform-specific optional dependencies that don't match the current platform.

## 12.0.0-beta.1

### Minor Changes

- Made peer resolution significantly faster in large multi-importer workspaces (a 114-importer workspace's resolution dropped from ~77s to ~36s): importers whose hoist rounds converged no longer re-walk their dependency forest every round, later rounds walk only newly added direct dependencies, ownership handovers with an unchanged peer context no longer invalidate shared walk caches, and the resolver's internal hash maps use a faster hash. Peer dependencies provided by multiple candidate versions may resolve to a different (still range-valid) provider than before, which can shift some peer-variant suffixes in `pnpm-lock.yaml` once.

- `pnpm login` no longer requires an interactive terminal when the registry supports web-based login: without a TTY it prints the authentication URL (skipping the QR code and the "Press ENTER to open the URL in your browser" prompt) and polls the registry until the browser approval completes. Only the classic username/password login still fails with `ERR_PNPM_LOGIN_NON_INTERACTIVE` in a non-interactive terminal.

- Added `projects[].dependencyManifest` to the `@pnpm/napi` install options: the manifest a workspace project exposes when it is resolved as a dependency of another importer (an injected instance). Hosts that pre-transform their importer manifests no longer need a `readPackage` hook to substitute the raw manifest, and per-manifest deletions are expressed through the existing `overrides` removal syntax (`"pkg": "-"`), so resolution can run without any JS round trips.

- The `save-prefix` setting now accepts `=`: newly added dependencies are saved with an explicit `=` operator (`=1.2.3`) instead of the setting being silently treated as the default `^`.

### Patch Changes

- `allowBuilds` entries can now approve git-hosted packages that pnpm downloads as a tarball, such as `github:` dependencies (which are fetched from `codeload.github.com` rather than cloned), by their repository URL without the resolved commit hash. This matches the hashless `git+` matching already supported for cloned git dependencies. For example:

  ```yaml
  allowBuilds:
    "foo@git+https://github.com/org/foo.git": true
  ```

  This approves the package whether pnpm clones it or downloads a tarball, so the entry no longer has to be updated every time the pinned commit changes. GitLab and Bitbucket tarball downloads are matched the same way. Approving or denying a specific resolved commit by its full tarball dep path continues to work.

- Fixed a severe slowdown resolving large workspaces against registries whose abbreviated metadata lacks per-version `time` fields (such as `node-registry.bit.cloud`) while `minimumReleaseAge` is active. The resolver upgraded the abbreviated packument to full metadata once per *dependency edge* instead of once per package — re-requesting the same packument from the registry hundreds of times in a single install — and a `304 Not Modified` answer was never remembered, so the round trip repeated forever. The upgrade outcome is now cached for the rest of the install. On a 345-project workspace this cut a full resolution from 105 s to 36 s.

  Also stopped the resolver from deep-copying every workspace project manifest on each internal resolve-options clone (the workspace-packages map is now shared by reference).

- Aligned deprecated package warnings with pnpm by reporting each package only on its first resolution and shortening direct dependency warnings during recursive installs.

- `pnpm outdated --include-github-actions` no longer blocks on an interactive git credential prompt when a workflow uses a private action repo.

- `pnpm add` and `pnpm update` now honor the `saveExact` setting; previously only the `--save-exact` flag was respected.

- Fixed parsing very large lockfiles that exceed the YAML parser's default 64 MiB scalar-text budget.

- Fixed parsing large lockfiles that exceed the YAML parser's default structural budget [pnpm/pnpm#12857](https://github.com/pnpm/pnpm/issues/12857).

- Fixed writing lockfiles with dependency paths longer than 1024 characters (long peer suffixes in large workspaces): such keys are now emitted in explicit `? <key>` form, matching the TypeScript CLI. Inline keys of that length are invalid YAML, so pnpm could not re-read the lockfile it had just written and every subsequent install re-resolved from scratch.

- Prevented `minimumReleaseAge` from replacing `latest` with a SemVer-greater version than the registry tag target [#13034](https://github.com/pnpm/pnpm/issues/13034).

- Installs driven through `@pnpm/napi` got three fixes for large workspaces: the `readPackage` hook is now dispatched to JavaScript in batches instead of one event-loop roundtrip per manifest, the `dedupePeers` setting can be passed through the install options (so an existing lockfile generated with it is no longer treated as outdated), and version-pinned dependencies are served from the metadata mirror without queueing behind concurrent registry refreshes of the same package.

- Fixed the `overrides` block of `pnpm-lock.yaml` being rewritten in a random order on every install performed through `@pnpm/napi`. The recorded overrides now keep the order they were declared in, so repeat installs no longer churn the lockfile.

- The `TRACE` environment variable now enables engine tracing for `@pnpm/napi` consumers the same way it does for the pnpm CLI, and an invalid `TRACE` filter no longer aborts the process — it prints a warning and leaves tracing off.

- Fixed peer resolution creating far more peer variants than the TypeScript CLI in multi-importer workspaces: a dependency subtree first resolved under one importer no longer hands the peer providers it resolved to every other importer that shares it. Those importers now bind such peers against their own context (or the workspace root), matching the TypeScript resolver. In a large bit.cloud workspace this cut a from-scratch install from 25,534 to 20,791 lockfile snapshots.

- Fixed empty `bundledDependencies` and `bundleDependencies` arrays causing nondeterministic lockfile changes. See pnpm/pnpm#13123.

- Reduced the peer resolution pass's CPU cost on workspaces with many peer dependencies. The walker cloned its parent peer-context maps at every node — twice per node plus once per child — even when a node contributed nothing to them; the maps are now shared copy-on-write and the derived per-child snapshots are reused unless the context actually changed. On a peer-heavy 331-importer benchmark the full resolution dropped from 3.9 s to 2.8 s.

- The install summary no longer prints `(X is available)` when the registry's `dist-tags.latest` is still held back by the active `minimumReleaseAge` policy. The hint only ever names the actual latest tag, so an immature latest suppresses the hint instead of advertising the version pnpm just refused to install [#11698](https://github.com/pnpm/pnpm/issues/11698).

- `pnpm update` keeps the explicit `=` operator of an exact version pin: a dependency saved as `=3.5.1` now updates to `=3.5.2` instead of the bare `3.5.2`. See pnpm/pnpm#13168.

- Preserve a workspace dependency's `link:` entry when a run does not target it — e.g. `pnpm update <other-pkg>` (with or without `--recursive`), or a plain install after a root/catalog dependency change — with `injectWorkspacePackages`, instead of spuriously rewriting it to a peer-suffixed `file:` protocol. See pnpm/pnpm#10433.

- Fixed resolution of a direct dependency declared in both `dependencies` and `devDependencies`: the `dependencies` specifier now wins, matching the TypeScript CLI. The `devDependencies` range was resolved instead, recording a lockfile importer entry whose version did not satisfy its specifier — which failed the lockfile up-to-date check and forced a full re-resolve on every install.

- Kept the lockfile policy verdict ahead of the frozen-install message when package statistics arrive while verification is still running.

- `overrides` are now applied after the `readPackage` hook during resolution, matching the TypeScript CLI's hook order (`packageExtensions` → `readPackage` hooks → `overrides`). A hook that replaced a manifest — such as a host application substituting a workspace project's raw manifest for its injected instances — previously erased the overrides from that manifest, so the resolved graph ignored them.

- Sped up multi-importer resolution by sharing the run-resolved preferred-versions fold across importers. Every importer replayed the whole workspace's resolved-versions history into a private map each hoist round — O(importers × packages) map inserts and string clones — although the peer-hoist pickers only ever look up a handful of missing-peer names. The fold is now maintained once, workspace-wide, and importers materialize just the buckets they query. Full resolution of a 331-importer benchmark workspace dropped from 886 ms to 424 ms (peer-heavy variant: 2.8 s to 2.4 s).

- Fixed quadratic time and memory use when resolving a large multi-project workspace from scratch. Resolving a workspace with hundreds of projects sharing thousands of packages previously took minutes and several gigabytes of memory; it now completes in seconds.

## 12.0.0-beta.0

### Minor Changes

- The Rust engine now reads four more settings from `pnpm-workspace.yaml` and `PNPM_CONFIG_*`, instead of only accepting them as CLI flags:

  - `frozenLockfile` — `pnpm install` grows a `--no-frozen-lockfile` flag so the setting can be overridden in both directions. As in pnpm, it cannot be set in the global `config.yaml`.
  - `savePrefix` — the range operator `pnpm add` saves, still overridable with `--save-prefix` / `--save-exact`.
  - `savePeer` — `pnpm add` also records the new dependency in `peerDependencies`. `pnpm add --no-save-peer` overrides it back off.
  - `saveCatalogName` — the catalog `pnpm add` saves into.

- The Rust engine now supports the `saveWorkspaceProtocol` setting, so `pnpm add <pkg>@workspace:…` writes back the same specifier pnpm does. Under the default `rolling`, a request like `workspace:^1.2.3` is saved as `workspace:^` — a range with no version in it, so bumping the workspace package never has to touch its dependents' manifests. `saveWorkspaceProtocol: true` saves the workspace package's resolved version instead (`workspace:^2.5.0`), and `false` keeps the `workspace:` form only when it was asked for explicitly. Previously the specifier was written back exactly as typed.

- `pnpm update --workspace` is supported: dependencies that a workspace project publishes are re-pointed at the local copies through the `workspace:` protocol. The `saveWorkspaceProtocol` setting is honored — under its `rolling` default an entry becomes `workspace:*`, `workspace:^`, or `workspace:~` (whichever matches the range it already declared), so a sibling's next release does not invalidate it. Naming a dependency that is not in the workspace fails with `ERR_PNPM_WORKSPACE_PACKAGE_NOT_FOUND`, and combining the flag with `--latest` fails with `ERR_PNPM_BAD_OPTIONS`.

  `pnpm update --depth <number>` is now applied per dependency instead of only distinguishing `0` from higher values: a dependency deeper than the given depth keeps its locked resolution, so `pnpm update --depth 0` updates direct dependencies only.

- `pnpm run "/^build:(backend|frontend)$/"` selects every script whose name matches the pattern, in single-project and recursive runs alike [#13322](https://github.com/pnpm/pnpm/issues/13322). Flags on the selector are rejected with `ERR_PNPM_UNSUPPORTED_SCRIPT_COMMAND_FORMAT`, as pnpm does.

- `pnpm self-update` no longer takes any instruction from the project it is run in:

  - pnpm is fetched through the same trusted registry and auth configuration used when switching pnpm versions, so a project `.npmrc` or `pnpm-workspace.yaml` can no longer redirect the download or attach credentials to it, and the project's default `.pnpmfile.(c|m)js` is no longer loaded. Pnpmfiles from trusted sources (the `pnpmfile` setting, the global pnpmfile, config dependencies) still apply.
  - The `minimumReleaseAge` settings in `pnpm-workspace.yaml` no longer affect `self-update`. They still govern the project's own dependencies; for `self-update` the cooldown now comes from the built-in default, your global config, a `PNPM_CONFIG_*` environment variable, or a command-line flag. This fixes `self-update` failing inside a workspace that raises the cutoff while succeeding everywhere else, and stops a repository from either waiving the cooldown or keeping you on an outdated pnpm by raising it.
  - The same applies to the `trustPolicy` settings and to `ci`: a project can no longer weaken the trust check that guards the pnpm download, nor re-enable the confirmation prompt that a CI run suppresses.

  When `self-update` refuses a version that is younger than the cutoff, an interactive run now offers to update anyway; non-interactive runs still fail. CI never prompts, even on a runner that attaches a TTY.

### Patch Changes

- An aliased dependency of a protocol that resolves under its own package name — `jsr:` and the named registries — is recorded in the lockfile importer again. `"bar-from-jsr": "jsr:@pnpm-e2e/bar@1.0.0"` resolved and installed, but the importer stayed empty, so nothing reading direct dependencies out of the lockfile (`outdated`, `update`, `licenses`, dedupe, frozen-install verification) could see it [#13362](https://github.com/pnpm/pnpm/issues/13362).

- An `allowBuilds` entry with the `set this to true or false` placeholder pnpm scaffolds no longer makes every command in that workspace fail with a config-parse error [#13322](https://github.com/pnpm/pnpm/issues/13322). An undecided entry now leaves the package under the default-deny build policy, as pnpm does.

- Two `pnpm install` resolution fixes that made large workspaces such as [Astro](https://github.com/withastro/astro) produce a different `pnpm-lock.yaml` than pnpm 11 [#13334](https://github.com/pnpm/pnpm/issues/13334):

  - A scoped workspace package referenced through the `file:` protocol (`"@test/pkg": "file:./pkg"`) is recorded as a `link:` again instead of being copied in as a `file:` snapshot.
  - `bundledDependencies` / `bundleDependencies` are no longer resolved as dependencies of their own. npm ships them inside the package's tarball, so installing them again added packages the lockfile should not contain (for example `napi-wasm` under `@parcel/watcher-wasm`).

- Executables that a package ships inside its own tarball (`bundledDependencies`) are linked again into that package's `node_modules/.bin`, under both the isolated and the hoisted node linker. A package that declares `bundleDependencies: true` instead of a list of names is now recorded in `pnpm-lock.yaml` the way pnpm 11 records it, and such a lockfile can be read back.

- Aligned `pnpm licenses list --json` package metadata and license-group ordering with the TypeScript CLI.

- Fixed `pnpm --filter <package> run` to list the selected package's scripts and root workspace scripts when no script name is specified.

- Strip Unicode formatting characters from registry- and manifest-derived terminal output.

- Prevented dependency verification before scripts from rewriting an up-to-date lockfile.

- Concurrent commands in a repository that pins `packageManager` no longer race while installing the pinned pnpm version on a cold cache [#13322](https://github.com/pnpm/pnpm/issues/13322). A task runner spawning several `pnpm run` children at once could previously fail with "failed to remove existing directory … prior to swap", or leave a child looking for a binary another process had just unlinked.

- Config-load warnings, such as the warning about install settings left under the `pnpm` field of `package.json`, are printed to stderr instead of stdout [#13361](https://github.com/pnpm/pnpm/issues/13361).

- `pnpm dedupe --check` now reports what deduplication would change: the importer and package snapshot diff, the `ERR_PNPM_DEDUPE_CHECK_ISSUES` error code, and the warning that points at `pnpm peers check` when the install leaves peer-dependency issues behind. `pnpm peers check` is also accepted again — the subcommand spelling used on pnpm.io and in pnpm's own dedupe output — instead of failing with "unexpected argument 'check' found" [#13321](https://github.com/pnpm/pnpm/issues/13321).

- A deprecated package is reported once rather than once per workspace project that depends on it, and is no longer double-counted in the "deprecated subdependencies found" summary when it is also a direct dependency [#13322](https://github.com/pnpm/pnpm/issues/13322). Ignored build scripts are also listed with their `(patch_hash=…)` suffix, so two copies of a package that differ only by an applied patch are distinguishable.

- `pnpm install --frozen-lockfile` no longer re-imports a varying subset of packages on every repeat install of an unchanged project [#13316](https://github.com/pnpm/pnpm/issues/13316). The global-virtual-store directory of a package that takes part in a dependency cycle was derived from an order that changed from run to run, so those packages landed on a fresh slot each time; it is now derived deterministically and matches the directory pnpm itself computes.

- When the pinned `packageManager` engine install cannot take its lock because the store cannot be written to, pnpm now reports that instead of quietly installing without the lock. A lock another process holds is unchanged — it is still waited for.

- Speed up installs after compatible catalog or direct dependency range changes by retaining the locked version without resolving the dependency graph again.

- Speed up installs after safe override changes by reusing unambiguous compatible dependency resolutions, pruning obsolete dependencies, applying independent replacements and removals together, and handling parent-scoped `"-"` overrides without full lockfile resolution.

- Fixed warm side-effects cache reuse for git dependencies.

- Aligned `pnpm dedupe --check` progress and error output with the TypeScript CLI.

- A frozen install now fails when `autoInstallPeers`, `dedupePeers`, or `excludeLinksFromLockfile` has changed since `pnpm-lock.yaml` was written, instead of installing against a lockfile that no longer matches the settings. The error names the drifted setting, as `pnpm install --frozen-lockfile` has always done.

- A repeat `pnpm install --frozen-lockfile` is a no-op again when the project has a platform-incompatible optional dependency. The skipped package is kept in `node_modules/.pnpm/lock.yaml` (`.modules.yaml` is what records the skip), so the install can once more recognize an unchanged tree instead of re-running every lifecycle and dependency build script [#13312](https://github.com/pnpm/pnpm/issues/13312).

- Reject frozen installs when the current pnpmfile does not match the lockfile's `pnpmfileChecksum`.

- Fixed `pnpm licenses list` to report dependencies from every workspace project, exclude unsupported platform packages, and mark development dependencies.

- Setting both `autoInstallPeers: false` and `dedupePeerDependents: false` now leaves missing peers alone, instead of still installing the ones a version elsewhere in the workspace could satisfy.

- Installing a local `file:` directory dependency with the global virtual store enabled no longer fails with `TypeError: Cannot read properties of undefined (reading 'split')` [#13335](https://github.com/pnpm/pnpm/issues/13335).

  Local directory dependencies — `file:` directories and injected workspace packages — now get a global-virtual-store slot of their own per project. They used to share one slot across every project that depended on a directory of the same name, so a project could end up linked to another project's copy of the dependency.

- A missing required peer is no longer auto-installed as a prerelease that its declared range rejects. A package peer-depending on `^29.0.0 || ^30.0.0` next to a `30.0.0-alpha.6` pulled in elsewhere in the graph now resolves a stable `29.x`/`30.x` from the registry instead of adopting the alpha [#13341](https://github.com/pnpm/pnpm/issues/13341).

- A lockfile entry for a git-hosted archive that records no `integrity` installs again instead of failing with `ERR_PNPM_MISSING_TARBALL_INTEGRITY`. Older pnpm versions wrote that shape for dependencies like `"ci-info": "watson/ci-info#f43f6a1c…"`, so any committed lockfile still carrying one could not be installed [#13308](https://github.com/pnpm/pnpm/issues/13308). The archive URL pins a full commit SHA, and pnpm fetches it without an integrity check.

  Every other remote tarball still has to carry an `integrity`, and the refusal now points at the repair: `pnpm clean --lockfile` followed by `pnpm install`.

  Error output no longer repeats the same message once per level of the internal error chain.

- The `Workspace` column of `pnpm update --interactive` now falls back to the project's path when its `name` is only whitespace, as it already did for a missing or empty one — all three render an equally blank label otherwise.

- `pnpm update --interactive` now groups the dependencies it offers by dependency type — `dependencies`, `devDependencies`, `optionalDependencies`, `peerDependencies`, and GitHub Actions each get their own heading — and lays each group out as a column-aligned table with a `Package`/`Current`/`Target`/`URL` header, instead of one flat list.

- `pnpm update --interactive` now measures its table in terminal columns rather than in characters. A package name, workspace name, or version containing wide characters (CJK, most emoji) no longer knocks its row's columns out of line with the rest of the group, and a wide character in a version no longer aborts the command with `Subject parameter value width cannot be greater than the container width` [#13357](https://github.com/pnpm/pnpm/issues/13357).

- `pnpm update --interactive` run inside a workspace now shows a `Workspace` column naming the project each outdated dependency was found in, so the same package outdated in several projects can be told apart.

- Write single-value `libc` package metadata in the same scalar form as pnpm.

- Fixed `pnpm install` silently skipping a local `file:*.tgz` dependency: the package is now extracted into the virtual store, recorded under `packages:` and `snapshots:`, and linked into `node_modules` [#13379](https://github.com/pnpm/pnpm/issues/13379).

- A frozen install whose recorded settings no longer match the configuration — `overrides`, `catalogs`, `patchedDependencies`, and the rest — now fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` naming the one setting that changed, instead of `ERR_PNPM_OUTDATED_LOCKFILE` with the whole map dumped [#13322](https://github.com/pnpm/pnpm/issues/13322).

- Fixed `pnpm install` dropping a package that ships no `package.json` of its own from the lockfile. Such a package is now named after its alias and recorded at version `0.0.0` under `packages:` and `snapshots:`, and its extraction gets the placeholder `package.json` pnpm writes [#13410](https://github.com/pnpm/pnpm/issues/13410).

- Resolve optional peers from versions provided by local workspace packages, omit empty deprecation messages from generated lockfiles, and preserve valid lockfile pins in `pnpm dedupe --check`.

- Aligned license reports, `dedupe --check` progress and spacing, and dependency-verification output with pnpm.

- A `file:` dependency declared by a package that was itself installed from a local directory is now resolved relative to that package's directory, not to the importer's [#13323](https://github.com/pnpm/pnpm/issues/13323). Installing a project whose local dependency depends on a sibling directory (`file:../child`) no longer fails with `Could not install from "…" as it does not exist`, and the snapshot entry for such a dependency is now written as `file:<path>` instead of `<name>@file:<path>`, matching the lockfile pnpm writes.

- `npm_config_user_agent` now carries the configured user agent (`pnpm/<version> …`) in install lifecycle scripts, `pnpm run`, `pnpm exec`, and `pnpm dlx` [#13322](https://github.com/pnpm/pnpm/issues/13322). It was previously unset for install scripts and the bare string `pnpm` elsewhere, which made `preinstall` guards that check for pnpm reject the install.

- An auto-installed *optional* peer is no longer hoisted at a version the workspace root's own dependency on that package excludes. `resolvePeersFromWorkspaceRoot` already made the workspace root's specifier decide which version a missing *required* peer is installed at; the optional-peer picker ignored it and always took the highest version present anywhere in the graph. In a workspace whose root pins `postcss: 8.5.10`, an importer that depends on `webpack` and declares no `postcss` of its own got `postcss@8.5.22` hoisted for `terser-webpack-plugin`'s optional `postcss` peer, leaving two `postcss@8.5.x` instances in the graph [#13320](https://github.com/pnpm/pnpm/issues/13320).

- A missing optional peer dependency is no longer satisfied by a prerelease version that its declared range doesn't accept. `ts-jest`, which declares `@jest/transform` and `jest-util` as optional peers with `^29.0.0 || ^30.0.0`, was bound to `30.0.0-alpha.6` when a `jest` 30 prerelease was elsewhere in the graph, while `jest` itself stayed on 29.

- With `autoInstallPeers: false`, a package's own optional peer dependencies are no longer added to its importer entry in `pnpm-lock.yaml` (and no longer linked into its `node_modules`) when another workspace project happens to resolve a matching version [#13325](https://github.com/pnpm/pnpm/issues/13325).

- `overrides` now also govern peers that pnpm auto-installs. Previously an override only rewrote dependencies declared in a manifest, so a peer nobody declares — installed because `autoInstallPeers` is on — resolved against its declared peer range and could bring in a second copy of the very package the override pinned. For example, with `overrides: { react: npm:react@19.2.0 }` and a lone `lucide-react` dependency, pnpm installed `react@18.3.1`; it now installs the pinned `react@19.2.0` [#13320](https://github.com/pnpm/pnpm/issues/13320).

- `pnpm approve-builds -g` is accepted again, reporting that the command is not supported with global packages rather than failing with `unexpected argument '-g' found`. `approve-builds` was the only command that declared `--global` without its `-g` short form [#13310](https://github.com/pnpm/pnpm/issues/13310).

- The Rust implementation of pnpm has moved from alpha to beta releases.

- A catalog name containing a control character no longer corrupts `pnpm-workspace.yaml`. `pnpm add --save-catalog-name "$(printf 'a\nb')"` (or the same value in `saveCatalogName`) now fails with `ERR_PNPM_WORKSPACE_MANIFEST_WRITER_INVALID_CONTROL_CHARACTER` and leaves the file untouched, matching how the writer already treats `allowBuilds` and `overrides` entries.

- Preserve each direct dependency's locked optional peer context during `pnpm dedupe`.

- Preserve optional peer providers recorded in peer suffixes when `pnpm dedupe` rebuilds a workspace lockfile.

- With `nodeLinker: hoisted`, a workspace project no longer gets its own copy of a dependency whose version already won the workspace-root slot. Only the versions that lost the root slot are nested, matching the pnpm CLI. Previously every project's direct dependency was materialized under that project as well, which gave lifecycle scripts a second copy to run in.

- The Rust engine now warns when `package.json` still declares install settings under the `pnpm` field, which pnpm 10 moved to `pnpm-workspace.yaml`. A project that hasn't migrated its `pnpm.overrides` / `pnpm.packageExtensions` / `pnpm.patchedDependencies` previously saw the settings silently ignored, and only met the downstream symptom. Keys the `pnpm` field never owned are left alone.

- Fixed `pnpm licenses list` and `pnpm licenses ls` parsing and license metadata discovery when using the global virtual store [pnpm/pnpm#13332](https://github.com/pnpm/pnpm/issues/13332) and [pnpm/pnpm#13333](https://github.com/pnpm/pnpm/issues/13333).

- A `pnpm-workspace.yaml` that declares a package pattern whose directory does not exist yet — `packages/*` before the first package is created, say — no longer fails every command with `ERR_PNPM_WORKSPACE_WALK_ERROR`. The pattern now matches no projects, as it does in the JavaScript implementation [#13296](https://github.com/pnpm/pnpm/issues/13296).

- Fixed `catalog:` references failing to resolve when installing through a pnpr server, which errored with "No catalog entry '<name>' was found for catalog 'default'." even though the catalog entry existed. The workspace the server reconstructs from the request has no catalog sections, so the client now sends its catalogs along with the request [#13232](https://github.com/pnpm/pnpm/issues/13232).

- Validate the project's pinned package manager and runtimes before running a command, matching the pnpm CLI:

  - A `packageManager` / `devEngines.packageManager` pin that the running pnpm does not satisfy now fails with `ERR_PNPM_BAD_PM_VERSION` (or `ERR_PNPM_OTHER_PM_EXPECTED` when the project is pinned to another package manager), instead of being silently ignored. The check also runs under corepack, where pnpm cannot switch versions itself, and says so.
  - `devEngines.runtime` / `engines.runtime` entries with `onFail: "error"` or `onFail: "warn"` are validated against the Node.js, Deno, or Bun installed on the system, failing with `ERR_PNPM_BAD_RUNTIME_VERSION`.
  - `pmOnFail` and `runtimeOnFail` are honored as bypasses and can now be passed as `--pm-on-fail=<value>` / `--runtime-on-fail=<value>`, the form the error hints suggest.

  Global commands (`--global`) and commands that do not belong to the project (`store`, `dlx`, `self-update`, …) skip these checks, as does a project pin that only asked pnpm to switch versions when `manage-package-manager-versions` is turned off.

- Arguments after the script or command name now reach the script untouched for `pnpm run`, `pnpm exec`, `pnpm dlx`, and `pnpm with`, matching the JavaScript implementation. Previously `pnpm run build --config.foo=bar` consumed the argument as a pnpm setting instead of forwarding it, and `pnpm run build --silent` handed the script `--reporter=silent` — a token the user never typed [#13302](https://github.com/pnpm/pnpm/issues/13302). Put such flags before the script name (`pnpm run --silent build`) to apply them to pnpm.

- Fixed generated lockfiles to preserve packages' scalar `libc` constraints.

- Preserve a user-provided `TMPDIR` when scripts run with `unsafePerm` enabled; otherwise, continue using the package-local temporary directory.

- Added support for `publishConfig.name`, which publishes a package under a different name than the one its manifest carries in the workspace. Only the published artifact is renamed — dependents, `pnpm-lock.yaml`, and release tooling keep addressing the project by its manifest name — and the new name reaches the packed manifest, the tarball filename, and everything that addresses the package at the registry: the already-published check of `pnpm publish -r`, its registry selection, and the release-planning probes of `pnpm change status` and `pnpm version -r`. This also fixes the changelog of the Rust CLI itself, which is published as `pnpm` from a workspace project named `pacquet`: its release notes were composed under the workspace name and so never made it into the published package [#13345](https://github.com/pnpm/pnpm/issues/13345).

- `pnpm run <script> <args>` now forwards every argument after the script name to the script verbatim, matching the behavior of the JavaScript implementation. Previously the `--` separator was dropped, so `pnpm run test -- --watch` reached the underlying program as `--watch` and failed whenever that program claimed the option itself; arguments spelled like `pnpm run`'s own flags (`-s`, `--if-present`) were also consumed by pnpm instead of reaching the script [#13295](https://github.com/pnpm/pnpm/issues/13295). Pass those flags before the script name (`pnpm run -s test`) to apply them to pnpm.

- `pnpm test`, `pnpm start`, and `pnpm stop` now forward their arguments to the script, matching the pnpm CLI. `pnpm test --watch` and `pnpm start --port 3000` previously failed with a usage error, and `pnpm stop` claimed `--if-present` and `-s` for itself instead of passing them on. As with `pnpm run`, every token after the command name reaches the script verbatim, a `--` separator included.

- Added the `--workspace-root` (`-w`) flag, which runs the command on the root workspace project. `pnpm add -D typescript prettier -w` from a workspace subdirectory now saves to the root `package.json` instead of failing with "unexpected argument '-w' found" [#13031](https://github.com/pnpm/pnpm/issues/13031). Combined with `--recursive`, the flag narrows the run to the root project alone. `-w` may not be used together with `--global`, and may only be used inside a workspace.

- `patchedDependencies` patch files that pnpm applies no longer fail with `ERR_PNPM_PATCH_FAILED`: a hunk whose last line is context in a file with no final newline, and an LF patch against a CRLF file, both apply again [#13322](https://github.com/pnpm/pnpm/issues/13322). A hunk that has drifted from its recorded line numbers is also retried nearby, matching pnpm.

- A peer dependency is now recorded in the lockfile at the version and peer suffix the peer provider actually resolved to. Peers whose provider carried peer suffixes of its own could be recorded against a package instance that no importer installs, leaving an unreachable entry in `snapshots:` and a peer bound to the wrong instance [#13320](https://github.com/pnpm/pnpm/issues/13320).

- A peer dependency that the workspace root already provides is no longer installed a second time. With `resolvePeersFromWorkspaceRoot` enabled (the default), a missing peer is matched against the **workspace root** project's dependencies; it was matched against the dependencies of whichever project was being resolved, so a project that didn't declare the peer itself resolved its own copy from the registry. In [vercel/next.js](https://github.com/vercel/next.js), whose `overrides` pin `react` to a single canary build, this pulled in a second `react` and paired it with `react-dom` from the canary — a combination the pin exists to prevent.

- Under `resolvePeersFromWorkspaceRoot`, a workspace root dependency declared with `link:` or `file:` (or the path form of `workspace:`, such as `workspace:../pkg`) now satisfies another project's missing peer dependency at the linked package's own version, instead of being hoisted as a path. Those specifiers are relative to the project that declares them, so the same specifier reached a different directory — or none — from the project the peer was hoisted into, leaving a broken link. The root now has the same authority over the peer as it has when it declares the package with a version range [#13373](https://github.com/pnpm/pnpm/issues/13373).

- Two `pnpm install` peer-resolution fixes that made large workspaces such as [Astro](https://github.com/withastro/astro) produce a different `pnpm-lock.yaml` than pnpm 11 [#13334](https://github.com/pnpm/pnpm/issues/13334):

  - A package that declares the same name in both `dependencies` and `peerDependencies` no longer gets a nested copy of it when the parent already supplies that name, which is what pnpm does with `autoInstallPeers` disabled. The nested copy hid the peer, so the package was recorded without the peer context it resolves in.
  - A duplicate peer-suffixed variant that collapses into a larger, compatible one now collapses everywhere it is referenced. A variant kept alive by a single consumer's edge no longer lingers in the lockfile.

- Closed the remaining gaps in how unscoped per-registry `.npmrc` settings are pinned to the registry their own source file declared:

  - An inline `cert=` / `key=` written with `\n` escapes now expands to a real multi-line PEM, matching the URL-scoped `//host/:cert=` spelling.
  - `pnpm config get` / `pnpm config list` now report a rescoped credential under the URL-scoped key it was pinned to, instead of the unscoped key it was written as.
  - The deprecation warning names the file it read and lists every setting it pinned, including `tokenHelper`.
  - A credential with no registry of its own is no longer attached to the resolved default registry, which repository config can move. The same rule now covers the `@pnpm/napi` bindings: the `authHeaderByUri` entry written with an empty (`""`) key is pinned to the `registry` / `registries.default` the host passed alongside it, never to a registry the project's `.npmrc` names.

- The projects that run their own lifecycle scripts (`preinstall`, `install`, `postinstall`, `prepare`, …) now match pnpm in every install-family command. A project runs them when the command installs it in full, and — in a workspace the command only partly covers — whenever the command mutates it at all; the workspace root runs them even when the command was pointed at another project, because it is installed in full alongside it. As a result, `pnpm update <pkg>` and `pnpm add <pkg>` in a workspace no longer skip the workspace root's scripts, `pnpm update` at a workspace root no longer runs the other members' scripts, and `pnpm update --latest` no longer runs the project's own scripts (it rewrites named dependency specs, so it is a partial install like `pnpm update <pkg>`) [#13358](https://github.com/pnpm/pnpm/issues/13358).

- Print the script command by default when running a filtered lifecycle script. The command remains hidden with `--silent`.

- Run dependency verification consistently after regenerating a lockfile with `dedupePeers` enabled.

- Aligned the `hoistedDependencies` contents and ordering in `node_modules/.modules.yaml` with pnpm.

- Preserve whether package `libc` metadata uses a string or an array when writing the lockfile.

- A `package.json` that starts with a UTF-8 byte order mark is read again instead of failing with `expected value at line 1 column 1`. Workspace discovery, dependency manifests (including bin linking), tarball extraction, and `pnpm publish` of a pre-built tarball all accept one, matching pnpm [#13311](https://github.com/pnpm/pnpm/issues/13311). A manifest that really is malformed now reports its path in the error.

- Fixed `ERR_PNPM_BROKEN_LOCKFILE` when installing with a pnpm 10 lockfile that has a `patchedDependencies` section. See pnpm/pnpm#13307.

- `pnpm -r run "/pattern/" --no-bail` no longer exits zero when one of a project's matched scripts fails and a later one passes. The run summary carries a single status per project, and the passing script overwrote the recorded failure.

- Resolution failures now report the error pnpm defines for them. A well-formed range that the registry publishes nothing for fails with `ERR_PNPM_NO_MATCHING_VERSION` — naming the latest release, the other dist-tags, and the `pnpm view <pkg> versions` command that lists the rest — instead of `ERR_PNPM_SPEC_NOT_SUPPORTED_BY_ANY_RESOLVER`. A package the registry doesn't have fails with `ERR_PNPM_FETCH_404` and the "not in the npm registry, or you have no permission to fetch it" hint (plus which authorization header was sent, since a private registry often answers a permission failure with a 404) instead of a bare HTTP-client message. A wrapper that quotes its cause verbatim no longer prints the same sentence twice in the error report.

- Fixed `pnpm add <workspace-package>` to resolve the local package when `linkWorkspacePackages` is enabled.

- `$dep-name` self-references in `overrides` are now resolved against the root manifest's direct dependencies, so an override such as `rolldown: $rolldown` records the concrete specifier in `pnpm-lock.yaml` and no longer fails a frozen install with `ERR_PNPM_OUTDATED_LOCKFILE` [#13314](https://github.com/pnpm/pnpm/issues/13314). A reference to a package that is not a direct dependency fails with `ERR_PNPM_CANNOT_RESOLVE_OVERRIDE_VERSION`, and the deprecated syntax now warns, pointing at catalogs.

- The root project's `pnpm:devPreinstall` script now runs before resolution and linking, as it does in pnpm 11. It is skipped under `--ignore-scripts`, `--lockfile-only` and `--dry-run`, by `pnpm fetch` and `pnpm rebuild`, and by a repeat install that is already up to date. Workspaces that use the hook to prepare state the install depends on — such as [next.js](https://github.com/vercel/next.js), which generates a placeholder `next` bin with it — were left with dependents linked against files that were never created [#13313](https://github.com/pnpm/pnpm/issues/13313).

- The lockfile-verification line now dates a cached verdict — `✓ Lockfile passes supply-chain policies (verified 253ms ago)` — instead of the timeless `(previously verified)` [#13315](https://github.com/pnpm/pnpm/issues/13315).

- `pnpm install`, `run`, `test`, `update`, `remove`, `link`, `unlink`, `prune`, and `rebuild` now print the workspace scope they resolved — `Scope: all 41 workspace projects`, or `Scope: 5 of 41 workspace projects` under a `--filter`. This is the confirmation that a filter selected what was intended [#13315](https://github.com/pnpm/pnpm/issues/13315).

- An install that blocks a dependency's build scripts now appends a placeholder for it to `pnpm-workspace.yaml`, so approving or denying the build is an edit rather than writing the block by hand:

  ```yaml
  allowBuilds:
    es5-ext: set this to true or false
  ```

  A placeholder is not a decision — the build stays blocked until it is replaced with `true` or `false` — and an existing entry is never overwritten [#13315](https://github.com/pnpm/pnpm/issues/13315).

- Fixed `--parallel` being treated as the script name when placed before `run` in a recursive command.

- `scriptShell` now selects the shell for lifecycle scripts too — dependency build scripts and a project's own `preinstall`/`install`/`postinstall`/`prepare` and `pnpm:devPreinstall` — not only for `pnpm run` and `pnpm exec`. A workspace that configures a shell was still getting the platform default (`sh` / `cmd`) for everything the install itself spawns.

- Fixed `shamefullyHoist: true` to create public root dependency links.

- Prevented optional peers from being selected from an unrelated workspace package's shared dependency context.

- The store index now keys URL, git-host, and `type: git` dependencies by their bare resolution id, matching the key pnpm 11 writes [#13365](https://github.com/pnpm/pnpm/issues/13365). Previously these rows carried a `<name>@` prefix, so a store warmed by one pnpm major was cold for the other and every non-registry dependency was re-downloaded, re-extracted, and re-imported on a switch. A remote tarball also occupied two index rows instead of one, doubling its extraction work.

- A project that pins pnpm through `devEngines.packageManager` (or a v12+ `packageManager` field) now gets its `packageManagerDependencies` recorded in `pnpm-lock.yaml` by every command, not just by the install-family ones [#13348](https://github.com/pnpm/pnpm/issues/13348). Running `pnpm list` (or any other command) in a freshly cloned project no longer leaves the lockfile without the pinned version. The `pmOnFail` setting now also decides whether the pin is recorded: `--pm-on-fail=ignore` keeps it out of the lockfile even when the manifest asks for a stricter policy, and vice versa.

- Fixed `pnpm licenses list` to detect licenses from license files and preserve the latest package version's development classification.

- `pnpm update --latest` now rewrites `jsr:` dependencies. The manifest keeps the protocol and the range operator it declared, so `jsr:1.0.0` becomes `jsr:2.0.0` and `jsr:@scope/name@^1.0.0` becomes `jsr:@scope/name@^2.0.0`, instead of being left at the old version [#13363](https://github.com/pnpm/pnpm/issues/13363).

- `pnpm update --latest` now rewrites dependencies using a named registry alias. The manifest keeps the alias prefix and the range operator it declared, so `gh:1.0.0` becomes `gh:2.0.0` and `gh:@acme/foo@^1.0.0` becomes `gh:@acme/foo@^2.0.0`, instead of being left at the old version [pnpm/pnpm#13393](https://github.com/pnpm/pnpm/issues/13393).

- **Breaking change from pnpm v11.** Under `engineStrict`, an install fails when an incompatible package is reached through a regular `dependencies` edge of an installable package, even when that whole subtree hangs off an `optionalDependencies` entry. pnpm v11 installs the package and emits an install-check warning instead. Packages reachable only through optional edges, or through a package that was itself skipped, are still skipped in both versions [#13286](https://github.com/pnpm/pnpm/issues/13286).

- A lockfile entry whose tarball resolution records no `integrity` is now reported by the lockfile-verification gate, before anything is downloaded: every offending entry is listed in one `ERR_PNPM_MISSING_TARBALL_INTEGRITY` error instead of failing the install one fetch at a time after the gate had already passed the lockfile [#13364](https://github.com/pnpm/pnpm/issues/13364). An `integrity: ''` that pins nothing is treated the same as a missing one, and the exemption for git-host archive URLs is now read from the URL rather than the lockfile's own `gitHosted` marker.

- Fixed `pnpm licenses list` to read licenses from legacy package manifest fields.

- Fixed `--workspace-root` (`-w`) selecting the current workspace when `--dir` pointed at a nonexistent directory outside it (for example `pnpm --dir ../../elsewhere add -w foo`). The command now fails with `ERR_PNPM_NOT_IN_WORKSPACE`, matching pnpm. A nonexistent `--dir` inside the workspace still resolves to the workspace root as before.
