export function toPgArrayLiteral(strings: string[]) {

  if (!Array.isArray(strings)) throw new Error("Input must be an array");

  const escaped = strings.map(str =>
    '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
  );

  return `{${escaped.join(',')}}`;
}