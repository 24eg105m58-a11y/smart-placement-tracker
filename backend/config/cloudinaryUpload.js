import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (
  buffer,
  { folder = "blog_users_b2", resourceType = "image" } = {},
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};
