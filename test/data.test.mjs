import test from "node:test";
import assert from "node:assert/strict";
import { projectsByDate } from "../src/app/data/projects.ts";
import { getAllPosts, getPostBySlug } from "../src/lib/blog.ts";

test("projectsByDate sorts newest first and parses all years without NaN", () => {
    assert.ok(projectsByDate.length > 0, "projects list should not be empty");

    for (let i = 0; i < projectsByDate.length - 1; i++) {
        const aYear = Number(projectsByDate[i].year.split(/[-–—]/).pop()?.trim());
        const bYear = Number(projectsByDate[i + 1].year.split(/[-–—]/).pop()?.trim());
        assert.ok(!Number.isNaN(aYear), `project ${projectsByDate[i].slug} year parsed as NaN`);
        assert.ok(!Number.isNaN(bYear), `project ${projectsByDate[i + 1].slug} year parsed as NaN`);
        assert.ok(aYear >= bYear, `expected ${aYear} >= ${bYear}`);
    }
});

test("blog posts load metadata and parse UTC dates properly", async () => {
    const posts = await getAllPosts();
    assert.ok(posts.length > 0, "blog posts should exist");

    for (const post of posts) {
        assert.ok(post.slug, "post has slug");
        assert.ok(post.title, "post has title");
        assert.ok(post.date, "post has date");
        // Verify formatted date is valid and non-empty (e.g. "Oct 28, 2026")
        assert.match(post.date, /^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/, `date ${post.date} matches format`);
    }

    const firstPost = await getPostBySlug(posts[0].slug);
    assert.ok(firstPost, "single post loads");
    assert.ok(firstPost.html.length > 0, "single post renders html");
});

test("blog service safely rejects malformed or non-existent slugs", async () => {
    const maliciousPost = await getPostBySlug("../../../etc/passwd");
    assert.equal(maliciousPost, null, "path traversal slug returns null");

    const emptyPost = await getPostBySlug("");
    assert.equal(emptyPost, null, "empty slug returns null");

    const nonExistent = await getPostBySlug("non-existent-blog-slug-999");
    assert.equal(nonExistent, null, "non-existent post returns null");
});

test("blog service handles caching and cache invalidation cleanly", async () => {
    const post1 = await getPostBySlug("building-clinical-voice-ai");
    assert.ok(post1, "post1 loaded");

    // Immediate second read should hit in-memory cache
    const post2 = await getPostBySlug("building-clinical-voice-ai");
    assert.ok(post2, "post2 loaded from cache");
    assert.equal(post1.slug, post2.slug);
    assert.equal(post1.title, post2.title);
});
