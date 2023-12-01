import authRoute from "../module/auth/auth.routes";

const router = [
  {
    prefix: "/auth",
    router: authRoute,
  },
];

export default router;
