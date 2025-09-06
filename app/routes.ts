import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("test-db", "routes/test-db.tsx"),
  layout("routes/_layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("modulo2", "routes/modulo2.tsx"),
    route("agent/:id", "routes/agent.$id.tsx"),
    route("logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
