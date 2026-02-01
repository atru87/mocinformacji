using System.Text.Json;
using System.Text.RegularExpressions;

namespace MocInformacji.Services
{
    /// <summary>
    /// Serwis do automatycznej aktualizacji niedziałających obrazów w plikach JSON
    /// </summary>
    public class ImageFixerService
    {
        private readonly string _contentDirectory;
        private readonly ILogger<ImageFixerService> _logger;
        private readonly HttpClient _httpClient;
        private const string UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

        public ImageFixerService(
            IWebHostEnvironment env,
            ILogger<ImageFixerService> logger,
            HttpClient httpClient)
        {
            _contentDirectory = Path.Combine(env.ContentRootPath, "Content");
            _logger = logger;
            _httpClient = httpClient;
        }

        /// <summary>
        /// Sprawdza wszystkie pliki JSON i naprawia niedziałające obrazy
        /// </summary>
        public async Task<ImageFixReport> FixAllImagesAsync()
        {
            var report = new ImageFixReport();

            if (!Directory.Exists(_contentDirectory))
            {
                _logger.LogWarning("Content directory not found: {Directory}", _contentDirectory);
                return report;
            }

            var categories = Directory.GetDirectories(_contentDirectory);

            foreach (var categoryPath in categories)
            {
                var category = Path.GetFileName(categoryPath);
                var files = Directory.GetFiles(categoryPath, "*.json");

                foreach (var filePath in files)
                {
                    try
                    {
                        await FixImageInFileAsync(filePath, category, report);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error fixing image in file: {File}", filePath);
                        report.Errors.Add($"{filePath}: {ex.Message}");
                    }
                }
            }

            return report;
        }

        private async Task FixImageInFileAsync(string filePath, string category, ImageFixReport report)
        {
            var json = await File.ReadAllTextAsync(filePath);
            var doc = JsonDocument.Parse(json);

            var root = doc.RootElement;
            if (!root.TryGetProperty("FeaturedImage", out var imageProperty))
            {
                report.Skipped++;
                return;
            }

            var imageUrl = imageProperty.GetString();

            // Check if image is placeholder or broken
            if (string.IsNullOrEmpty(imageUrl) || 
                imageUrl.Contains("placeholder") ||
                imageUrl.Contains("placehold") ||
                !await IsImageAccessibleAsync(imageUrl))
            {
                _logger.LogInformation("Fixing image for: {File}", Path.GetFileName(filePath));

                // Get article title for better image search
                var title = root.TryGetProperty("Title", out var titleProp) 
                    ? titleProp.GetString() 
                    : "article";

                // Get new image from Unsplash
                var newImageUrl = await GetNewImageFromUnsplashAsync(category, title);

                if (!string.IsNullOrEmpty(newImageUrl))
                {
                    // Update JSON
                    var updatedJson = UpdateImageInJson(json, newImageUrl);
                    await File.WriteAllTextAsync(filePath, updatedJson);

                    report.Fixed++;
                    report.FixedFiles.Add(new ImageFixDetail
                    {
                        FilePath = filePath,
                        OldUrl = imageUrl,
                        NewUrl = newImageUrl
                    });

                    _logger.LogInformation("Fixed: {File} - Old: {Old}, New: {New}", 
                        Path.GetFileName(filePath), imageUrl, newImageUrl);
                }
                else
                {
                    // Use static fallback
                    var fallbackUrl = GetStaticFallbackUrl(category);
                    var updatedJson = UpdateImageInJson(json, fallbackUrl);
                    await File.WriteAllTextAsync(filePath, updatedJson);

                    report.Fixed++;
                    report.FixedFiles.Add(new ImageFixDetail
                    {
                        FilePath = filePath,
                        OldUrl = imageUrl,
                        NewUrl = fallbackUrl,
                        UsedStaticFallback = true
                    });
                }
            }
            else
            {
                report.Skipped++;
            }
        }

        private async Task<bool> IsImageAccessibleAsync(string url)
        {
            try
            {
                var response = await _httpClient.SendAsync(
                    new HttpRequestMessage(HttpMethod.Head, url),
                    HttpCompletionOption.ResponseHeadersRead);

                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private async Task<string> GetNewImageFromUnsplashAsync(string category, string articleTitle)
        {
            if (string.IsNullOrEmpty(UNSPLASH_ACCESS_KEY) || 
                UNSPLASH_ACCESS_KEY == "YOUR_UNSPLASH_ACCESS_KEY")
            {
                return null;
            }

            try
            {
                var searchTerm = GetSearchTermForCategory(category);
                var url = $"https://api.unsplash.com/photos/random?query={searchTerm}&orientation=landscape";

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Client-ID {UNSPLASH_ACCESS_KEY}");

                var response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var doc = JsonDocument.Parse(json);

                    if (doc.RootElement.TryGetProperty("urls", out var urls) &&
                        urls.TryGetProperty("regular", out var regularUrl))
                    {
                        return regularUrl.GetString() + "?w=1080&h=630&fit=crop&q=80";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching image from Unsplash for category: {Category}", category);
            }

            return null;
        }

        private string GetSearchTermForCategory(string category)
        {
            var searchTerms = new Dictionary<string, string[]>
            {
                ["finanse"] = new[] { "finance", "money", "banking", "investment" },
                ["prawo"] = new[] { "law", "justice", "legal", "court" },
                ["technologia"] = new[] { "technology", "computer", "coding", "digital" },
                ["zdrowie"] = new[] { "health", "medical", "healthcare", "wellness" },
                ["biznes"] = new[] { "business", "office", "corporate", "professional" }
            };

            if (searchTerms.TryGetValue(category.ToLower(), out var terms))
            {
                return terms[new Random().Next(terms.Length)];
            }

            return "abstract background";
        }

        private string GetStaticFallbackUrl(string category)
        {
            var fallbacks = new Dictionary<string, string>
            {
                ["finanse"] = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1080&h=630&fit=crop&q=80",
                ["prawo"] = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1080&h=630&fit=crop&q=80",
                ["technologia"] = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&h=630&fit=crop&q=80",
                ["zdrowie"] = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=630&fit=crop&q=80",
                ["biznes"] = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&h=630&fit=crop&q=80"
            };

            return fallbacks.GetValueOrDefault(category.ToLower(), 
                "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1080&h=630&fit=crop&q=80");
        }

        private string UpdateImageInJson(string json, string newImageUrl)
        {
            // Simple regex replacement for FeaturedImage field
            var pattern = @"""FeaturedImage""\s*:\s*""[^""]*""";
            var replacement = $"\"FeaturedImage\": \"{newImageUrl}\"";
            return Regex.Replace(json, pattern, replacement);
        }
    }

    public class ImageFixReport
    {
        public int Fixed { get; set; }
        public int Skipped { get; set; }
        public List<ImageFixDetail> FixedFiles { get; set; } = new();
        public List<string> Errors { get; set; } = new();

        public override string ToString()
        {
            return $"Fixed: {Fixed}, Skipped: {Skipped}, Errors: {Errors.Count}";
        }
    }

    public class ImageFixDetail
    {
        public string FilePath { get; set; }
        public string OldUrl { get; set; }
        public string NewUrl { get; set; }
        public bool UsedStaticFallback { get; set; }
    }
}
