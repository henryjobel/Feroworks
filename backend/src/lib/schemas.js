import mongoose from "mongoose";

const Schema = mongoose.Schema;

// AdminUser Schema
const AdminUserSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "owner" },
    permissions: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, _id: false }
);

// SiteSettings Schema
const SiteSettingsSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    siteName: { type: String, required: true },
    tagline: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    kvk: { type: String },
    btw: { type: String },
    website: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    defaultOgImage: { type: String },
    robotsText: { type: String },
  },
  { timestamps: true, _id: false }
);

// PageSectionContent Schema
const PageSectionContentSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, _id: false }
);

// Service Schema
const ServiceSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    nr: { type: String },
    title: { type: String, required: true },
    subtitle: { type: String },
    excerpt: { type: String },
    checklist: { type: Schema.Types.Mixed },
    body: { type: Schema.Types.Mixed },
    imageUrl: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, _id: false }
);

// Sector Schema
const SectorSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    nr: { type: String },
    name: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    intro: { type: String },
    items: { type: Schema.Types.Mixed },
    imageUrl: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, _id: false }
);

// BlogPost Schema
const BlogPostSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    title: { type: String, required: true },
    category: { type: String },
    displayDate: { type: String },
    publishedAt: { type: Date },
    readTime: { type: String },
    status: { type: String, default: "Concept" },
    featured: { type: Boolean, default: false },
    excerpt: { type: String },
    body: { type: Schema.Types.Mixed },
    imageUrl: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true, _id: false }
);

// MediaAsset Schema
const MediaAssetSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    kind: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storagePath: { type: String, required: true },
    publicUrl: { type: String, required: true },
    data: { type: Buffer },
    altText: { type: String },
  },
  { timestamps: true, _id: false }
);

// LeadSubmission Schema
const LeadSubmissionSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, default: "new" },
    attachmentId: { type: String, ref: "MediaAsset" },
  },
  { timestamps: true, _id: false }
);

// NewsletterSubscription Schema
const NewsletterSubscriptionSchema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, _id: false }
);

// Create models
export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
export const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
export const PageSectionContent = mongoose.model("PageSectionContent", PageSectionContentSchema);
export const Service = mongoose.model("Service", ServiceSchema);
export const Sector = mongoose.model("Sector", SectorSchema);
export const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
export const MediaAsset = mongoose.model("MediaAsset", MediaAssetSchema);
export const LeadSubmission = mongoose.model("LeadSubmission", LeadSubmissionSchema);
export const NewsletterSubscription = mongoose.model("NewsletterSubscription", NewsletterSubscriptionSchema);
