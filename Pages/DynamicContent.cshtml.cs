using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MocInformacji.Pages
{
    public class DynamicContentModel : PageModel
    {
        private readonly IContentRepository _contentRepository;
        private readonly ILogger<DynamicContentModel> _logger;

        [BindProperty(SupportsGet = true)]
        public string Category { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Slug { get; set; }

        public ContentData Content { get; set; }
        public List<FAQItem> FAQ { get; set; } = new();
        public List<RelatedArticle> RelatedArticles { get; set; } = new();

        public DynamicContentModel(
            IContentRepository contentRepository,
            ILogger<DynamicContentModel> logger)
        {
            _contentRepository = contentRepository;
            _logger = logger;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (string.IsNullOrEmpty(Category) || string.IsNullOrEmpty(Slug))
            {
                return NotFound();
            }

            Content = await _contentRepository.GetContentAsync(Category, Slug);

            if (Content == null)
            {
                _logger.LogWarning($"Nie znaleziono treści: {Category}/{Slug}");
                return NotFound();
            }

            FAQ = Content.FAQ ?? new List<FAQItem>();
            RelatedArticles = await _contentRepository.GetRelatedArticlesAsync(Category, Slug, 6);

            // Poprawka: Przekazujemy metadane do Layoutu
            ViewData["Title"] = Content.Title;
            ViewData["MetaDescription"] = Content.MetaDescription;

            return Page();
        }

        public string GetCategoryDisplayName()
        {
            return Category?.ToLower() switch
            {
                "co-to-jest" => "Definicje",
                "jak-dziala" => "Poradniki",
                "porownania" => "Porównania",
                "czy" => "Pytania i odpowiedzi",
                "kalkulatory" => "Kalkulatory",
                "finanse" => "Finanse",
                "prawo" => "Prawo",
                "technologia" => "Technologia",
                "zdrowie" => "Zdrowie",
                "biznes" => "Biznes",
                _ => "Artykuły"
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

    #region Data Models

    public class ContentData
    {
        public string Title { get; set; }
        public string H1 { get; set; }

        [JsonPropertyName("meta_description")]
        public string MetaDescription { get; set; }

        public string Article { get; set; }
        public List<FAQItem> FAQ { get; set; }

        public DateTime LastModified { get; set; } // Bez atrybutu - PropertyNameCaseInsensitive obsłuży

        public string Category { get; set; }
        public string Slug { get; set; }

        [JsonPropertyName("FeaturedImage")]
        public string FeaturedImage { get; set; }

        [JsonPropertyName("WordCount")]
        public int WordCount { get; set; }
    }

    public class FAQItem
    {
        [JsonPropertyName("q")]
        public string Question { get; set; }

        [JsonPropertyName("a")]
        public string Answer { get; set; }
    }

    public class RelatedArticle
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public string Category { get; set; }
    }

    #endregion

    #region Content Repository Interface

    public interface IContentRepository
    {
        Task<ContentData> GetContentAsync(string category, string slug);
        Task<List<RelatedArticle>> GetRelatedArticlesAsync(string category, string slug, int count);
        Task<List<ContentData>> GetAllContentAsync();
    }

    #endregion

    #region JSON File Repository Implementation

    public class JsonFileContentRepository : IContentRepository
    {
        private readonly string _contentDirectory;
        private readonly ILogger<JsonFileContentRepository> _logger;

        public JsonFileContentRepository(
            IWebHostEnvironment env,
            ILogger<JsonFileContentRepository> logger)
        {
            _contentDirectory = Path.Combine(env.ContentRootPath, "Content");
            _logger = logger;
            Directory.CreateDirectory(_contentDirectory);
        }

        public async Task<ContentData> GetContentAsync(string category, string slug)
        {
            try
            {
                var filePath = Path.Combine(_contentDirectory, category, $"{slug}.json");

                if (!File.Exists(filePath))
                {
                    _logger.LogWarning($"Plik nie istnieje: {filePath}");
                    return null;
                }

                var json = await File.ReadAllTextAsync(filePath);
                var content = JsonSerializer.Deserialize<ContentData>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (content != null)
                {
                    content.Category = category;
                    content.Slug = slug;
                }

                return content;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Błąd odczytu treści: {category}/{slug}");
                return null;
            }
        }

        public async Task<List<RelatedArticle>> GetRelatedArticlesAsync(string category, string slug, int count)
        {
            try
            {
                var categoryPath = Path.Combine(_contentDirectory, category);

                if (!Directory.Exists(categoryPath)) return new List<RelatedArticle>();

                var files = Directory.GetFiles(categoryPath, "*.json")
                    .Where(f => !f.Contains(slug))
                    .Take(count)
                    .ToList();

                var articles = new List<RelatedArticle>();
                foreach (var file in files)
                {
                    var json = await File.ReadAllTextAsync(file);
                    var content = JsonSerializer.Deserialize<ContentData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (content != null)
                    {
                        articles.Add(new RelatedArticle
                        {
                            Title = content.Title,
                            Url = $"/{category}/{Path.GetFileNameWithoutExtension(file)}",
                            Category = category
                        });
                    }
                }
                return articles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Błąd ładowania powiązanych artykułów");
                return new List<RelatedArticle>();
            }
        }

        public async Task<List<ContentData>> GetAllContentAsync()
        {
            var allContent = new List<ContentData>();
            try
            {
                if (!Directory.Exists(_contentDirectory)) return allContent;
                var categories = Directory.GetDirectories(_contentDirectory);

                foreach (var categoryPath in categories)
                {
                    var category = Path.GetFileName(categoryPath);
                    var files = Directory.GetFiles(categoryPath, "*.json");

                    foreach (var file in files)
                    {
                        var json = await File.ReadAllTextAsync(file);
                        var content = JsonSerializer.Deserialize<ContentData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                        if (content != null)
                        {
                            content.Category = category;
                            content.Slug = Path.GetFileNameWithoutExtension(file);
                            allContent.Add(content);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Błąd ładowania wszystkich treści");
            }
            return allContent;
        }
    }

    #endregion
}
