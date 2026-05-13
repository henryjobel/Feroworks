import bcrypt from "bcryptjs";
import { normalizePermissions } from "../src/auth/permissions.js";
import { AdminUser, SiteSettings, PageSectionContent, Service, Sector, BlogPost, NewsletterSubscription, LeadSubmission, MediaAsset } from "../src/lib/schemas.js";
import { env } from "../src/config/env.js";
import { connectMongoDB } from "../src/lib/mongodb.js";
import { DEFAULT_CMS } from "../data/defaultContent.js";

async function main() {
  await connectMongoDB();
  
  await NewsletterSubscription.deleteMany({});
  await LeadSubmission.deleteMany({});
  await MediaAsset.deleteMany({});
  await BlogPost.deleteMany({});
  await Sector.deleteMany({});
  await Service.deleteMany({});
  await PageSectionContent.deleteMany({});
  await SiteSettings.deleteMany({});
  await AdminUser.deleteMany({});

  await AdminUser.create({
    email: env.ADMIN_EMAIL,
    name: "Admin",
    passwordHash: await bcrypt.hash(env.ADMIN_PASSWORD, 10),
    role: "owner",
    permissions: normalizePermissions("owner"),
    isActive: true,
  });

  await SiteSettings.create({
    siteName: DEFAULT_CMS.site.naam,
    tagline: DEFAULT_CMS.site.tagline,
    phone: DEFAULT_CMS.site.tel,
    email: DEFAULT_CMS.site.email,
    address: DEFAULT_CMS.site.adres,
    kvk: DEFAULT_CMS.site.kvk,
    btw: DEFAULT_CMS.site.btw,
    website: DEFAULT_CMS.site.website,
    linkedin: DEFAULT_CMS.site.linkedin,
    instagram: DEFAULT_CMS.site.instagram,
    facebook: DEFAULT_CMS.site.facebook,
    metaTitle: DEFAULT_CMS.site.metaTitle,
    metaDescription: DEFAULT_CMS.site.metaDesc,
  });

  await PageSectionContent.insertMany([
    { key: "hero", value: DEFAULT_CMS.hero },
    { key: "stats", value: DEFAULT_CMS.stats },
    { key: "watFerna", value: DEFAULT_CMS.watFerna },
    { key: "anders", value: DEFAULT_CMS.anders },
    { key: "projecten", value: DEFAULT_CMS.projecten },
    { key: "faq", value: DEFAULT_CMS.faq },
    { key: "overOns", value: DEFAULT_CMS.overOns },
    { key: "contact", value: DEFAULT_CMS.contact },
    { key: "pages", value: DEFAULT_CMS.pages },
    { key: "websiteSettings", value: DEFAULT_CMS.websiteSettings },
  ]);

  await Service.insertMany(
    DEFAULT_CMS.diensten.map((item, index) => ({
      slug: item.id,
      sortOrder: index,
      nr: item.nr,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      checklist: item.checklist,
      body: item.body,
      imageUrl: item.image,
      seoTitle: item.title,
      seoDescription: item.excerpt,
      isPublished: true,
    }))
  );

  await Sector.insertMany(
    DEFAULT_CMS.sectoren.map((item, index) => ({
      slug: item.id,
      sortOrder: index,
      nr: item.nr,
      name: item.naam,
      tagline: item.tagline,
      description: item.description,
      intro: item.intro,
      items: item.items,
      imageUrl: item.image,
      seoTitle: item.naam,
      seoDescription: item.description,
      isPublished: true,
    }))
  );

  await BlogPost.insertMany(
    DEFAULT_CMS.blog.map((item, index) => ({
      slug: item.slug,
      sortOrder: index,
      title: item.title,
      category: item.category,
      displayDate: item.date,
      readTime: item.readTime,
      status: item.status,
      featured: item.featured,
      excerpt: item.excerpt,
      body: item.body,
      imageUrl: item.image,
      seoTitle: item.title,
      seoDescription: item.excerpt,
      isPublished: item.status === "Gepubliceerd",
    }))
  );

  console.log("Seed completed.");
  console.log(`Admin email: ${env.ADMIN_EMAIL}`);
  console.log(`Admin password: ${env.ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    process.exit(0);
  });
