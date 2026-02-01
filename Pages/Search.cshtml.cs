using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MocInformacji.Pages
{
    public class SearchModel : PageModel
    {
        private readonly IContentRepository _contentRepository;
        private readonly ILogger<SearchModel> _logger;

        [BindProperty(SupportsGet = true)]
        public string Query { get; set; }

        public List<ContentData> Results { get; set; } = new();

        public SearchModel(
            IContentRepository contentRepository,
            ILogger<SearchModel> logger)
        {
            _contentRepository = contentRepository;
            _logger = logger;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (!string.IsNullOrEmpty(Query))
            {
                var allContent = await _contentRepository.GetAllContentAsync();
                
                // Wyszukiwanie w tytułach, opisach i treściach
                Results = allContent
                    .Where(c => 
                        c.Title.Contains(Query, StringComparison.OrdinalIgnoreCase) ||
                        c.MetaDescription.Contains(Query, StringComparison.OrdinalIgnoreCase) ||
                        c.H1.Contains(Query, StringComparison.OrdinalIgnoreCase)
                    )
                    .OrderByDescending(c => c.LastModified)
                    .ToList();

                _logger.LogInformation($"Wyszukiwanie: '{Query}' - znaleziono {Results.Count} wyników");
            }

            return Page();
        }
    }
}
