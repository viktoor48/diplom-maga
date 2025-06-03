export const getCoverName = (e: string) => {
  let lastSlashIndex = e.lastIndexOf("/");
  let result = e.substring(lastSlashIndex + 1);
  return result;
};
