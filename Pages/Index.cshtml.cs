using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MocInformacji.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IContentRepository _contentRepository;
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(IContentRepository contentRepository, ILogger<IndexModel> logger)
        {
            _contentRepository = contentRepository;
            _logger = logger;
        }

        // Grupa artykułów podzielona na kategorie
        public Dictionary<string, List<ContentData>> CategorizedArticles { get; set; } = new();

        // Lista najnowszych artykułów
        public List<ContentData> LatestArticles { get; set; } = new();

        public async Task OnGetAsync()
        {
            var allContent = await _contentRepository.GetAllContentAsync();

            if (allContent != null && allContent.Any())
            {
                // 1. Pobierz najnowsze artykuły (sortowanie po dacie)
                LatestArticles = allContent
                    .OrderByDescending(a => a.LastModified)
                    .Take(60)
                    .ToList();

                // 2. Pogrupuj wszystkie artykuły według kategorii
                CategorizedArticles = allContent
                    .GroupBy(a => a.Category)
                    .ToDictionary(g => g.Key, g => g.OrderByDescending(a => a.LastModified).ToList());
            }
        }

        public string GetCategoryName(string category)
        {
            return category?.ToLower() switch
            {
                "co-to-jest" => "Definicje i Pojęcia",
                "jak-dziala" => "Poradniki i Mechanizmy",
                "porownania" => "Zestawienia i Porównania",
                "czy" => "Pytania i Odpowiedzi",
                "kalkulatory" => "Narzędzia i Kalkulatory",
                "finanse" => "Finanse i Biznes",
                "prawo" => "Prawo",
                "technologia" => "Technologia",
                "zdrowie" => "Zdrowie",
                "biznes" => "Biznes",
                _ => char.ToUpper(category[0]) + category.Substring(1)
            };
        }

        public int CalculateReadingTime(int wordCount)
        {
            // Średnia prędkość czytania: 200-250 słów na minutę
            // Przyjmujemy 225 słów/min jako średnią
            const int wordsPerMinute = 225;
            var minutes = (int)Math.Ceiling((double)wordCount / wordsPerMinute);
            return minutes;
        }
    }
}
