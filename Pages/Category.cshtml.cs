using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MocInformacji.Pages
{
    public class CategoryModel : PageModel
    {
        private readonly IContentRepository _contentRepository;
        private readonly ILogger<CategoryModel> _logger;

        [BindProperty(SupportsGet = true)]
        public string Category { get; set; }

        public List<ContentData> Articles { get; set; } = new();
        public string CategoryDisplayName { get; set; }
        public string CategoryDescription { get; set; }
        public string CategoryIcon { get; set; }

        public CategoryModel(
            IContentRepository contentRepository,
            ILogger<CategoryModel> logger)
        {
            _contentRepository = contentRepository;
            _logger = logger;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (string.IsNullOrEmpty(Category))
            {
                return NotFound();
            }

            // Pobierz wszystkie artykuły z danej kategorii
            var allContent = await _contentRepository.GetAllContentAsync();
            Articles = allContent
                .Where(c => c.Category.Equals(Category, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(c => c.LastModified)
                .ToList();

            // Ustaw nazwę wyświetlaną kategorii
            CategoryDisplayName = GetCategoryDisplayName(Category);
            CategoryDescription = GetCategoryDescription(Category);
            CategoryIcon = GetCategoryIcon(Category);

            ViewData["Title"] = $"{CategoryDisplayName} - MocInformacji.pl";
            ViewData["MetaDescription"] = $"Wszystkie artykuły z kategorii {CategoryDisplayName}";

            return Page();
        }

        private string GetCategoryDisplayName(string category)
        {
            return category?.ToLower() switch
            {
                "finanse" => "Finanse",
                "prawo" => "Prawo",
                "technologia" => "Technologia",
                "zdrowie" => "Zdrowie",
                "biznes" => "Biznes",
                "edukacja" => "Edukacja",
                "lifestyle" => "Styl życia",
                _ => char.ToUpper(category[0]) + category.Substring(1)
            };
        }

        private string GetCategoryDescription(string category)
        {
            return category?.ToLower() switch
            {
                "finanse" => "Wszystko o finansach osobistych, inwestycjach, kredytach i ubezpieczeniach",
                "prawo" => "Porady prawne, regulacje i objaśnienia przepisów",
                "technologia" => "Najnowsze technologie, gadżety i innowacje",
                "zdrowie" => "Zdrowie, medycyna i profilaktyka",
                "biznes" => "Biznes, przedsiębiorczość i rozwój firmy",
                "edukacja" => "Edukacja, rozwój osobisty i nauka",
                "lifestyle" => "Styl życia, hobby i rozrywka",
                _ => "Artykuły eksperckie z tej kategorii"
            };
        }

        private string GetCategoryIcon(string category)
        {
            return category?.ToLower() switch
            {
                "finanse" => "bi bi-cash-coin",
                "prawo" => "bi bi-shield-check",
                "technologia" => "bi bi-cpu",
                "zdrowie" => "bi bi-heart-pulse",
                "biznes" => "bi bi-briefcase",
                "edukacja" => "bi bi-book",
                "lifestyle" => "bi bi-stars",
                _ => "bi bi-folder"
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
