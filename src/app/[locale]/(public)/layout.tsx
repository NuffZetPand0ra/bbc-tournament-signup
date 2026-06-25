import { useTranslations } from "next-intl";
import Link from "next/link";

function PublicNavbar() {
  const t = useTranslations();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/da">
          <i className="bi bi-suit-club-fill me-2"></i>
          {t("common.appName")}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbar"
          aria-controls="publicNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="publicNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/da">
                {t("nav.home")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/da/turneringer">
                {t("nav.tournaments")}
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link className="btn btn-outline-light" href="/da/login">
              <i className="bi bi-person me-1"></i>
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <footer className="bg-light border-top mt-5 py-4">
        <div className="container text-center text-muted">
          <small>
            &copy; {new Date().getFullYear()} Ballerup Bridge Club &mdash; Turneringstilmelding
          </small>
        </div>
      </footer>
    </>
  );
}
