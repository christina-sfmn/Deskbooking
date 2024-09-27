// function for formating date as ISO 8601-Format YYYY-MM-DD
export const formatDateToISO = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

// function for formating date as German/EU Format DD.MM.YYYY
export const formatDateToGerman = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}.${month}.${year}`;
};
