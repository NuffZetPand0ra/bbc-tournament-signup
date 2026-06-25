import { useTranslations } from "next-intl";
import Link from "next/link";

function HeroSection() {
  const t = useTranslations();

  return (
    <section className="bg-primary text-white py-5">
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold mb-3">
              <i className="bi bi-suit-club-fill me-3"></i>
              {t("common.appFullName")}
            </h1>
            <p className="lead mb-4">
              Tilmeld dig turneringer arrangeret af Ballerup Bridge Club og tilknyttede klubber.
              Nem og hurtig tilmelding for både medlemmer og gæster.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link href="/da/turneringer" className="btn btn-light btn-lg">
                <i className="bi bi-calendar-event me-2"></i>
                {t("tournaments.upcomingTournaments")}
              </Link>
              <Link href="/da/login" className="btn btn-outline-light btn-lg">
                <i className="bi bi-person me-2"></i>
                {t("auth.login")}
              </Link>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-flex justify-content-center">
            <i
              className="bi bi-suit-club"
              style={{ fontSize: "10rem", opacity: 0.2 }}
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-calendar-check text-primary" style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h3 className="h5 fw-bold">Nem tilmelding</h3>
                <p className="text-muted mb-0">
                  Tilmeld dig turneringer med få klik. Ingen kompleks registrering krævet &mdash;
                  gæster kan tilmelde sig uden konto.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-people text-primary" style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h3 className="h5 fw-bold">Par og holdturneringer</h3>
                <p className="text-muted mb-0">
                  Understøtter par-, hold- og enkeltmandsturneringer med automatisk ventelistestyring.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-phone text-primary" style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h3 className="h5 fw-bold">Mobilvenlig</h3>
                <p className="text-muted mb-0">
                  Fungerer på alle enheder. Installer som app på din telefon for hurtig adgang til
                  kommende turneringer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingTournamentTeaser() {
  const t = useTranslations();

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 fw-bold mb-0">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            {t("tournaments.upcomingTournaments")}
          </h2>
          <Link href="/da/turneringer" className="btn btn-outline-primary">
            Se alle <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {/* Placeholder cards — replaced by real data in Phase 2 */}
        <div className="row g-3">
          {[
            {
              name: "Forårsparkurnering 2026",
              date: "15. marts 2026",
              location: "Ballerup Idrætscenter",
              mode: "Par",
              spotsLeft: 8,
              status: "open",
            },
            {
              name: "Sommercup 2026",
              date: "20. juni 2026",
              location: "Ballerup Bridge Club",
              mode: "Hold",
              spotsLeft: 4,
              status: "open",
            },
            {
              name: "Enkeltmands DM-kvalifikation",
              date: "5. september 2026",
              location: "Ballerup Bridge Club",
              mode: "Enkelt",
              spotsLeft: 12,
              status: "open",
            },
          ].map((tournament) => (
            <div key={tournament.name} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success">{t("tournaments.statusOpen")}</span>
                    <span className="badge bg-light text-dark border">{tournament.mode}</span>
                  </div>
                  <h5 className="card-title fw-semibold">{tournament.name}</h5>
                  <p className="text-muted small mb-1">
                    <i className="bi bi-calendar me-1"></i>
                    {tournament.date}
                  </p>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-geo-alt me-1"></i>
                    {tournament.location}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-success fw-semibold">
                      <i className="bi bi-person-check me-1"></i>
                      {tournament.spotsLeft} pladser tilbage
                    </small>
                    <Link href="/da/turneringer" className="btn btn-primary btn-sm">
                      {t("tournaments.registerNow")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <UpcomingTournamentTeaser />
    </>
  );
}
