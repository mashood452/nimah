import { AuthLayout } from "./AuthLayout";
import account from "./Account.module.css";
import area from "./AccountArea.module.css";
import sk from "../ui/Skeleton.module.css";

const bar = `${sk.bar}`;

/** The real log in / sign up frame (photo, heading) with shimmering fields where the form will appear. */
export function AuthSkeleton({ signup = false }: { signup?: boolean }) {
  return (
    <AuthLayout signup={signup}>
      <div role="status" aria-busy="true" aria-live="polite" className={account.form} style={{ marginTop: 32 }}>
        <span className={sk.sr}>Loading form</span>
        {Array.from({ length: signup ? 3 : 2 }, (_, i) => (
          <div key={i} className={account.field} aria-hidden="true">
            <span className={bar} style={{ width: 110, height: 13 }} />
            <span className={bar} style={{ width: "100%", height: 50 }} />
          </div>
        ))}
        <span className={bar} aria-hidden="true" style={{ width: "100%", height: 52, marginTop: 8 }} />
        <span className={bar} aria-hidden="true" style={{ width: "60%", height: 13 }} />
      </div>
    </AuthLayout>
  );
}

/** Heading, tabs and panels in the same places as the customer area pages. */
export function DashboardSkeleton() {
  return (
    <main className={account.dashboard} role="status" aria-busy="true" aria-live="polite">
      <span className={sk.sr}>Loading your account</span>
      <div className={account.dashboardInner} aria-hidden="true">
        <span className={bar} style={{ display: "block", width: 180, height: 12, marginBottom: 32 }} />
        <div className={account.accountHeader}>
          <div style={{ display: "grid", gap: 14, width: "min(520px, 100%)" }}>
            <span className={bar} style={{ width: 140, height: 11 }} />
            <span className={bar} style={{ width: "70%", height: 44 }} />
            <span className={bar} style={{ width: "90%", height: 15 }} />
          </div>
          <span className={bar} style={{ width: 120, height: 44 }} />
        </div>
        <div className={area.tabs}>
          {[0, 1, 2, 3].map((i) => <span key={i} className={bar} style={{ width: 90, height: 14, margin: "18px 0" }} />)}
        </div>
        <div className={area.overview}>
          {[0, 1].map((i) => (
            <div key={i} className={area.panel} style={{ display: "grid", gap: 14 }}>
              <span className={bar} style={{ width: "45%", height: 20 }} />
              <span className={bar} style={{ width: "85%", height: 14 }} />
              <span className={bar} style={{ width: "70%", height: 14 }} />
              <span className={bar} style={{ width: "60%", height: 14 }} />
            </div>
          ))}
        </div>
        <div className={area.panel} style={{ marginTop: 24, display: "grid", gap: 14 }}>
          <span className={bar} style={{ width: "30%", height: 20 }} />
          <span className={bar} style={{ width: "100%", height: 48 }} />
          <span className={bar} style={{ width: "100%", height: 48 }} />
        </div>
      </div>
    </main>
  );
}
