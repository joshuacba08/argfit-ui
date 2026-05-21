# Migration Guide: 0.1.0-alpha.0 -> 0.1.0-beta.0

This guide defines the expected migration posture from the public alpha contract to the intended beta contract.

HU-019 does not publish `0.1.0-beta.0`; it documents the contract consumers should expect once that prerelease exists.

## What Does Not Change

- Package names remain `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive`.
- The preferred consumer path remains `@argfit-ui/adaptive`.
- Desktop and mobile renderer packages remain available for renderer-specific usage.
- The stable alpha base catalog stays inside the beta contract.

## Category Mapping

| Alpha area | Beta outcome | Consumer action |
| --- | --- | --- |
| Stable alpha base contract: `AfButton`, `AfCard`, `AfInput`, `AfDialog`, `AfChart`, `AfBadge`, `AfPageShell`, `AfMetricCard`, primitives, theme/platform runtime | Promoted to `stable-for-beta` | Keep using these APIs; expect conservative evolution and explicit migration notes if they change. |
| `AfAnalyticsCard` and analytics slot/types | Remain `experimental-in-beta` | Keep behind an app-level wrapper if you adopt them early. |
| `AfDataTable` and data table slot/types | Remain `experimental-in-beta` | Avoid coupling app architecture to current table templates or pagination details. |
| Expanded form controls: `AfSelect`, `AfTextarea`, `AfToggle`, `AfCheckbox`, `AfRadioGroup`, `AfSegmentedControl`, `AfPassword` | Remain `experimental-in-beta` | Retest keyboard, validation and mobile behavior on each beta update. |
| Feedback APIs: `AfToastService`, `AfToast`, `AfToastViewport`, `AfInlineMessage` | Remain `experimental-in-beta` | Avoid depending on timing, placement or stacking details. |
| `@argfit-ui/desktop` and `@argfit-ui/mobile` exports | Stay `renderer-specific` | Prefer adaptive imports unless you intentionally target one renderer. |

## Import Strategy

Preferred beta import style:

```ts
import { provideArgfitUi } from '@argfit-ui/core';
import { AfButton, AfCard, AfDialog, AfInput } from '@argfit-ui/adaptive';
```

Renderer-specific imports remain valid, but they are not the main upgrade path for most applications.

## Mobile Engine Expectation

- Beta keeps `argfit-ui-mobile` as Ionic-first.
- No PrimeNG exception is approved inside the current beta contract.
- Consumers should not depend on renderer internals or vendor CSS classes when upgrading.

## Versioning Guidance

When `0.1.0-beta.0` is published:

1. Update all `@argfit-ui/*` packages together.
2. Keep exact prerelease versions aligned.
3. Reinstall or validate peer dependencies for Angular, CDK, PrimeNG, Ionic, Lucide and ECharts.

Example target install:

```bash
pnpm add @argfit-ui/core@0.1.0-beta.0 @argfit-ui/primitives@0.1.0-beta.0
pnpm add @argfit-ui/desktop@0.1.0-beta.0 @argfit-ui/mobile@0.1.0-beta.0 @argfit-ui/adaptive@0.1.0-beta.0
```

## Recommended Consumer Checklist

1. Audit your app for any use of `experimental-in-beta` APIs before upgrading.
2. Keep stable workflows on the `stable-for-beta` catalog when possible.
3. Re-run application build, tests and responsive QA after upgrading.
4. Do not depend on PrimeNG or Ionic event types through ArgFit wrappers.
5. Review beta release notes and migration notes for every prerelease.

## Expected Breaking-Change Policy In Beta

- `stable-for-beta` APIs should not break casually.
- `experimental-in-beta` APIs may still change between beta prereleases.
- HU-019 introduces no import-path rename by itself; it is a contract clarification, not a library refactor.
