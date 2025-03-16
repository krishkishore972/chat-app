declare module "express" {
  interface Request {
    userId?: string;
  }
}

export type Folder = "thumbnail" | "avatar" | "cover" | "videos" | "post";
