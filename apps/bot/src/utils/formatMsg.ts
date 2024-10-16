type MessagePlaceholders = Record<string, string | number>;

export const formatMsg = (template: string, placeholders: MessagePlaceholders): string => {
  return Object.keys(placeholders).reduce((formatted, key) => {
    // Search placeholders in the template and replace them with the values
    const regex = new RegExp(`{${key}}`, 'g');
    return formatted.replace(regex, String(placeholders[key]));
  }, template);
};
