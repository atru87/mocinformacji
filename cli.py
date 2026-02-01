#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI Interface dla SEO Content Generator
Łatwy w użyciu interface do generowania treści
"""

import argparse
import json
import os
import sys
from pathlib import Path
from advanced_seo_generator import AdvancedSEOGenerator


def load_config(config_path: str = "config.json"):
    """Ładuje konfigurację z pliku JSON"""
    if not os.path.exists(config_path):
        print(f"❌ Plik konfiguracyjny {config_path} nie istnieje")
        sys.exit(1)
    
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def list_niches(config):
    """Wyświetla dostępne nisze"""
    print("\n📚 Dostępne nisze:\n")
    for niche_id, niche_data in config['niches'].items():
        print(f"  • {niche_id:15} - {niche_data['displayName']}")
        print(f"    {niche_data['description']}")
        print(f"    Seed keywords: {len(niche_data['seedKeywords'])}")
        print()


def generate_for_niche(niche: str, count: int, output_dir: str, api_key: str, config: dict):
    """Generuje treści dla wybranej niszy"""
    
    # Walidacja niszy
    if niche not in config['niches']:
        print(f"❌ Nieznana nisza: {niche}")
        print(f"Dostępne: {', '.join(config['niches'].keys())}")
        sys.exit(1)
    
    niche_config = config['niches'][niche]
    
    print(f"\n🚀 Generowanie treści dla niszy: {niche_config['displayName']}")
    print(f"📁 Output: {output_dir}")
    print(f"🔢 Liczba artykułów: {count}\n")
    
    # Inicjalizacja generatora
    generator = AdvancedSEOGenerator(niche=niche, api_key=api_key)
    
    # Research fraz
    seed_keywords = niche_config['seedKeywords'][:20]  # Ograniczenie dla szybszego działania
    
    print("🔍 KROK 1: Research fraz...")
    phrases = generator.full_keyword_research(seed_keywords)
    
    # Eksport fraz
    csv_path = os.path.join(output_dir, f'frazy_{niche}.csv')
    os.makedirs(output_dir, exist_ok=True)
    
    import csv
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['fraza', 'źródło', 'wyszukiwania', 'trend'])
        writer.writeheader()
        writer.writerows(phrases)
    
    print(f"✅ Zebrano {len(phrases)} fraz → {csv_path}")
    
    # Generowanie treści
    print(f"\n✍️  KROK 2: Generowanie {count} artykułów...")
    top_phrases = phrases[:count]
    generator.generate_content_batch(top_phrases, output_dir)
    
    # Statystyki
    print("\n" + "="*60)
    print("📊 STATYSTYKI GENEROWANIA")
    print("="*60)
    
    content_dir = os.path.join(output_dir, 'Content')
    if os.path.exists(content_dir):
        for category in os.listdir(content_dir):
            category_path = os.path.join(content_dir, category)
            if os.path.isdir(category_path):
                count_files = len([f for f in os.listdir(category_path) if f.endswith('.json')])
                print(f"  {category:20} {count_files} artykułów")
    
    print("="*60)
    print(f"\n✅ ZAKOŃCZONO - pliki w: {output_dir}\n")


def validate_content(content_dir: str):
    """Waliduje wygenerowane treści"""
    print("\n🔍 Walidacja treści...\n")
    
    issues = []
    total_files = 0
    
    for root, dirs, files in os.walk(content_dir):
        for file in files:
            if file.endswith('.json'):
                total_files += 1
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    try:
                        content = json.load(f)
                        
                        # Sprawdź pola
                        required_fields = ['title', 'h1', 'metaDescription', 'article', 'faq']
                        missing = [field for field in required_fields if not content.get(field)]
                        
                        if missing:
                            issues.append(f"{file}: brak pól {missing}")
                        
                        # Sprawdź długość
                        article_text = content.get('article', '').replace('<', ' ').replace('>', ' ')
                        word_count = len(article_text.split())
                        
                        if word_count < 600:
                            issues.append(f"{file}: za krótki artykuł ({word_count} słów)")
                        
                    except json.JSONDecodeError:
                        issues.append(f"{file}: błąd parsowania JSON")
    
    print(f"Sprawdzono plików: {total_files}")
    
    if issues:
        print(f"\n⚠️  Znaleziono {len(issues)} problemów:\n")
        for issue in issues[:10]:  # Pokaż max 10
            print(f"  • {issue}")
        if len(issues) > 10:
            print(f"  ... i {len(issues) - 10} więcej")
    else:
        print("\n✅ Wszystkie pliki przeszły walidację!")
    
    print()


def main():
    parser = argparse.ArgumentParser(
        description='SEO Content Generator dla MocInformacji.pl',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Przykłady użycia:

  # Lista dostępnych nisz
  python cli.py --list-niches
  
  # Generuj 20 artykułów dla finansów
  python cli.py --niche finanse --count 20 --output ./output
  
  # Waliduj wygenerowane treści
  python cli.py --validate ./output/Content
  
  # Generuj dla wszystkich nisz (po 10 artykułów)
  python cli.py --all --count 10 --output ./output
        """
    )
    
    parser.add_argument('--niche', type=str, help='Nazwa niszy (np. finanse, prawo)')
    parser.add_argument('--count', type=int, default=20, help='Liczba artykułów do wygenerowania (default: 20)')
    parser.add_argument('--output', type=str, default='./output', help='Folder output (default: ./output)')
    parser.add_argument('--config', type=str, default='config.json', help='Plik konfiguracyjny (default: config.json)')
    parser.add_argument('--list-niches', action='store_true', help='Wyświetl dostępne nisze')
    parser.add_argument('--validate', type=str, help='Waliduj treści w podanym katalogu')
    parser.add_argument('--all', action='store_true', help='Generuj dla wszystkich nisz')
    parser.add_argument('--api-key', type=str, help='Anthropic API key (lub ustaw ANTHROPIC_API_KEY)')
    
    args = parser.parse_args()
    
    # Załaduj config
    config = load_config(args.config)
    
    # Lista nisz
    if args.list_niches:
        list_niches(config)
        return
    
    # Walidacja
    if args.validate:
        validate_content(args.validate)
        return
    
    # API Key
    api_key = args.api_key or os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ Brak API key. Ustaw --api-key lub zmienną ANTHROPIC_API_KEY")
        sys.exit(1)
    
    # Generowanie dla wszystkich nisz
    if args.all:
        for niche in config['niches'].keys():
            output_dir = os.path.join(args.output, niche)
            generate_for_niche(niche, args.count, output_dir, api_key, config)
        return
    
    # Generowanie dla jednej niszy
    if args.niche:
        generate_for_niche(args.niche, args.count, args.output, api_key, config)
    else:
        print("❌ Podaj --niche lub użyj --all")
        print("Użyj --help aby zobaczyć wszystkie opcje")
        sys.exit(1)


if __name__ == "__main__":
    main()
