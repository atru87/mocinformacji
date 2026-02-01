# Rozwiązanie błędu "Only one compilation unit can have top-level statements"

## 🔴 Przyczyna błędu:

Ten błąd oznacza, że masz **więcej niż jeden plik z top-level statements** w projekcie.

Top-level statements to kod bez klasy/metody Main, np:
```csharp
var builder = WebApplication.CreateBuilder(args); // ← To jest top-level statement
```

## 🔍 Sprawdź:

### 1. Czy masz tylko jeden Program.cs?
```bash
# W katalogu projektu wykonaj:
dir /s Program.cs
# lub na Linux/Mac:
find . -name "Program.cs"
```

**Powinien być TYLKO JEDEN Program.cs w głównym katalogu projektu.**

### 2. Czy przypadkiem nie masz starego Program.cs.bak?
Czasem edytory tworzą kopie zapasowe:
- `Program.cs.bak`
- `Program.cs.old`
- `Program.cs~`

**Usuń wszystkie kopie!**

## ✅ Rozwiązanie:

### Opcja 1: Usuń stary Program.cs
```bash
# Usuń wszystkie Program.cs w projekcie
# Następnie wgraj TYLKO ten plik:
```

### Opcja 2: Upewnij się że używasz tego Program.cs:

```csharp
using MocInformacji.Pages;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Rejestracja repository jako Singleton
builder.Services.AddSingleton<IContentRepository, JsonFileContentRepository>();

// Konfiguracja Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
```

## 📁 Struktura projektu (Opcja A):

```
MocInformacji/
├── Program.cs                    ← TYLKO TEN PLIK (bez Services/ImageFixerService)
├── Pages/
│   ├── Shared/
│   │   └── _Layout.cshtml
│   ├── Index.cshtml
│   ├── Index.cshtml.cs
│   ├── DynamicContent.cshtml
│   ├── DynamicContent.cshtml.cs
│   ├── Category.cshtml
│   ├── Category.cshtml.cs
│   ├── Search.cshtml
│   └── Search.cshtml.cs
├── Content/                      ← Twoje JSON-y
│   ├── finanse/
│   ├── prawo/
│   └── ...
└── wwwroot/                      ← Pliki statyczne
```

## ❌ NIE powinno być (dla Opcji A):

```
Services/
└── ImageFixerService.cs          ← USUŃ ten folder

Pages/
└── Admin/
    └── FixImages.cshtml          ← USUŃ ten folder
```

## 🔧 Kroki naprawcze:

1. **Usuń folder `Services/`** (jeśli istnieje)
2. **Usuń folder `Pages/Admin/`** (jeśli istnieje)
3. **Sprawdź czy masz tylko jeden Program.cs**
4. **Upewnij się że Program.cs NIE zawiera:**
   ```csharp
   using MocInformacji.Services;  // ← TO USUŃ
   builder.Services.AddHttpClient<ImageFixerService>(); // ← TO USUŃ
   ```

5. **Rebuild projektu:**
   ```bash
   dotnet clean
   dotnet build
   ```

## 🎯 Program.cs dla Opcji A - FINAL VERSION:

**Ten plik powinien mieć DOKŁADNIE taki kod:**

```csharp
using MocInformacji.Pages;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Rejestracja repository jako Singleton
builder.Services.AddSingleton<IContentRepository, JsonFileContentRepository>();

// Konfiguracja Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
```

## ✅ Po naprawie:

```bash
dotnet run
```

Powinno zadziałać bez błędów!

## 💡 Jeśli nadal błąd:

1. Pokaż mi wynik:
   ```bash
   dir /s Program.cs
   ```

2. Albo:
   ```bash
   dotnet build --verbosity detailed
   ```
   
   I pokaż mi cały komunikat błędu.
