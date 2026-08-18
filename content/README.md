# Adding a blog post

1. Write your post as a Markdown file in this folder, e.g. `content/my-first-post.md`.
   Plain Markdown — headings, paragraphs, code blocks, links, images all work.

2. Add an entry for it to `manifest.json` in this folder:

   ```json
   [
     {
       "slug": "my-first-post",
       "title": "My First Post",
       "date": "2026-08",
       "tag": "Notes"
     }
   ]
   ```

   - `slug` must match the markdown filename without `.md`.
   - `date` is free text shown in the list (e.g. `"2026-08"` or `"2026 · 08"`) — the list
     sorts newest-first by comparing this string, so keep the format consistent
     (`YYYY-MM` or `YYYY-MM-DD` sorts correctly).
   - `tag` is a short label shown on the right (e.g. `Architecture`, `Notes`, `Opinion`).

3. Commit and push. The post appears automatically on the homepage under "Recent
   writing" and is readable at `post.html?slug=my-first-post`.

That's it — no build step. `blog.js` reads `manifest.json` to build the list, and
`post.html` fetches the matching `.md` file and renders it client-side with
[marked](https://github.com/markedjs/marked).
