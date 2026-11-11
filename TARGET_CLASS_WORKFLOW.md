# Target Class Workflow

Use this checklist when the user writes `target class: <class>`.

## Goal

Find all SCSS rules for the target class in the legacy layout/theme files, clone or consolidate them into the correct `partials/components/` file, then apply the [SCSS System](SCSS_SYSTEM.md) migration rules.

## Inputs

- The class may be written with or without a leading dot, such as `target class: live_icon` or `target class: .live_icon`.
- Use the active file path or the user's prompt to infer the language and view. For example, `assets/public/languages/chs/layout_euro.scss` means language `chs` and view `euro`.
- If language or view is unclear, search all matching layout/theme files first and migrate only the files that actually contain the target class unless the user asks for a wider migration.

## Search Scope

Check the closest matching files for the inferred view and language:

- `assets/public/layout/css/_layout_shared.scss`
- `assets/public/layout/css/_layout_sub_<view>.scss`
- `assets/public/layout/css/_fl_layout_shared.scss`
- `assets/public/languages/<language>/layout_<view>.scss`
- `assets/themes/colours/_themes_shared.scss`
- `assets/themes/colours/_themes_<view>.scss`
- `assets/themes/colours/_fl_themes_shared.scss`
- `assets/themes/colours/**/theme_<view>.scss`
- `assets/public/languages/<language>/_font.scss` when the target is a global font or typography selector such as `body`

Also include any repo-equivalent names matching the user's shorthand: `_layout_<view>.scss`, `layout_<view>.scss`, `_fl_layout_<view>.scss`, `_theme_<view>.scss`, `_themes_<view>.scss`, `_fl_theme_<view>.scss`, and `_fl_themes_<view>.scss`.
For global typography targets, include the matching language `_font.scss` files as well.

- When the same declaration applies to every supported language except one or more known exceptions, use `@include mix.notLanguageName(...)` or `@include mix.notLanguageNames(...)` instead of listing every included language. Use `languageName(...)` or `languageNames(...)` for a smaller positive group.

## Order And Override Safety

- Before grabbing SCSS rules, check all relevant compiled `.min.css` files that contain the target class.
- Use the `.min.css` order as the source of truth for overwrite behavior. Record which matching selector appears earlier or later, and make sure the component clone preserves the same later-wins result.
- Check layout and theme output separately when both exist. A selector can be safe in layout order but risky in theme order.
- If a component clone changes where output appears in the final compile, preserve behavior by keeping equivalent specificity, parent context, or source order inside the component partial.
- If the compiled `.min.css` file is missing or stale, compile representative layout/theme entries first when possible, then inspect the generated selector order before editing.
- Do not assume same-specificity rules are interchangeable. If two matching rules set the same property, the later compiled rule must still win after migration.

## Theme Strategy

- Asia view usually uses grouped theme mixins such as `@include mix.brightTheme`, `@include mix.darkTheme`, and `@include mix.redTheme`. Prefer those groups when they match the legacy Asia output.
- Euro view is different and should not be blindly grouped into bright/dark/red theme blocks. Preserve exact Euro legacy conditions with `@include mix.themeName(...)`, `@include mix.themeNames(...)`, `@include mix.notThemeName(...)`, `@include mix.notThemeNames(...)`, or carefully scoped `@if` conditions when needed.
- Only collapse several theme-specific rules into a group when the compiled `.min.css` proves the output is equivalent for every affected theme.
- When a token differs by exact theme inside the same theme group, keep exact theme branches rather than forcing a broad group.
- Treat red-theme behavior carefully because `redTheme` can overlap theme names and may not match Euro expectations.

## FL Merge Strategy

- `fl` SCSS is the newer version. Always compare `_fl_layout_*` and `_fl_theme*` rules against the normal layout/theme rules for the target class.
- If an FL rule is written as `.fl .target`, `.fl .parent .target`, or equivalent nested `.fl &`, treat it as a newer override of the normal layout/theme rule.
- Merge FL rules into the normal component selector by replacing the affected declarations directly. Do not output `.fl` wrapper selectors in component SCSS.
- If an FL override sets the same property as the normal rule, use the FL value in the normal target selector for the affected view/theme scope.
- If an FL rule uses FL-only variables, replace them with the equivalent literal value or existing non-FL token. Do not import FL variable files into component SCSS just for a target migration.
- This replacement is only inside `partials/components/`. Do not edit or remove anything from the original layout/theme/FL SCSS files.
- Preserve the compiled `.min.css` final value. Since `.fl` selectors are not emitted in component SCSS, verify that the merged normal target selector produces the intended newer value.

## Target Selector Shape

- Keep each target selector once at level 1 where possible. Prefer one `.target {}` block instead of repeating the same selector in multiple places.
- The target is the element receiving the declarations, not merely any class mentioned in the selector. If the rule styles another class, sibling, previous element, or parent-owned element, put it under that actual target's level-1 selector or leave it out of this target migration.
- When two or more target classes share the same declarations, group those level-1 selectors for the shared SCSS, then reopen each class only for unique rules:
- When a side-by-side peer selector shares the exact same declaration with the target, such as `.odds` and `.arrow` in up/down odds color rules, clone and group the peer selector with the target in the component partial. If only one peer needs an exclusion, keep the exclusion on that peer only, such as `.odds:not(.ob_odds.old), .arrow { .up & { ... } }`.
- When the legacy source already groups peer classes and their nested modifier or child selector shares the same declarations, keep that grouped peer block in the component partial instead of moving the nested selector inside only the current target. Example: `.odds, .odds_btn { .add, &.add { ... } }`.
- For parent-owned state blocks such as `.up { .odds, .arrow { ... } }` and `.down { .odds, .arrow { ... } }`, group the peer targets at level 1 when they share the same declarations, then keep the parent state inside the group with `.up &` / `.down &`. Verify the compiled selector still preserves the parent-state handling, and scope only nested view-specific overrides inside that block.
- Do not infer that an entire shared source block is Euro-only because one nested override contains `@if config.$view==euro`; keep the outer shared declarations shared, and gate only the nested Euro-specific override.

```scss
.abc,
.xyz {
}

.abc {
}

.xyz {
}
```

- If a target has a sibling target such as `.target_pre`, give that sibling its own level-1 block instead of repeatedly grouping and reopening the same selector.
- Do not create standalone parent or neighbor selector blocks for a target migration, such as `.some_parent {}` or `.other_class {}`.
- If a related selector can be expressed from inside the target using `&` and the declarations still style the target, keep it inside the target block. Parent overrides such as `.parent &` are acceptable inside `.target {}`.
- If a related selector does not contain the target and cannot be expressed under the target selector, do not clone it for this target migration unless the user explicitly asks.
- Keep hierarchy shallow. Parent-specific behavior should stay inside the level-1 target selector with `.parent &`, `.previous + &`, `&.modifier`, or a similarly shallow form that still styles the target. When a parent state styles a pseudo-element owned by the target, keep `&:after` or `&:before` as the child block and nest the parent condition inside it. A rule like `& + .sibling` styles the sibling, so it belongs under the sibling target instead.
- When a nested modifier selector such as `&.change` needs both layout and theme declarations, keep one `&.change {}` block and split layout/theme inside it instead of scattering the modifier across multiple layout/theme blocks.
- Inside a component target, order rules from direct target styles, to direct view-specific branches, to parent-specific overrides and special customizations.
- Search usage for related classes before deciding whether they are modifiers or standalone targets. If a class is only used inside one component and can safely own the declarations, split it into its own level-1 selector, such as `.count_up` or `.count_down`.

## Workflow

1. Read `AGENTS.md`, `SCSS_SYSTEM.md`, and `partials/_sample.scss`.
2. Check matching compiled `.min.css` files first and note the current selector order, specificity, and overwritten properties.
3. Search for the target selector as a class selector, including top-level rules, nested rules, parent-context rules, FL rules, `&` combinations, and language-specific rules in `_font.scss`.
4. Inspect nearby selectors and related HTML/template usage when moving scope could change behavior.
5. Choose the owning file in `partials/components/`. Prefer an existing component partial that already owns related selectors.
6. Centralize the target class at level 1 where safe. Keep required parent-specific behavior inside the target selector with `.parent &`.
7. Merge normal and FL rules in the component clone by replacing declarations directly in the target view/theme scope. Do not emit `.fl` selectors.
8. Preserve effective compiled order. If moving rules could change override behavior, keep the new block near related selectors or retain the needed parent context.
9. Split migrated declarations with Selector-Scoped Output:

```scss
.target_class {
    @include mix.layout {
        @include mix.mobile {
        }
    }

    @include mix.theme {
        @include mix.mobile {
        }
    }
}
```

When a mobile condition maps to one of the known view groups, write the dedicated view mixin:

```scss
.target_class {
    @include mix.theme {
        @include mix.mobile {
            @include mix.mEuro {
                color: brand.t(Color_handiChange);
            }
        }
    }
}
```

Use `@include mix.mEuro {}` for Euro-only output, `@include mix.mAsiaCyberbattle {}` for Asia + Cyberbattle output, and `@include mix.mAsiaEuro {}` for Asia + Euro output instead of the commented generic view mixins.

For nested modifiers, keep the modifier selector scoped once:

```scss
.target_class {
    &.change {
        @include mix.layout {
            @include mix.mobile {
                @include base.borderRadius(4px);
            }
        }

        @include mix.theme {
            @include mix.mobile {
                background: brand.t(BG_handiChange);
            }
        }
    }
}
```

10. Put spacing, sizing, flex, positioning, overflow, animation, and shape declarations in `@include mix.layout {}`.
11. Put colors, backgrounds, border colors, and theme-token styling in `@include mix.theme {}`.
12. For order-sensitive selectors such as `_chat_ing`, keep backgrounds and background images in `@include mix.theme {}` by default, but keep other token/color declarations inside `@include mix.layout {}` when moving them to theme output would break the compiled CSS. If layout output must win and the selector is mostly layout-driven, preserve behavior instead of forcing a separate `@include mix.theme {}` block.
13. Use `brand.t(...)` for theme colors when a matching token exists.
14. Do not remove migrated legacy rules. Leave the original layout/theme and language `_font.scss` rules untouched so the user can comment them out manually one by one for review.
15. Compile or inspect representative output when the change may affect order, specificity, or folder ownership.
16. Recheck the target selector in compiled output after the component clone, especially same-specificity overrides and merged FL final values.

## Expected Result

The target class should be grouped in the component partial and split cleanly into layout/theme output. Legacy layout/theme rules should remain in place for manual review.
