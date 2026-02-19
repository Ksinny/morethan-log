const CONFIG = {
  // profile setting (required)
  profile: {
    name: "sinny",
    image: "/avatar.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "backend developer",
    bio: "안녕하세요. Java Spring을 공부중인 백엔드 개발자 지망생 sinny입니다.",
    email: "dosly2@naver.com",
    // linkedin: "ksinny",  
    github: "ksinny",
    // instagram: "",
  },
  // projects: [
  //   {
  //     name: `sinny-log`,
  //     href: "https://github.com/ksinny/morethan-log",
  //   },
  // ],
  //blog setting (required)
  blog: {
    title: "sinny-log",
    description: "welcome to sinny\'s blog",
    scheme: "system", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://ksinny-log.vercel.app",
  since: 2026, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // revalidate time for [slug], index
}

module.exports = { CONFIG }
