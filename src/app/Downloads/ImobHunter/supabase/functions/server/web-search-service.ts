export async function searchWeb(query: string): Promise<any[]> {
  console.log(`🔍 Web search for: ${query}`);
  
  return [
    {
      title: "Sample Result 1",
      url: "https://example.com/1",
      snippet: "This is a sample search result",
    },
    {
      title: "Sample Result 2",
      url: "https://example.com/2",
      snippet: "Another sample result",
    }
  ];
}
