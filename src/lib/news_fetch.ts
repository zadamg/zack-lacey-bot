export async function getNews(page: number, page_size: number) {
    try {
      // make url into string literal with variable
      // console.log(`getting news from ${`http://localhost:8080/news?page=${page}&page_size=${page_size}`}`);
      const response = await fetch(`http://localhost:8080/news?page=${page}&page_size=${page_size}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("fetch failed:", error);
    }
  }