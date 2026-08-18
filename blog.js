// Renders the "Recent writing" list on the homepage from content/manifest.json.
// Each manifest entry: { slug, title, date ("YYYY-MM"), tag }
// Row markup/styles are copied verbatim from the blog row anchor in
// Mien Blog design refinement/Mien Blog.dc.html so added posts look identical
// to the original design, not just to whatever the empty state looks like.
(async function () {
  const listEl = document.getElementById("blog-list");
  if (!listEl) return;

  try {
    const res = await fetch("./content/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no manifest");
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      return; // keep the "no posts yet" placeholder already in the HTML
    }

    posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

    listEl.innerHTML = posts
      .map(
        (p, i) => `
      <a class="blog-row reveal" href="./post.html?slug=${encodeURIComponent(p.slug)}"
         style="transition-delay:${i * 70}ms;display:grid;grid-template-columns:112px 1fr auto;align-items:baseline;gap:24px;padding:22px 14px 22px 0;border-top:1px solid rgba(23,24,26,.14);${i === posts.length - 1 ? "border-bottom:1px solid rgba(23,24,26,.14);" : ""}">
        <span style="font-family:'Noto Sans',sans-serif;font-size:.74rem;letter-spacing:.07em;color:rgba(23,24,26,.5)">${escapeHtml(p.date || "")}</span>
        <span style="font-family:Newsreader,serif;font-style:italic;font-size:clamp(1.08rem,2.2vw,1.34rem);line-height:1.5">${escapeHtml(p.title || p.slug)}</span>
        <span style="font-family:'Noto Sans',sans-serif;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(23,24,26,.4);white-space:nowrap">${escapeHtml(p.tag || "")}</span>
      </a>`
      )
      .join("");

    if (window.observeReveals) window.observeReveals(listEl);
  } catch (err) {
    // manifest missing or empty — leave the static placeholder in place
    console.debug("blog.js: no posts to render yet", err);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
