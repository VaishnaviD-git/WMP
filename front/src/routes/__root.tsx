import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { EcoShell } from "@/components/eco-tech/EcoShell";
import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { ecoPrimaryButton } from "@/components/eco-tech/ecoTheme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <GlassPanel className="max-w-md p-10 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-cyan-300/80">Signal lost</p>
        <h1 className="mt-3 bg-gradient-to-r from-cyan-200 via-white to-emerald-200 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Sector unavailable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This coordinate does not resolve in the municipal mesh. Return to command overview.
        </p>
        <div className="mt-8">
          <Link to="/" className={ecoPrimaryButton}>
            Re-enter Nexus
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Waste Routing" },
      { name: "description", content: "Futuristic eco-tech waste routing and environmental intelligence" },
      { name: "author", content: "Waste Management Team" },
      { property: "og:title", content: "Smart Waste Routing" },
      { property: "og:description", content: "Eco-tech environmental intelligence for smart cities" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@waste-management" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark eco-tech antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <EcoShell>
      <Outlet />
    </EcoShell>
  );
}
