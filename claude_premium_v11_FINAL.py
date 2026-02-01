#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🚀 CLAUDE PREMIUM AUTOPILOT v11.0 FINAL
• Fixed 404 API error
• Optimized prompts & costs
• Better logging
• Intelligent batching
• VS articles without FAQ
"""

import json
import os
import re
import time
import requests
from datetime import datetime
from typing import List, Dict, Set, Optional, Tuple

# Google Trends
try:
    from pytrends.request import TrendReq
    TRENDS_AVAILABLE = True
except ImportError:
    TRENDS_AVAILABLE = False

# RSS Parser
try:
    import feedparser
    RSS_AVAILABLE = True
except ImportError:
    RSS_AVAILABLE = False

class ClaudePremiumAutopilot:
    def __init__(self, config_path: str = "config.json", keys_path: str = "keys.config"):
        self.config = self._load_json(config_path)
        self.keys = self._load_json(keys_path)
        
        self._validate_keys()
        
        # NextJS Directories
        self.base_content_dir = os.path.join(os.getcwd(), 'public', 'content')
        self.vs_seed_file = os.path.join(os.getcwd(), 'vs_seed_list.json')
        self.pool_file = os.path.join(os.getcwd(), 'keywords_pool.json')
        self.progress_file = os.path.join(os.getcwd(), 'progress_claude.json')
        os.makedirs(self.base_content_dir, exist_ok=True)
        
        # State
        self.existing_slugs = self._get_existing_slugs()
        self.existing_keywords = self._get_existing_keywords()
        self.progress_data = self._load_progress()
        self.total_cost = 0.0
        self.articles_stats = {"success": 0, "failed": 0, "total_words": 0}
        
        # Initialize VS seed list
        self._init_vs_seed_list()
        
        # Trends
        if TRENDS_AVAILABLE:
            self.pytrends = TrendReq(hl='pl', tz=60)
        else:
            self.pytrends = None
        
        self._print_status()

    def _load_json(self, path: str) -> dict:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Error loading {path}: {e}")
            exit(1)

    def _validate_keys(self):
        if not self.keys.get('claude', {}).get('api_key'):
            print(f"❌ CLAUDE_API_KEY missing in keys.config")
            exit(1)
        
        # Validate key format
        api_key = self.keys['claude']['api_key']
        if not api_key.startswith('sk-ant-'):
            print(f"⚠️  Warning: API key doesn't start with 'sk-ant-'")

    def _print_status(self):
        print(f"\n{'='*70}")
        print(f"🚀 CLAUDE PREMIUM AUTOPILOT v11.0 FINAL")
        print(f"{'='*70}")
        print(f"📂 Existing articles: {len(self.existing_slugs)}")
        print(f"💰 Budget: ${self.keys.get('budget', {}).get('claude_total_budget', 10):.2f}")
        print(f"📍 Output: {self.base_content_dir}")
        print(f"{'='*70}\n")

    def _get_existing_slugs(self) -> Set[str]:
        slugs = set()
        if not os.path.exists(self.base_content_dir):
            return slugs
        for root, _, files in os.walk(self.base_content_dir):
            for f in files:
                if f.endswith('.json'):
                    slugs.add(f.replace('.json', ''))
        return slugs

    def _get_existing_keywords(self) -> Set[str]:
        keywords = set()
        if not os.path.exists(self.base_content_dir):
            return keywords
        
        for root, _, files in os.walk(self.base_content_dir):
            for f in files:
                if f.endswith('.json'):
                    try:
                        with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                            data = json.load(file)
                            title = data.get('Title', '').lower()
                            if title:
                                keywords.add(title)
                    except:
                        pass
        
        return keywords

    def _load_progress(self) -> dict:
        if os.path.exists(self.progress_file):
            try:
                with open(self.progress_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return {
            "articles_generated": 0,
            "vs_generated": 0,
            "total_cost": 0.0,
            "by_category": {},
            "success_rate": 1.0
        }

    def _save_progress(self):
        try:
            self.progress_data['total_cost'] = self.total_cost
            self.progress_data['last_run'] = datetime.now().isoformat()
            if self.articles_stats['success'] + self.articles_stats['failed'] > 0:
                self.progress_data['success_rate'] = (
                    self.articles_stats['success'] / (self.articles_stats['success'] + self.articles_stats['failed'])
                )
            
            with open(self.progress_file, 'w', encoding='utf-8') as f:
                json.dump(self.progress_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"⚠️ Progress save error: {e}")

    def _create_slug(self, phrase: str) -> str:
        s = phrase.lower()
        repl = {'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ó':'o', 'ś':'s', 'ź':'z', 'ż':'z', ' ':'-'}
        for k, v in repl.items():
            s = s.replace(k, v)
        s = re.sub(r'[^a-z0-9-]', '', s).strip('-')
        return re.sub(r'-+', '-', s)

    def categorize_keyword(self, keyword: str) -> str:
        kw = keyword.lower()
        
        if any(t in kw for t in ['kredyt', 'hipoteczny', 'pit', 'podatek', 'ulga', 'bank', 'oszczędności', 'inwestycj', 'emerytur', 'finans', 'obligacj', 'akcj']):
            return 'finanse'
        if any(t in kw for t in ['dieta', 'odchudzanie', 'bmi', 'kalori', 'fitness', 'trening', 'zdrowie', 'chorob', 'witamin', 'lek', 'suplement']):
            return 'zdrowie'
        if any(t in kw for t in ['laptop', 'komputer', 'telefon', 'smartfon', 'aplikacj', 'program', 'ai', 'vpn', 'technolog', 'internet']):
            return 'technologia'
        if any(t in kw for t in ['biznes', 'firma', 'marketing', 'sprzedaż', 'startup', 'przedsiębior', 'zarządzanie']):
            return 'biznes'
        if any(t in kw for t in ['prawo', 'prawnik', 'umowa', 'rozwód', 'spadek', 'testament', 'sąd', 'pozew']):
            return 'prawo'
        if any(t in kw for t in ['mieszkanie', 'dom', 'nieruchom', 'wynajem', 'kupno', 'sprzedaż', 'lokal']):
            return 'nieruchomosci'
        if any(t in kw for t in ['samochód', 'auto', 'pojazd', 'silnik', 'opony', 'przegląd', 'ubezpieczenie', 'leasing', 'motoryzacj']):
            return 'motoryzacja'
        
        return 'technologia'

    # ==================== VS SEED LIST ====================
    
    def _init_vs_seed_list(self):
        """Initialize 55 evergreen VS comparisons"""
        if os.path.exists(self.vs_seed_file):
            return
        
        seed_data = {
            "generated_date": datetime.now().strftime("%Y-%m-%d"),
            "vs_comparisons": [
                # FINANSE (15)
                {"a": "Kredyt hipoteczny", "b": "Kredyt gotówkowy", "category": "finanse", "priority": 10},
                {"a": "Leasing", "b": "Kredyt na samochód", "category": "finanse", "priority": 10},
                {"a": "Lokata bankowa", "b": "Obligacje skarbowe", "category": "finanse", "priority": 9},
                {"a": "IKE", "b": "IKZE", "category": "finanse", "priority": 9},
                {"a": "Karta kredytowa", "b": "Karta debetowa", "category": "finanse", "priority": 9},
                {"a": "Kredyt stały", "b": "Kredyt zmienny", "category": "finanse", "priority": 8},
                {"a": "Refinansowanie kredytu", "b": "Konsolidacja kredytów", "category": "finanse", "priority": 8},
                {"a": "Rozliczenie PIT", "b": "Ryczałt", "category": "finanse", "priority": 8},
                {"a": "Fundusz inwestycyjny", "b": "ETF", "category": "finanse", "priority": 7},
                {"a": "Oszczędzanie", "b": "Inwestowanie", "category": "finanse", "priority": 7},
                {"a": "Akcje", "b": "Obligacje", "category": "finanse", "priority": 7},
                {"a": "Podatek liniowy", "b": "Skala podatkowa", "category": "finanse", "priority": 7},
                {"a": "Kredyt gotówkowy", "b": "Pożyczka ratalna", "category": "finanse", "priority": 6},
                {"a": "Rachunek oszczędnościowy", "b": "Lokata terminowa", "category": "finanse", "priority": 6},
                {"a": "Zakup za gotówkę", "b": "Zakup na kredyt", "category": "finanse", "priority": 6},
                
                # ZDROWIE (10)
                {"a": "Dieta ketogeniczna", "b": "Dieta low-carb", "category": "zdrowie", "priority": 9},
                {"a": "Trening siłowy", "b": "Trening cardio", "category": "zdrowie", "priority": 9},
                {"a": "Białko serwatkowe", "b": "Białko roślinne", "category": "zdrowie", "priority": 8},
                {"a": "Bieżnia", "b": "Rower stacjonarny", "category": "zdrowie", "priority": 7},
                {"a": "Joga", "b": "Pilates", "category": "zdrowie", "priority": 7},
                {"a": "Szpital publiczny", "b": "Szpital prywatny", "category": "zdrowie", "priority": 8},
                {"a": "NFZ", "b": "Prywatna opieka medyczna", "category": "zdrowie", "priority": 8},
                {"a": "Suplementy", "b": "Naturalna dieta", "category": "zdrowie", "priority": 6},
                {"a": "Dieta wegańska", "b": "Dieta wegetariańska", "category": "zdrowie", "priority": 6},
                {"a": "Trening rano", "b": "Trening wieczorem", "category": "zdrowie", "priority": 5},
                
                # TECHNOLOGIA (10)
                {"a": "iPhone", "b": "Android", "category": "technologia", "priority": 10},
                {"a": "Windows", "b": "macOS", "category": "technologia", "priority": 9},
                {"a": "SSD", "b": "HDD", "category": "technologia", "priority": 8},
                {"a": "Wi-Fi", "b": "Ethernet", "category": "technologia", "priority": 7},
                {"a": "VPN darmowy", "b": "VPN płatny", "category": "technologia", "priority": 9},
                {"a": "Laptop", "b": "Komputer stacjonarny", "category": "technologia", "priority": 8},
                {"a": "Dysk w chmurze", "b": "Dysk lokalny", "category": "technologia", "priority": 7},
                {"a": "Antywirus darmowy", "b": "Antywirus płatny", "category": "technologia", "priority": 6},
                {"a": "Chrome", "b": "Firefox", "category": "technologia", "priority": 6},
                {"a": "Intel", "b": "AMD", "category": "technologia", "priority": 7},
                
                # BIZNES (8)
                {"a": "B2B", "b": "B2C", "category": "biznes", "priority": 9},
                {"a": "E-commerce", "b": "Sklep stacjonarny", "category": "biznes", "priority": 8},
                {"a": "Dropshipping", "b": "Własny magazyn", "category": "biznes", "priority": 8},
                {"a": "Facebook Ads", "b": "Google Ads", "category": "biznes", "priority": 9},
                {"a": "Email marketing", "b": "Social media marketing", "category": "biznes", "priority": 7},
                {"a": "Outsourcing", "b": "Własny zespół", "category": "biznes", "priority": 7},
                {"a": "Startup", "b": "Franczyza", "category": "biznes", "priority": 6},
                {"a": "Spółka", "b": "Działalność gospodarcza", "category": "biznes", "priority": 8},
                
                # PRAWO (5)
                {"a": "Umowa o pracę", "b": "Umowa zlecenie", "category": "prawo", "priority": 10},
                {"a": "Umowa o dzieło", "b": "Umowa zlecenie", "category": "prawo", "priority": 9},
                {"a": "Rozwód", "b": "Separacja", "category": "prawo", "priority": 8},
                {"a": "Testament notarialny", "b": "Testament holograficzny", "category": "prawo", "priority": 7},
                {"a": "Mediacja", "b": "Proces sądowy", "category": "prawo", "priority": 7},
                
                # NIERUCHOMOŚCI (7)
                {"a": "Kupno mieszkania", "b": "Wynajem mieszkania", "category": "nieruchomosci", "priority": 10},
                {"a": "Mieszkanie", "b": "Dom", "category": "nieruchomosci", "priority": 9},
                {"a": "Nowe mieszkanie", "b": "Używane mieszkanie", "category": "nieruchomosci", "priority": 8},
                {"a": "Centrum miasta", "b": "Przedmieścia", "category": "nieruchomosci", "priority": 7},
                {"a": "Rynek pierwotny", "b": "Rynek wtórny", "category": "nieruchomosci", "priority": 8},
                {"a": "Wynajem długoterminowy", "b": "Wynajem krótkoterminowy", "category": "nieruchomosci", "priority": 7},
                {"a": "Mieszkanie za gotówkę", "b": "Mieszkanie na kredyt", "category": "nieruchomosci", "priority": 9}
            ]
        }
        
        with open(self.vs_seed_file, 'w', encoding='utf-8') as f:
            json.dump(seed_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Created VS seed list: {len(seed_data['vs_comparisons'])} comparisons")

    def check_vs_exists(self, topic_a: str, topic_b: str) -> bool:
        """Check if VS already exists (both directions)"""
        slug_ab = self._create_slug(f"{topic_a}-vs-{topic_b}")
        slug_ba = self._create_slug(f"{topic_b}-vs-{topic_a}")
        
        if slug_ab in self.existing_slugs or slug_ba in self.existing_slugs:
            return True
        
        title_ab = f"{topic_a} vs {topic_b}".lower()
        title_ba = f"{topic_b} vs {topic_a}".lower()
        
        for existing in self.existing_keywords:
            if title_ab in existing or title_ba in existing:
                return True
        
        return False

    def get_vs_comparisons(self, count: int, category: str = None) -> List[Tuple[str, str, str]]:
        """Get VS comparisons from seed list"""
        with open(self.vs_seed_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        comparisons = data['vs_comparisons']
        
        if category:
            comparisons = [c for c in comparisons if c['category'] == category]
        
        comparisons.sort(key=lambda x: x.get('priority', 0), reverse=True)
        
        result = []
        for comp in comparisons:
            if len(result) >= count:
                break
            
            if not self.check_vs_exists(comp['a'], comp['b']):
                result.append((comp['a'], comp['b'], comp['category']))
        
        return result

    # ==================== BATCH VS GENERATION ====================
    
    def generate_vs_batch(self, comparisons: List[Tuple[str, str, str]]) -> List[Dict]:
        """Generate multiple VS articles in ONE API call"""
        
        print(f"\n{'='*70}")
        print(f"📦 BATCH GENERATION: {len(comparisons)} articles")
        print(f"{'='*70}")
        
        for idx, (a, b, cat) in enumerate(comparisons, 1):
            print(f"   {idx}. {a} vs {b} [{cat}]")
        
        comparisons_text = ""
        for idx, (a, b, cat) in enumerate(comparisons, 1):
            comparisons_text += f"{idx}. {a} vs {b} (kategoria: {cat})\n"
        
        # OPTIMIZED PROMPT - shorter, clearer
        prompt = f"""Napisz {len(comparisons)} profesjonalnych artykułów porównawczych.

PORÓWNANIA:
{comparisons_text}

STRUKTURA (każdy artykuł):

<p>INTRO (200-300 słów): Dlaczego ten wybór jest ważny, co zyskasz czytając, realny problem. BEZ spoilerów werdyktu!</p>

<h2>Tabela Porównawcza</h2>
<table class="comparison-table">
<thead><tr><th>Kryterium</th><th>[A]</th><th>[B]</th><th>Zwycięzca</th></tr></thead>
<tbody>
<tr><td>Cena</td><td>KONKRETNA</td><td>KONKRETNA</td><td class="winner-cell">🏆 Który</td></tr>
<!-- 10-12 rzędów FAKTYCZNE dane -->
</tbody>
</table>

<h2>Co to jest [A]?</h2>
<p>600-800 słów: definicja, przykłady, zastosowanie</p>

<h2>Co to jest [B]?</h2>
<p>600-800 słów: definicja, przykłady, zastosowanie</p>

<h2>5 Kluczowych Różnic</h2>
<h3>1. [Nazwa]</h3>
<p>400-500 słów z konkretnymi danymi</p>
<!-- kolejne 4 różnice -->

<h2>Kiedy Wybrać [A]?</h2>
<ul><li><strong>Scenariusz:</strong> Opis + przykład</li><!-- 5-7 punktów --></ul>

<h2>Kiedy Wybrać [B]?</h2>
<ul><li><strong>Scenariusz:</strong> Opis + przykład</li><!-- 5-7 punktów --></ul>

<h2>🎯 Szybka Odpowiedź</h2>
<div class="quick-answer">
<strong>Wybierz [A] jeśli:</strong>
<ul><li>Praktyczny scenariusz 1</li><li>Scenariusz 2</li><li>Scenariusz 3</li></ul>
<strong>Wybierz [B] jeśli:</strong>
<ul><li>Praktyczny scenariusz 1</li><li>Scenariusz 2</li><li>Scenariusz 3</li></ul>
</div>

<h2>Werdykt</h2>
<div class="verdict">
<strong>🏆 ZWYCIĘZCA:</strong> Który i dlaczego
<strong>💡 REKOMENDACJA:</strong> Dla kogo co
</div>

WYMAGANIA:
• 5000-6000 słów KAŻDY
• Jak ekspert (testował oba)
• Zero ogólników
• Konkretne liczby/ceny
• Tabela z faktami

JSON format:
{{
  "articles": [
    {{
      "comparison_id": 1,
      "topic_a": "A",
      "topic_b": "B",
      "category": "kat",
      "html": "...",
      "word_count": 5500,
      "winner": "topic_a"|"topic_b"|"tie"
    }}
  ]
}}"""

        print(f"\n🚀 Wysyłam do Claude API...")
        print(f"   Model: claude-sonnet-4-20250514")
        print(f"   Timeout: 5 minut")
        print(f"   Szacowany czas: {len(comparisons) * 30}-{len(comparisons) * 45}s")
        
        start_time = time.time()
        response = self._call_claude_retry(prompt, json_mode=True, temp=0.8)
        elapsed = time.time() - start_time
        
        print(f"\n✅ Odpowiedź otrzymana w {elapsed:.1f}s")
        
        if not response or not response.get("success"):
            print(f"❌ Generation failed")
            return []
        
        try:
            print(f"🔍 Parsowanie JSON...")
            content = re.sub(r'```json|```', '', response["content"])
            data = json.loads(content)
            articles = data.get('articles', [])
            
            print(f"✅ Sparsowano: {len(articles)} artykułów")
            print(f"💰 Koszt batcha: ${response.get('cost', 0):.2f}")
            
            for idx, article in enumerate(articles, 1):
                wc = article.get('word_count', 0)
                winner = article.get('winner', '?')
                print(f"   {idx}. {wc}w | Zwycięzca: {winner}")
            
            return articles
            
        except Exception as e:
            print(f"❌ Parse error: {e}")
            return []

    def save_vs_article(self, article: Dict, comparisons: List[Tuple]) -> bool:
        """Save VS article"""
        try:
            idx = article.get('comparison_id', 1) - 1
            if idx >= len(comparisons):
                return False
            
            topic_a, topic_b, category = comparisons[idx]
            
            title = f"{topic_a} vs {topic_b} - Które Wybrać? [Porównanie 2026]"
            slug = self._create_slug(f"{topic_a}-vs-{topic_b}")
            
            category_path = os.path.join(self.base_content_dir, category)
            os.makedirs(category_path, exist_ok=True)
            
            filepath = os.path.join(category_path, f"{slug}.json")
            
            article_data = {
                "Title": title,
                "H1": title,
                "MetaDescription": f"Szczegółowe porównanie {topic_a} vs {topic_b}. Tabele, fakty, werdykt [2026]"[:155],
                "Article": article['html'],
                "Slug": slug,
                "Category": category,
                "LastModified": datetime.now().isoformat(),
                "ComparisonType": "vs",
                "TopicA": topic_a,
                "TopicB": topic_b,
                "Winner": article.get('winner', 'tie')
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(article_data, f, ensure_ascii=False, indent=2)
            
            self.existing_slugs.add(slug)
            self.existing_keywords.add(title.lower())
            self.progress_data['vs_generated'] = self.progress_data.get('vs_generated', 0) + 1
            
            if 'by_category' not in self.progress_data:
                self.progress_data['by_category'] = {}
            self.progress_data['by_category'][category] = self.progress_data['by_category'].get(category, 0) + 1
            
            self.articles_stats['success'] += 1
            self.articles_stats['total_words'] += article.get('word_count', 0)
            
            print(f"   💾 {topic_a} vs {topic_b}")
            print(f"      📁 {filepath}")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Save error: {e}")
            self.articles_stats['failed'] += 1
            return False

    # ==================== CLAUDE API ====================
    
    def _call_claude_retry(self, prompt: str, json_mode: bool = False, temp: float = 0.7, max_retries: int = 3) -> Optional[Dict]:
        """Call Claude with retry"""
        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    wait_time = 2 ** attempt
                    print(f"\n⏳ Retry {attempt+1}/{max_retries} po {wait_time}s...")
                    time.sleep(wait_time)
                
                result = self._call_claude(prompt, json_mode, temp)
                if result and result.get("success"):
                    return result
                
                if attempt < max_retries - 1:
                    error_msg = result.get('error', 'Unknown error') if result else 'No response'
                    print(f"⚠️  Attempt {attempt+1} failed: {str(error_msg)[:100]}")
                
            except Exception as e:
                print(f"⚠️  Exception in attempt {attempt+1}: {str(e)[:100]}")
                if attempt == max_retries - 1:
                    return None
        
        return None

    def _call_claude(self, prompt: str, json_mode: bool = False, temp: float = 0.7) -> Dict:
        """Call Claude API - FIXED URL"""
        url = "https://api.anthropic.com/v1/messages"
        
        api_key = self.keys['claude']['api_key']
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        system_prompt = "Jesteś ekspertem SEO i content writerem. Piszesz naturalnie, jak ekspert."
        if json_mode:
            system_prompt += " Odpowiadasz TYLKO w JSON."
        
        # FIXED: Correct model name
        data = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 16000,
            "temperature": temp,
            "system": system_prompt,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        try:
            print(f"   📤 Sending request...")
            resp = requests.post(url, headers=headers, json=data, timeout=300)
            
            # Better error handling
            if resp.status_code != 200:
                error_body = resp.text[:200]
                return {
                    "success": False,
                    "error": f"HTTP {resp.status_code}: {error_body}"
                }
            
            result = resp.json()
            
            # Check for API errors
            if 'error' in result:
                return {
                    "success": False,
                    "error": result['error'].get('message', 'API error')
                }
            
            usage = result.get('usage', {})
            input_tokens = usage.get('input_tokens', 0)
            output_tokens = usage.get('output_tokens', 0)
            
            # Sonnet 4: $3/1M input, $15/1M output
            cost = (input_tokens / 1_000_000) * 3.0 + (output_tokens / 1_000_000) * 15.0
            self.total_cost += cost
            
            print(f"   📊 Tokens: {input_tokens} in, {output_tokens} out")
            print(f"   💰 Cost: ${cost:.3f}")
            
            return {
                "success": True,
                "content": result['content'][0]['text'],
                "usage": usage,
                "cost": cost
            }
            
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Timeout after 5 minutes"}
        except requests.exceptions.RequestException as e:
            return {"success": False, "error": f"Request error: {str(e)}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    # ==================== MAIN WORKFLOW ====================
    
    def run(self, vs_target: int = 0, category: str = None):
        """Main workflow"""
        print(f"\n{'='*70}")
        print(f"🎯 TARGET: {vs_target} VS articles")
        if category:
            print(f"📂 Category: {category}")
        print(f"{'='*70}\n")
        
        if vs_target == 0:
            print("⚠️  No target specified. Use --vs NUMBER")
            return
        
        generated_vs = 0
        MAX_BATCH_SIZE = 2
        
        # Calculate batches
        batches = []
        remaining = vs_target
        while remaining > 0:
            batch_size = min(MAX_BATCH_SIZE, remaining)
            batches.append(batch_size)
            remaining -= batch_size
        
        print(f"📊 Strategy:")
        print(f"   • Batches: {len(batches)} × {MAX_BATCH_SIZE}")
        print(f"   • Est. time: ~{len(batches) * 2} min")
        print(f"   • Est. cost: ~${len(batches) * 0.42:.2f}")
        print()
        
        for batch_idx, batch_size in enumerate(batches, 1):
            print(f"\n{'='*70}")
            print(f"📦 BATCH {batch_idx}/{len(batches)}")
            print(f"{'='*70}")
            
            comparisons = self.get_vs_comparisons(batch_size, category)
            
            if not comparisons:
                print(f"⚠️  No more comparisons available")
                break
            
            articles = self.generate_vs_batch(comparisons)
            
            if not articles:
                print(f"⚠️  Batch generation failed, skipping...")
                continue
            
            print(f"\n💾 Saving articles...")
            saved = 0
            for article in articles:
                if self.save_vs_article(article, comparisons):
                    generated_vs += 1
                    saved += 1
                    self._save_progress()
            
            print(f"\n✅ Batch {batch_idx} complete:")
            print(f"   • Saved: {saved}/{batch_size}")
            print(f"   • Progress: {generated_vs}/{vs_target} ({generated_vs/vs_target*100:.0f}%)")
            print(f"   • Total cost: ${self.total_cost:.2f}")
            
            if self.total_cost >= self.keys.get('budget', {}).get('claude_total_budget', 10):
                print(f"\n⚠️  Budget limit reached (${self.keys['budget']['claude_total_budget']:.2f})")
                break
            
            if batch_idx < len(batches):
                print(f"\n⏳ Cooling down 30s...")
                for i in range(30, 0, -5):
                    print(f"   {i}s...", end='\r')
                    time.sleep(5)
                print()
        
        # Summary
        print(f"\n{'='*70}")
        print(f"✨ COMPLETE")
        print(f"{'='*70}")
        print(f"📊 Generated: {generated_vs}/{vs_target}")
        print(f"✅ Success rate: {self.articles_stats['success']}/{self.articles_stats['success'] + self.articles_stats['failed']}")
        if self.articles_stats['success'] > 0:
            avg = int(self.articles_stats['total_words'] / self.articles_stats['success'])
            print(f"📝 Avg words: {avg}")
        print(f"💰 Total cost: ${self.total_cost:.2f}")
        print(f"📁 Location: {self.base_content_dir}")
        print(f"{'='*70}\n")
        print("🔄 Refresh NextJS to see new articles!")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Claude Premium v11.0 FINAL')
    parser.add_argument('--vs', type=int, default=0, help='Number of VS articles')
    parser.add_argument('--category', type=str, help='Specific category')
    parser.add_argument('--reset', action='store_true', help='Reset progress')
    
    args = parser.parse_args()
    
    bot = ClaudePremiumAutopilot()
    
    if args.reset and os.path.exists(bot.progress_file):
        os.remove(bot.progress_file)
        print("🔄 Progress reset")
    
    bot.run(vs_target=args.vs, category=args.category)
