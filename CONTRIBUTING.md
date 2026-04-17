# Adding a project to the playground index

1. Push your project folder to `main`
2. Open `projects.json` and add an entry to the `projects` array:

```json
{
  "path": "your-folder-name",
  "href": "your-folder-name/",
  "name": "Your Title",
  "desc": "One line description",
  "icon": "🎨",
  "author": "Monica",
  "category": "Prototypes"
}
```

3. Push — the index at [agebold.github.io/playground](https://agebold.github.io/playground/) updates automatically in ~1 min

**Field reference**

| Field | Value |
|---|---|
| `path` | Exact folder name in the repo |
| `href` | Usually same as `path` + `/` — or a specific file like `folder/page.html` |
| `name` | Title shown on the index |
| `desc` | Subtitle (keep it one line) |
| `icon` | Any emoji |
| `author` | `Izabela`, `Tzu-Yi`, or `Monica` |
| `category` | `Prototypes`, `Design System`, `User Research`, or `Strategy` |

Don't edit `index.html` — it's auto-generated on every deploy.
