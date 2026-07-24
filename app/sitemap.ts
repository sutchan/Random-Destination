// app/sitemap.ts v1.0.0
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sutchan.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'zh-CN': SITE_URL,
          'en': SITE_URL,
          'x-default': SITE_URL,
        },
      },
    },
    {
      // 主要功能锚点页（帮助搜索引擎理解站点结构）
      url: `${SITE_URL}/#wheel`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#settings`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
