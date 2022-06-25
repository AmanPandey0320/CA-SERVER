/**
 * 
 * @param str 
 * @returns 
 */
function toCamelCase(str: string): string {
    return str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

}

/**
 * 
 * @param str 
 * @returns 
 */
function toSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export { toCamelCase, toSnakeCase };
