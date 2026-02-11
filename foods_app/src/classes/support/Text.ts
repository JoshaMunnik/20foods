export class Text {
  static normalizeName(input: string): string {
    return input.trim().toLowerCase();
  }

  static normalizeForComparison(input: string): string {
    return input.trim().toLowerCase().replaceAll(' ', '');
  }

  static suffixWithOrdinal(number: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder100 = number % 100;
    return number + (suffixes[(remainder100 - 20) % 10] || suffixes[remainder100] || suffixes[0]);
  }

  static formatDate(date: Date): string {
    const day = Text.suffixWithOrdinal(date.getDate());
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  static formatDateWithTime(date: Date): string {
    const day = Text.suffixWithOrdinal(date.getDate());
    const month = date.toLocaleString('default', { month: 'long' });
    //const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${hours}:${minutes}`;
  }
}