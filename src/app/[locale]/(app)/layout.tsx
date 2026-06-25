import { auth } from "@/lib/auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";

function AppNavbar({ userName }: { userName: string }) {
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
          data-bs-target="#appNavbar"
          aria-controls="appNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="appNavbar">
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
            <li className="nav-item">
              <Link className="nav-link" href="/da/mine-tilmeldinger">
                {t("nav.myRegistrations")}
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <span className="text-white-50 small">
              <i className="bi bi-person-circle me-1"></i>
              {userName}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i>
                {t("nav.logout")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/da/login");
  }

  const userName = session.user.name ?? session.user.email ?? "Bruger";

  return (
    <>
      <AppNavbar userName={userName} />
      <main className="py-4">
        <div className="container">{children}</div>
      </main>
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
