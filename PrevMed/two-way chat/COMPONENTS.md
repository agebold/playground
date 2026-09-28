# Two-way care team chat — component inventory

Written for designers and engineers rebuilding this prototype in Figma or code. See every component rendered at `components.html`.

## How the code maps to Figma

- **One render function per Figma component** in `components.js`, for example `ChatBubble()` → Figma **Chat/Bubble**.
- **The root element names its Figma component** with `data-figma="Chat/Bubble"`.
- **Variants use Figma's own syntax:** `data-variant="Sender=June, Side=Left, State=Default, Content=Text"`.
- **Layout is flexbox only.** Each flex container maps 1:1 to a Figma auto-layout frame, with gaps and padding from the spacing tokens. Absolute positioning is used only for overlays: sheets, the floating button, toasts, the phone frame and the status bar.
- **Colors and text styles** are CSS custom properties and classes named after the Figma variables and text styles (below).

**Sources, in priority order:**

| Code | Source |
|---|---|
| **MD** | Figma Member Dashboard `jvPrZfMCn9Xwi9Fol4SWEm` node `2045:43268`. The main reference. |
| **SE** | The side-effect Figma board, as already rebuilt in `weight_management_app/side-effect-june-chat.html`. |
| **DS** | `@bold/web` (Storybook: https://staging-ui.agebold.com/). Used where Figma has no matching piece. |
| **NEW** | Doesn't exist yet. Create it in Figma. |

## Tokens (`tokens.css`)

**Figma variables, used as-is:**

| CSS token | Figma variable | Value |
|---|---|---|
| `--primary-purple-300` | Primary/Purple/300 (Base) | `#5200D4` |
| `--primary-ink-300` | Primary/Ink/300 (Base) | `#140D26` |
| `--secondary-blue-300` | Secondary/Blue/300 (Base) | `#3366FF` |
| `--secondary-cyan-300` | Secondary/Cyan/300 (Base) | `#80E8FF` |
| `--text-default-primary` | Text/text-default-primary | `#171717` |
| `--text-default-secondary` | Text/text-default-secondary | `#525252` |
| `--surface-default-primary` | Surface/surface-default-primary | `#FAFAFA` |
| `--surface-default-tertiary` | Surface/surface-default-tertiary | `#E5E5E5` |
| `--surface-inverted-primary` | Surface/surface-inverted-primary | `#262626` |
| `--surface-brand-primary` / `-secondary` | Surface/surface-brand-* | `#5200D4` / `#EDE9FE` |
| `--border-default-primary` / `-tertiary` | Border/border-default-* | `#E5E5E5` / `#525252` |

**Hard-coded in Figma today. Propose making these Figma variables:**

| CSS token | Where Figma uses it | Value |
|---|---|---|
| `--page-gradient-from` | Home background, top of the gradient | `#F2F5FE` |
| `--dash-card-border` | Checklist card and step borders | `#E5E3EA` |
| `--dash-track` / `--dash-progress` | Progress track / fill, marker, floating-button label | `#E2E0E6` / `#4A10BD` |
| `--dash-muted` | Checklist helper text and done-step text | `#6B6474` |
| `--dash-done-bg` / `--dash-done-icon-bg` / `--dash-done-check` | Done step | `#FEFDFF` / `#E9E7ED` / `#216B42` |
| `--june-card-border` / `--june-card-from` / `--june-chip-border` | June card and chips | `#E7E0FB` / `#FAF8FF` / `#D9D2F2` |
| `--june-title` / `--june-body` | June card text | `#16121F` / `#5A5566` |
| `--june-gradient` / `--june-fab-ring` | Chip text gradient / floating-button conic ring | gradients |

**Borrowed from `@bold/web` or the side-effect June chat:**
- `--purple-100` (active tab)
- `--yellow-300` / `--yellow-150` (sign-here tags and required fields)
- `--mint-*`, `--red-*`
- `--ink-200` (the light-grey emergency line)
- `--border-default-secondary` / `--surface-subtle` (composer, care-side patient bubble)

**Text styles:**

| CSS class | Figma text style | Spec |
|---|---|---|
| `.type-body` | Body | Inter 16/24 |
| `.type-body-bold` | Body Bold | Inter SemiBold 16/24 |
| `.type-caption-1` | Caption 1 | Inter 14/22 |
| `.type-caption-1-bold` | Caption 1 Bold | Inter SemiBold 14/22 |
| `.type-serif-headline` | Serif Headline | Source Serif 4 SemiBold 20/24 |
| `.type-greeting` | Home greeting | Source Serif 4 SemiBold 32/40 (propose as a style) |
| `.type-title` | Section title | Inter SemiBold 24/32, −0.5 tracking (propose as a style) |
| `.type-june-title` | June card title | Source Serif SemiBold 18, −0.18 tracking |

No text is smaller than 14px.

## Inventory

### Reuse from the Member Dashboard (MD)

Don't recreate these. Use the existing instances.

| Figma component | Where it appears in MD | Variant properties added here | Used in |
|---|---|---|---|
| Status Bar - iPhone | instance in `2045:43392` | Tone=Default/Light | both phones |
| Post-Auth Website Navigation Header | frame `2045:43393` (Logo, Profile Picture, carrot-default `18:774`) | Menu=Closed/Open, unread dot | patient app |
| Navigation - Mobile Web App / Tab | frame `2045:43524` | **Tabs=5** (adds Messages with the DS chat icon), Active=Yes/No, Badge=None/Count (the count reads "unread" or "open"); icon is a Figma/DS shape or a Phosphor name | patient app (Tabs=5), care app (Tabs=2) |
| Class (Web, Tablet Breakpoints) + Position Tag | instance `2045:43374` | CTA=Yes/No (a Start class button + "Change class", from the dWeb class-in-list) | Home, care plan sheet |
| Chat with June — Entry Card (+ chip) | instance `2045:43490` | post-visit chip copy | Home |
| FAB — Chat with June | instance `2045:43519` | State=Expanded/Collapsed (the Figma annotation: shimmer on load, then collapse) | Home |
| June Orb | inside `2045:43490` | Size=24/32/40/46 | everywhere June appears |
| Icons (Phosphor components) | HandHeart `40:1317`, Pulse `24:1050`, PersonSimpleTaiChi `23:1193`, IdentificationCard `1600:1634`, carrot-default `18:774` | — | nav, checklist |

### Make into MD components

These are frames in MD today.

| Proposed component | MD frame | Variant properties | Used in |
|---|---|---|---|
| Home/Greeting | `2045:43429` | — | Home |
| Checklist/Module | "Get ready for Monday" `2045:43433` | Phase=Before visit/After visit | Home |
| Checklist/Progress | `2045:43437` | Done=n of N | Checklist/Module |
| Checklist/Step | "Step — …", "Callout", "Done — …" frames | State=To do/Callout/Done | Checklist/Module |
| Home/SectionTitle | "Weight loss video content", "Learn more", "FAQ" text | — | Home |

### From `@bold/web` (DS)

| Figma component | Storybook story | Variant properties | Used in |
|---|---|---|---|
| Button | `button--default` | Variant=Primary/Secondary/Text, Size=Medium/Small | everywhere |
| Tag | `tag--default` | Color=Purple100/Grey/Yellow/Mint/Red | everywhere |
| Tag/AI | (JC `.ai-chip`) | — | every June message label |
| Avatar / AvatarStack | `avatar--default` | Size=24/32/40/44/48, Image=Yes/No | everywhere |
| Nav/AccountMenu | UserNav + DropdownMenu (`dropdownmenu--default`) | — (Messages item with a "1 new" Tag) | patient header |
| TextWithShield | `textwithshield--default` | — | intro card |
| Input/Checkbox, Input/Radio | `forms-input--checkbox`, FieldRadioButtons | Checked=Yes/No | signing, task sheet |

### Chat — extend SE, or NEW

| Figma component | Source | Variant properties |
|---|---|---|
| Chat/Header | SE, extended | Side=Patient/Care |
| Chat/StatusStrip | NEW | State=Idle/WithTeam/Reading/Typing/WithProvider/Resolved |
| Chat/MessageLabel | NEW | Sender=June/CareAdvocate/Provider/Patient |
| Chat/Bubble | SE, extended | Sender=June/Staff/Patient, Side=Left/Right, State=Default/Failed, Content=Text/Photo/Choice (+ Me) |
| Chat/TypingIndicator | SE, extended | Sender=June/Human |
| Chat/SystemEvent | NEW | Type=Date/Handoff/Opened/Signed/Synced/Record/Task/Urgent |
| Chat/SuggestionChip | MD chip style | State=Default/Selected/Disabled |
| Chat/CarePlanCard | NEW | — |
| Chat/DocumentCard | NEW | Status=Needs signature/Signed |
| Chat/ResourceCard | NEW | — |
| Chat/RoutingCard | NEW | — (rows: part of the question → who answers; the reply promise; an optional closing line on when the team reads it) |
| Chat/IntroCard | NEW | — |
| Chat/EmergencyNote | NEW | — |
| Chat/Composer (+ AttachmentChip, DocumentChip) | SE, extended (Topics pill removed) | State=Empty/Filled/WithAttachment, Side=Patient/Care |
| Chat/PhotoGrid, Chat/Article | NEW | — |
| Sheet/Bottom, Sheet/Actions, Modal/FullScreen, Toast | NEW | Sheet: Height=Auto/Tall; Modal: Tone=Default/Doc |
| Lockscreen, Lockscreen/Notification | NEW | App=Messages/Bold |

### Care team — NEW

Healthie messaging patterns, dressed in Bold components.

| Figma component | Variant properties |
|---|---|
| Care/Header | — |
| Care/Search | — |
| Care/FilterPills | — |
| Care/InboxRow | State=Unread/Read, Triage=CanWait/NeedsProvider/Urgent |
| Care/OffHoursBanner | — |
| Care/ContextBar | — |
| Care/InternalCard | Type=Intake/Summary/TaskEvent/Record |
| Care/SummaryCard | State=Loading/Ready |
| Care/TaskRow | Status=Open/Done |
| Care/TaskSheet | — |
| Care/TaskDetail | — (slots: tags, title, Carol's words, cards, actions) |
| Care/TaskPrompt | — ("Reply sent. Mark this task done?" + Button) |
| Care/SectionLabel | — |
| Care/EmptyState | — |
| Care/TemplatePicker | — |
| Care/AccountSwitch | — |

### Signing, DocuSign-style — NEW

| Figma component | Variant properties |
|---|---|
| Sign/Disclosure | Error=Yes/No |
| Sign/DocumentPage | — |
| Sign/Tag | Type=Start/Next/Sign |
| Sign/SignatureField | State=Empty/Signed |
| Sign/AdoptSignature | Mode=Type/Draw |
| Sign/Done | — |

### Demo only — not product UI

Demo/PhoneFrame (iPhone 16), and the demo page's top bar, chapter pills and caption bar.

## Putting it back into Figma (later)

1. Open the Bold library file. Reuse the MD components listed above as they are.
2. Create the MD-component and NEW components with `figma:figma-generate-library`, from `components.html`. Use the component names, variant properties and tokens exactly as listed here.
3. Add the "propose as variable" colors and the two proposed text styles as Figma variables and styles first, so the new components can bind to them.
4. Assemble the screens (Home, Messages, signing, care inbox, thread, tasks) with `figma:figma-generate-design`, using instances only.
