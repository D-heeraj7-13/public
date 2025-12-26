export const previewScore = (s = "") =>
  /cpu|mem|util|load|packet|traffic|error/i.test(s) ? 100 : 10;
