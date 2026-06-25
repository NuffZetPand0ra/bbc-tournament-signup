import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";

function AdminSidebar() {
  const t = useTranslations();

  const navItems = [
    { href: "/da/admin", label: t("admin.dashboard"), icon: "bi-speedometer2" },
    { href: "/da/admin/turneringer", label: t("admin.tournaments"), icon: "bi-calendar-event" },
    { href: "/da/admin/klubber", label: t("admin.clubs"), icon: "bi-building" },
    { href: "/da/admin/tilmeldinger", label: t("admin.registrations"), icon: "bi-people" },
    { href: "/da/admin/eksport", label: t("admin.export"), icon: "bi-download" },
  ];

  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar py-3">
      <div className="position-sticky">
        <div className="px-3 mb-3">
          <Link href="/da" className="text-white text-decoration-none d-flex align-items-center">
            <i className="bi bi-suit-club-fill me-2 text-primary"></i>
            <span className="fw-bold">{t("common.appName")}</span>
          </Link>
          <small className="text-muted">{t("admin.title")}</small>
        </div>
        <hr className="border-secondary" />
        <ul className="nav flex-column px-2">
          {navItems.map((item) => (
            <li key={item.href} className="nav-item mb-1">
              <Link
                href={item.href}
                className="nav-link text-white-50 rounded d-flex align-items-center gap-2 px-3 py-2"
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <hr className="border-secondary" />
        <div className="px-3">
          <Link href="/da" className="nav-link text-white-50 d-flex align-items-center gap-2 small">
            <i className="bi bi-arrow-left-circle"></i>
            Tilbage til forsiden
          </Link>
        </div>
      </div>
    </nav>
  );
}

function AdminTopbar({ userName }: { userName: string }) {
  const t = useTranslations();

  return (
    <nav className="navbar navbar-dark bg-dark border-bottom border-secondary px-3">
      <span className="navbar-brand mb-0 h6 text-muted d-md-none">
        <i className="bi bi-suit-club-fill me-2 text-primary"></i>
        {t("admin.title")}
      </span>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-white-50 small">
          <i className="bi bi-person-badge me-1"></i>
          {userName}
        </span>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i>
            {t("nav.logout")}
          </button>
        </form>
      </div>
    </nav>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/da/login");
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== Role.ADMIN && userRole !== Role.CLUB_ADMIN) {
    redirect("/da");
  }

  const userName = session.user.name ?? session.user.email ?? "Administrator";

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <AdminTopbar userName={userName} />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="container-fluid">{children}</div>
        </main>
      </div>
    </div>
  );
}
