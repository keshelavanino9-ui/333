
export function exportToCSV<T extends object>(data: T[], filename: string) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const val = (row as any)[header];
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export function exportToPDF(filename: string, content: string) {
  // Simulation of PDF generation (client-side PDF generation usually requires heavy libs like jspdf)
  // For this demo, we create a text file mimicking a report structure
  const blob = new Blob([`NYX COGNITIVE CORE REPORT\nDATE: ${new Date().toLocaleString()}\n----------------------------\n\n${content}`], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.txt`; // Using .txt for demo reliability without libs
  link.click();
}

export function fuzzySearch<T>(data: T[], query: string, keys: (keyof T)[]): T[] {
  if (!query) return data;
  const lowerQuery = query.toLowerCase().trim();
  const tokens = lowerQuery.split(/\s+/);

  return data
    .map(item => {
      let score = 0;
      // Check each key for matches
      for (const key of keys) {
        const val = String((item as any)[key]).toLowerCase();
        
        // Exact match bonus
        if (val === lowerQuery) score += 100;
        // Starts with bonus
        else if (val.startsWith(lowerQuery)) score += 50;
        // Contains whole query
        else if (val.includes(lowerQuery)) score += 20;
        
        // Token matching for "fuzzy" feel
        tokens.forEach(token => {
           if (val.includes(token)) score += 5;
        });
      }
      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
}
