export const createMultipartBody = (
  data: Record<string, unknown>,
  files: Record<string, Blob | undefined> = {}
) => {
  const formData = new FormData();
  formData.set("data", JSON.stringify(data));

  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.set(key, file);
  });

  return formData;
};
