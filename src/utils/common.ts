export const filteredPropsOfObj = (
  obj: NonNullable<unknown>,
  ...allowedFields: string[]
) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (allowedFields.includes(key)) {
      // @ts-ignore
      acc[key] = value;
    }

    return acc;
  }, {});
};
