export const useAuth = () => {
  const apiBase = useApiRequest();

  async function fetchAuth({ email, password }: { email: string; password: string }) {
    return await apiBase("/api/auth/login", {
      method: "POST",
      body: {
        email,
        password,
        token_name: navigator.userAgent,
      },
    });
  }

  async function fetchLogOut() {
    return true;
  }

  return {
    fetchAuth, fetchLogOut
  };
};
