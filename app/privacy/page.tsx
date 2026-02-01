export default function PrivacyPage() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-4">Polityka Prywatności</h1>
          
          <p className="lead">
            MocInformacji.pl szanuje prywatność użytkowników i zobowiązuje się do ochrony danych osobowych.
          </p>

          <h2 className="mt-5 mb-3">1. Informacje ogólne</h2>
          <p>
            Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych 
            przekazanych przez Użytkowników w związku z korzystaniem z serwisu MocInformacji.pl.
          </p>

          <h2 className="mt-5 mb-3">2. Jakie dane zbieramy</h2>
          <p>Nasza strona zbiera następujące dane:</p>
          <ul>
            <li>Informacje techniczne: adres IP, typ przeglądarki, system operacyjny</li>
            <li>Dane o aktywności: odwiedzane strony, czas wizyty, źródło ruchu</li>
            <li>Pliki cookies niezbędne do działania strony</li>
          </ul>

          <h2 className="mt-5 mb-3">3. W jakim celu wykorzystujemy dane</h2>
          <ul>
            <li>Zapewnienie prawidłowego działania strony</li>
            <li>Analiza ruchu i statystyki odwiedzin</li>
            <li>Poprawa jakości usług</li>
            <li>Dostosowanie treści do preferencji użytkowników</li>
          </ul>

          <h2 className="mt-5 mb-3">4. Pliki cookies</h2>
          <p>
            Nasza strona używa plików cookies (ciasteczek) w celu zapewnienia najwyższej jakości 
            świadczonych usług. Cookies to małe pliki tekstowe zapisywane na urządzeniu użytkownika.
          </p>
          <p>
            Użytkownik może w każdej chwili zmienić ustawienia dotyczące cookies w swojej przeglądarce.
          </p>

          <h2 className="mt-5 mb-3">5. Bezpieczeństwo danych</h2>
          <p>
            Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające ochronę 
            przetwarzanych danych osobowych odpowiednią do zagrożeń oraz kategorii danych objętych ochroną.
          </p>

          <h2 className="mt-5 mb-3">6. Prawa użytkownika</h2>
          <p>Użytkownik ma prawo do:</p>
          <ul>
            <li>Dostępu do swoich danych osobowych</li>
            <li>Sprostowania danych</li>
            <li>Usunięcia danych</li>
            <li>Ograniczenia przetwarzania</li>
            <li>Przenoszenia danych</li>
            <li>Wniesienia sprzeciwu wobec przetwarzania</li>
          </ul>

          <h2 className="mt-5 mb-3">7. Zmiany w polityce prywatności</h2>
          <p>
            Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. 
            O wszelkich zmianach użytkownicy zostaną poinformowani poprzez ogłoszenie na stronie.
          </p>

          <h2 className="mt-5 mb-3">8. Kontakt</h2>
          <p>
            W razie pytań dotyczących Polityki Prywatności prosimy o kontakt poprzez formularz 
            kontaktowy dostępny na stronie.
          </p>

          <p className="text-muted mt-5">
            <small>Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</small>
          </p>

          <div className="text-center mt-5">
            <a href="/" className="btn btn-primary">
              <i className="bi bi-house"></i> Wróć do strony głównej
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
