// Renders the "Recent writing" list on the homepage from content/manifest.json.
// Each manifest entry: { slug, title, date ("YYYY-MM"), tag }
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

    // newest first
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    listEl.innerHTML = posts
      .map(
        (p) => `
      <a class="row-item reveal" href="./post.html?slug=${encodeURIComponent(p.slug)}">
        <span class="row-date">${escapeHtml(p.date || "")}</span>
        <span class="row-title">${escapeHtml(p.title || p.slug)}</span>
        <span class="row-tag">${escapeHtml(p.tag || "")}</span>
      </a>`
      )
      .join("");

    // re-observe newly injected .reveal elements
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    listEl.querySelectorAll(".reveal").forEach((el) => io.observe(el));
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
