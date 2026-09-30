import fs from "fs"
import RSS from "rss"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis/notion-client/getPosts"

export async function generateRssFeed() {
  const posts = await getPosts()
  const siteURL = CONFIG.link

  const feed = new RSS({
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    site_url: siteURL,
    feed_url: `${siteURL}/feed.xml`,
    language: CONFIG.lang || "ko-KR",
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${CONFIG.profile.name}`,
  })

  // 'Post' 타입의 공개된 글만 RSS 항목으로 추가
  posts
    .filter((post) => post.type?.[0] === "Post" && post.status?.[0] === "Public")
    .forEach((post) => {
      feed.item({
        title: post.title,
        description: post.summary || "",
        url: `${siteURL}/${post.slug}`,
        date: post.date?.start_date || post.createdTime,
        author: post.author?.[0]?.name || CONFIG.profile.name,
      })
    })

  // public/feed.xml 파일로 정적 저장
  fs.writeFileSync("./public/feed.xml", feed.xml({ indent: true }))
}