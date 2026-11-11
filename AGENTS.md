# Repo Notes For Codex

## SCSS Component Migration

- When compiling SCSS/CSS for this repo, do not generate, update, or commit `.map` source map files.
- For files in `partials/components/`, use **Selector-Scoped Output** by default.
- Selector-Scoped Output means: keep each selector once, then split layout CSS and theme CSS inside that selector with `@include mix.layout {}` and `@include mix.theme {}`.
- Child selectors, modifier selectors, and pseudo-elements such as `img`, `i`, `&.change`, `&:before`, and `&:after` must start as their own nested blocks under the target selector, then contain `@include mix.layout {}` and/or `@include mix.theme {}`. Do not keep child selectors inside a target's layout/theme/mobile block.
- When a state/modifier changes a child selector, write the combined selector directly when possible, such as `&.active i`, then put layout/theme inside it. Prefer this over nesting `i` inside `&.active` when the real CSS target is `.target.active i`.
- Parent-condition selectors such as `.parent &`, `.parent>&`, `.chat_right &`, and `.type_box.active &` must start as second-level blocks inside the target selector, then contain `@include mix.layout {}` and/or `@include mix.theme {}`. When a parent condition styles a pseudo-element owned by the target, keep the pseudo-element as the second-level block and nest the parent condition inside it. Do not hide the parent condition inside `mix.layout`, `mix.theme`, `mix.mobile`, or view mixins.
- For a parent state that changes a target pseudo-element, use this nested structure:

```scss
.target_selector {
    &:after {
        @include mix.layout {
            @include mix.mobile {
                content: "";
                display: none;
            }
        }

        .parent.active & {
            @include mix.layout {
                @include mix.mobile {
                    display: block;
                }
            }
        }
    }
}
```
- If the same nested child selector, modifier selector, pseudo-element, or parent-condition selector, such as `i`, `&.change`, `&:before`, `&:after`, or `.parent &`, needs both layout and theme declarations, keep that nested selector once and split layout/theme inside it instead of writing it twice.
- During SCSS audits, search for repeated parent-condition selectors such as `.chat_right &`, `.chat_popup &`, and `.type_box.active &`; if both layout and theme are needed, combine them under that one nested selector.
- When several classes share the same declarations, group the level-1 selectors once for the shared SCSS, then reopen each selector only for its unique rules.

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

- Prefer the current layout-first shape:

```scss
.component_selector {
    @include mix.layout {
        @include mix.mobile {
            @include base.flexbox();
        }
    }

    @include mix.theme {
        @include mix.mobile {
            @include mix.brightTheme {
                color: brand.t(Orange);
            }
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

- Add `@include mix.web {}` only when web rules are actually needed.
- Use dedicated view mixins instead of the commented generic view mixins: `mAsia`, `mEuro`, `mCyberbattle`, `mAsiaCyberbattle`, and `mAsiaEuro`.
- For SCSS, do not use or write `devDontCopy_*` selectors; those classes are demo-only.

- In mobile component rules, if a condition means "not `mAsia` and not `mCyberbattle`", use `@include mix.mEuro {}` directly. If it means "not `mEuro`", use `@include mix.mAsiaCyberbattle {}`. If it means "not `mCyberbattle`", use `@include mix.mAsiaEuro {}`.
- Use `@include mix.languageName(xxx)` for one positive language. Use `languageNames(...)`, `notLanguageName(...)`, and `notLanguageNames(...)` when several languages or exclusions are needed. Do not use removed exact language helpers such as `langChs`, `langEng`, `langEs`, `langHi`, `langId`, `langKor`, `langPt`, `langTh`, `langTr`, or `langVn`.
- For one exact theme, use `@include mix.themeName(...)` or `@include mix.notThemeName(...)`. Use `themeNames(...)` / `notThemeNames(...)` only when 2 or more comma-separated themes share the same rule.
- Put spacing, sizing, flex, positioning, animation, and shape such as `border-radius` in `@include mix.layout {}`.
- Put colors, backgrounds, and theme-token styling in `@include mix.theme {}` using `brand.t(...)`.
- For order-sensitive selectors such as `_chat_ing`, keep backgrounds and background images in `@include mix.theme {}` by default, but keep the other token/color declarations inside `@include mix.layout {}` when moving them to theme output would break the compiled CSS. If layout output must win and the selector is mostly layout-driven, preserve behavior instead of forcing a separate `@include mix.theme {}` block.
- Prefer existing helpers such as `base.flexbox()`, `base.alignItems(...)`, `base.justifyContent(...)`, and `base.borderRadius(...)`.
- Inside a target selector, put direct styles for that target first, then view-specific direct styles such as `mAsiaCyberbattle`, `mAsiaEuro`, `mAsia`, `mCyberbattle`, and `mEuro`, then parent-specific overrides or special customizations.
- Before nesting a selector with `&`, identify the real CSS target. If the declaration styles another class, sibling, previous element, or parent-owned element, do not hide it under the current target selector; keep or move it under that actual target's own level-1 selector.
- Search class usage before choosing structure. If a related class is only used in one component and can safely own its rules, make it a standalone level-1 selector, such as `.count_up` or `.count_down`, instead of nesting it under another target.
- Keep `partials/_sample.scss` as reference only; do not include it in layout/theme compile.
- When the user says `scss system`, read [SCSS_SYSTEM.md](SCSS_SYSTEM.md) and run that audit/fix workflow on the target SCSS file.

## Target Class Migration

- When the user says `target class: xxx`, read [TARGET_CLASS_WORKFLOW.md](TARGET_CLASS_WORKFLOW.md) and run that workflow for the class.
- Treat `xxx` as a class name whether or not it starts with a dot.
- Use the active file path or user prompt to infer the target language/view, then collect matching rules from the relevant `_layout_xxx.scss`, `layout_xxx.scss`, `_fl_layout_xxx.scss`, `_theme(s)_xxx.scss`, and `_fl_theme(s)_xxx.scss` files.
- Clone or consolidate the class into the correct `partials/components/` file, then apply the SCSS system rules. Do not remove legacy layout/theme rules; leave them for manual comment-out review.

## Selector Grouping

- Centralize component selectors by target class where possible.
- Prefer keeping reusable target classes at level 1 so all CSS for that target can be found together.
- The target should be level 1 whenever possible. Parent conditions belong inside the target as second-level blocks such as `.parent & { @include mix.layout {} }`; rules whose target is another class belong under that other class instead.
- Use grouped level-1 selectors for truly shared SCSS, then split only the per-class differences:
- When peer classes are intentionally side by side and share the exact same declaration, such as `.odds` and `.arrow` in up/down odds color rules, group those peer selectors in the component partial instead of leaving the sibling selector behind in legacy SCSS. If only one peer needs an exclusion, keep that exclusion on that peer only, such as `.odds:not(.ob_odds.old), .arrow { .up & { ... } }`.
- When the source already groups peer classes and their nested modifier or child selector shares the exact same declarations, keep that grouped peer block instead of moving the nested selector inside only one target class. For example, migrate `.odds, .odds_btn { .add, &.add { ... } }` as a grouped `.odds, .odds_btn` rule.
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

- For repeated nested target selectors, prefer this:

```scss
.handi {
    .abc & {
    }

    .xyz & {
    }
}
```

- Avoid scattering the same target under many parents like this:

```scss
.abc {
    .handi {
    }
}

.xyz {
    .handi {
    }
}
```

- If parent-specific behavior is required, keep the parent condition as a second-level block inside the level-1 target selector using `.parent &`, then put layout/theme inside that parent block.
- When related rules share the same target and parent context, group them under that target even if the variant conditions differ. For example, `.details_subhdr .live_icon:not(.smaller_icon_v2)` and `.details_subhdr .live_icon.smaller_icon_v2` can both live under `.live_icon` because the owning context is `.details_subhdr` + `.live_icon`.
- Keep broad class-owned rules under their own level-1 selector when they apply generally. Move them into another selector only when the rule is really about that other target/context.
- For a component target like `.live_icon`, keep direct `.live_icon` layout/theme first, then direct view branches, then parent overrides such as `.details_subhdr &`, `.lb_cm &`, or `.mr_ev_hdr &`.

```scss
.live_icon {
    .details_subhdr & {
        @include mix.layout {
            @include mix.mobile {
                @include mix.mEuro {
                    &:not(.smaller_icon_v2) {
                        margin-left: 4px;
                    }

                    &.smaller_icon_v2 {
                        margin-right: 6px;
                    }
                }
            }
        }
    }
}
```

## Shallow Hierarchy

- Keep selector nesting as shallow as possible.
- Prefer separate level-1 selectors when the child class can safely own the style:

```scss
.abc {
}

.xyz {
}
```

- Avoid deep nesting unless the parent context is required for correctness.
- Before moving a nested selector out, check the related HTML/template structure and class usage. Some classes are shared by other modules, and their CSS must stay parent-scoped when the rule only applies inside that parent.
- Preserve the effective compiled CSS order from the current `.min.css` / source order. When moving selectors, keep the same override behavior and make sure later rules still win where they won before.
- After a component migration, compile representative layout and theme entry files and check key selectors when the change may affect output order, specificity, or folder ownership.
