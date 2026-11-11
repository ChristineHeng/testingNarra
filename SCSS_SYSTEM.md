# SCSS System

Use this checklist when the user says `scss system`.

## Goal

Recheck a target SCSS file against the repo migration rules and fix gaps directly.

## Workflow

1. Read `AGENTS.md` and `partials/_sample.scss` first.
2. Read the target SCSS file and audit selector by selector.
3. Keep one selector block where possible, then split output with `@include mix.layout {}` and `@include mix.theme {}`.
4. If CSS properties apply directly to the target selector, put `@include mix.layout {}` and/or `@include mix.theme {}` directly inside that target selector.
5. If CSS properties apply to a child selector, modifier selector, or pseudo-element, such as `img`, `i`, `&.change`, `&:before`, or `&:after`, start that selector as a nested block under the target selector, then put `@include mix.layout {}` and/or `@include mix.theme {}` inside it.
6. If a state/modifier changes a child selector, write the combined selector directly when possible, such as `&.active i`, then put `@include mix.layout {}` and/or `@include mix.theme {}` inside it. Prefer this over nesting `i` inside `&.active` when the real CSS target is `.target.active i`.
7. If CSS properties are scoped by a parent condition, such as `.parent &`, `.parent>&`, `.chat_right &`, or `.type_box.active &`, start that parent condition as a second-level block inside the target selector, then put `@include mix.layout {}` and/or `@include mix.theme {}` inside it. When a parent condition styles a pseudo-element owned by the target, keep the pseudo-element as the second-level block and nest the parent condition inside it.
8. Do not hide child selectors, modifier selectors, pseudo-elements, or parent-condition selectors inside `mix.layout`, `mix.theme`, `mix.mobile`, or view mixins. Selector first, output mixin second.
9. If the same nested child selector, modifier selector, pseudo-element, or parent-condition selector, such as `i`, `&.change`, `&:before`, `&:after`, or `.parent &`, needs both layout and theme declarations, keep that nested selector once and split layout/theme inside it instead of writing it twice.
10. During the audit, search for repeated parent-condition selectors such as `.chat_right &`, `.chat_popup &`, and `.type_box.active &`; if both layout and theme are needed, combine them under that one nested selector.
11. If several classes share the same declarations, group those level-1 selectors once for the shared SCSS, then reopen each class only for its unique rules.
12. Inside each target selector, keep direct target rules first, then direct view-specific branches, then parent-specific overrides or special customizations.
13. Prefer layout/theme first, then put `@include mix.mobile {}` or `@include mix.web {}` inside when needed.
14. Keep mobile-specific view mixins such as `@include mix.mEuro {}`, `@include mix.mAsiaCyberbattle {}`, or `@include mix.mAsiaEuro {}` inside the layout/theme block.
15. Use dedicated view mixins instead of the commented generic view mixins. If a condition means "not `mAsia` and not `mCyberbattle`", use `@include mix.mEuro {}`. If it means "not `mEuro`", use `@include mix.mAsiaCyberbattle {}`. If it means "not `mCyberbattle`", use `@include mix.mAsiaEuro {}`.
16. For language-specific rules, follow the Language-Specific Rules section below and keep language mixins such as `@include mix.languageName(eng) {}`, `@include mix.languageNames(eng, vn) {}`, or `@include mix.notLanguageName(chs) {}` inside the layout/theme block.
17. Put spacing, sizing, flex, position, overflow, border-radius, and similar structure rules in `@include mix.layout {}`.
18. Put color, background, border-color, and theme-token styling in `@include mix.theme {}`.
19. For order-sensitive selectors such as `_chat_ing`, keep backgrounds and background images in `@include mix.theme {}` by default, but keep other token/color declarations inside `@include mix.layout {}` when moving them to theme output would break the compiled CSS. If layout output must win and the selector is mostly layout-driven, preserve behavior instead of forcing a separate `@include mix.theme {}` block.
20. Prefer `brand.t(...)` instead of hardcoded theme colors when a matching token exists.
21. Prefer namespaced mixins such as `mix.*` and `base.*` consistently.
22. Keep selectors shallow and grouped by target class where safe.
23. Preserve effective output order and existing behavior while migrating.
24. If a build command is known and the change is risky, compile/check affected output after edits.

## Selector Ownership

The target class should normally be a level-1 selector. Shared declarations can use a grouped level-1 selector, then each class can be reopened for differences:

```scss
.abc,
.xyz {
    @include mix.layout {
        @include mix.mobile {
            @include base.flexbox();
        }
    }
}

.abc {
}

.xyz {
}
```

Do not put a rule under a target selector just because the target appears in the selector text. First identify which element receives the declarations. If the declaration styles a sibling or another class, such as `& + .n_score_inner` or `span:has(+ &)`, that rule belongs under the actual target's level-1 selector or should stay out of the current target migration.

When a modifier or related class is only used inside one component and can safely own the declarations, split it into its own level-1 selector. This keeps classes such as `.count_up` and `.count_down` findable instead of burying them under `.live_icon`.

Nested child selectors, modifier selectors, pseudo-elements, and parent-condition selectors should also stay selector-scoped. Put `img`, `i`, `&.change`, `&:before`, `&:after`, and `.parent &` first as nested selectors, then put layout/theme inside them. For a parent state that changes a target pseudo-element, keep `&:after` or `&:before` as the child block and nest the parent condition inside it. For state-owned children, prefer the combined selector such as `&.active i` over nesting `i` inside `&.active`. Do this even when the nested selector only has layout rules or only has theme rules.

```scss
.target_selector {
    @include mix.layout {
        @include mix.mobile {
            @include base.flexbox();
        }
    }

    @include mix.theme {
        @include mix.mobile {
            border: 1px solid brand.t(Stroke);
        }
    }

    i {
        @include mix.layout {
            @include mix.mobile {
                margin-right: 10px;
            }
        }

        @include mix.theme {
            @include mix.mobile {
                color: brand.t(Gray03);
            }
        }
    }

    &.change {
        @include mix.layout {
            @include mix.mobile {
                @include base.borderRadius(4px);
                padding: 2px;
            }
        }

        @include mix.theme {
            @include mix.mobile {
                background: brand.t(BG_handiChange);
                color: brand.t(Color_handiChange);
            }
        }
    }

    &.active i {
        @include mix.layout {
            @include mix.mobile {
                @include base.rotate(0deg);
            }
        }
    }

    &:before {
        @include mix.layout {
            @include mix.mobile {
                content: "";
                position: absolute;
            }
        }

        @include mix.theme {
            @include mix.mobile {
                background-image: url("#{$themeImgFolder}sample.svg#{$img_version}");
            }
        }
    }

    .parent & {
        @include mix.layout {
            @include mix.mobile {
                margin-left: 10px;
            }
        }

        @include mix.theme {
            @include mix.mobile {
                color: brand.t(Gray03);
            }
        }
    }
}
```

## Conditional Else Pattern

When migrating an `@if ... @else` branch into the SCSS system, keep the fallback exclusive if the original `@else` must not emit for the special case.

Prefer this pattern inside the matching theme/view mixin:

```scss
.target_selector {
    @include mix.theme {
        @include mix.darkTheme {
            color: brand.t(White);

            @if not (config.$view==euro and config.$theme==default) {
                background: brand.t(Gray);

                i {
                    color: brand.t(Gray03);
                }
            }

            @include mix.mEuro {
                @include mix.themeName(default) {
                    background: brand.t(BG_ob_light_gray);

                    i {
                        color: brand.t(LightGray);
                    }
                }
            }
        }
    }
}
```

Use this instead of emitting the fallback for every dark theme and relying on the special case to override it, when preserving exact `@else` output matters.

## Language-Specific Rules

Language-specific component output should work the same way as view and theme output. The language is configured by each language entry file before shared layout partials load, then `partials/_mixin.scss` exposes language mixins for component files.

Each language entry file sets `$language` directly:

```scss
@use '../../../themes/colours/config' with (
    $activeView: $activeView,
    $view: asia,
    $language: eng,
);
```

There is no `$activeLanguage`. Language folders may be copied from one language to another, but Sass entries do not borrow a different language entry. So `$language` is already the final language value.

`layout_cyberbattle.scss` files reuse `layout_asia.scss`, so they inherit the same folder language while overriding `$activeView` to `mCyberbattle`. This is why view has `$activeView`, but language does not need `$activeLanguage`.

Language mixins:

```scss
@include mix.languageName(chs) {}
@include mix.languageName(eng) {}
@include mix.languageName(es) {}
@include mix.languageName(hi) {}
@include mix.languageName(id) {}
@include mix.languageName(kor) {}
@include mix.languageName(pt) {}
@include mix.languageName(th) {}
@include mix.languageName(tr) {}
@include mix.languageName(vn) {}
@include mix.languageNames(eng, vn) {}
@include mix.notLanguageName(eng) {}
@include mix.notLanguageNames(eng, vn) {}
```

Use `languageName(...)` for one positive language. Use `languageNames(...)` for two or more positive languages, `notLanguageName(...)` for one negative check, and `notLanguageNames(...)` for two or more negative checks. Do not use removed exact language helpers such as `langChs`, `langEng`, `langEs`, `langHi`, `langId`, `langKor`, `langPt`, `langTh`, `langTr`, or `langVn`.

Keep Selector-Scoped Output. Put language checks inside `@include mix.layout {}` or `@include mix.theme {}` depending on the property type.

```scss
.component_selector {
    @include mix.layout {
        @include mix.mAsia {
            @include mix.languageName(chs) {
                font-size: 13px;
            }
        }
    }

    @include mix.theme {
        @include mix.languageName(eng) {
            @include mix.brightTheme {
                color: brand.t(Orange);
            }
        }
    }
}
```

Use `mix.notLanguageName(xxx)` when all languages except one should receive the rule:

```scss
.component_selector {
    @include mix.layout {
        @include mix.notLanguageName(chs) {
            min-width: 96px;
        }
    }
}
```

For 2 or more languages that share the same layout rule, use `languageNames(...)`:

```scss
.component_selector {
    @include mix.layout {
        @include mix.languageNames(eng, vn) {
            min-width: 112px;
        }
    }
}
```

For one exact theme, use `themeName(...)` or `notThemeName(...)`. Use the plural `themeNames(...)` or `notThemeNames(...)` only when 2 or more comma-separated themes share the same rule:

```scss
.component_selector {
    @include mix.theme {
        @include mix.themeName(default) {
            color: brand.t(ActiveLight);
        }

        @include mix.themeNames(default, dark1) {
            color: brand.t(ActiveLight);
        }
    }
}
```

For AND conditions, nest the checks from broadest to narrowest:

```scss
.component_selector {
    @include mix.theme {
        @include mix.mAsia {
            @include mix.languageNames(eng, vn) {
                @include mix.themeNames(default, dark1) {
                    color: brand.t(ActiveLight);
                }
            }
        }
    }
}
```

When adding a new language:

1. Add the folder under `assets/public/languages/<lang>/`.
2. Pass `$language: <lang>` into `assets/themes/colours/config` from that folder's layout entry files.
3. Add the language to `$supported-languages` in `assets/themes/colours/_config.scss`.
4. Component rules should use `mix.languageName(<lang>)` or `mix.languageNames(...)`; do not add one-off `mix.langXxx` helpers.

Rules:

- Keep spacing, sizing, flex, position, and shape rules in `mix.layout`.
- Keep colors, backgrounds, and token styling in `mix.theme`, except order-sensitive non-background token/color declarations that must stay in `mix.layout` to preserve the compiled CSS.
- Combine language with view and theme mixins only where that condition is required.
- Prefer the folder names exactly: `chs`, `eng`, `es`, `hi`, `id`, `kor`, `pt`, `th`, `tr`, `vn`. Use `vn` for Vietnamese.

## What To Fix

- Wrong nesting order such as `mobile -> layout/theme` when it should be `layout/theme -> mobile`.
- Missing `@include mix.mobile {}` or `@include mix.web {}` when the selector is meant to be device-scoped.
- Repeated shared declarations copied into multiple classes instead of one grouped level-1 selector.
- Parent, sibling, or neighbor rules nested under the wrong target selector.
- Theme properties placed in layout blocks without an order-sensitive output reason.
- Layout properties placed in theme blocks.
- Language-specific component rules left in language entry files when they can live safely under the target selector in `partials/components/`.
- Un-namespaced shared mixins from `partials/_mixin.scss`.
- Hardcoded colors that should use `brand.t(...)`.

## Expected Result

The target file should match the repo sample shape, stay readable selector-by-selector, and keep the same intended compiled behavior.
