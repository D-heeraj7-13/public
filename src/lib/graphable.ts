export const isGraphable = (key = "", name = "") =>
  /cpu|mem|util|load|packet|traffic|error|usage/i.test(
    `${key} ${name}`.toLowerCase()
  );
