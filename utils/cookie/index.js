export const parseCookie = (cookie) => {
  if (!cookie) return;
  const values = cookie.split(";");
  const arrValues = values.map((val) => val.split("="));
  const arrObjects = arrValues.map((val) => ({ key: val[0], value: val[1] }));
  return arrObjects;
};
