export const filteredPropsOfObj = (obj: Object, ...allowedFields: string[]) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (allowedFields.includes(key)) {
      // @ts-ignore
      acc[key] = value;
    }

    return acc;
  }, {});
};
