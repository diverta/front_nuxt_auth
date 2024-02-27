/** set global state for user's information */
const useUser = () => useState('user', () => null);

export const useAuth = () => {
  const config = useRuntimeConfig();
  const userRef = useUser();
  const { apiDomain } = useApiDomain();

  /** login and set user's information */
  const login = async ({ email, password }) => {
    await $fetch(`${apiDomain.value}/rcms-api/1/login`, {
      method: 'POST',
      body: {
        email,
        password,
      },
      server: false,
      credentials: 'include'
    });
    await profile();
  };

  /** logout and clear user's information */
  const logout = async () => {
    await $fetch(`${config.public.kurocoApiDomain}/rcms-api/1/logout`, {
      method: 'POST',
      server: false,
      credentials: 'include'
    }).catch(() => {
      /** NP, to run following process */
    });
    userRef.value = null
    localStorage.removeItem('sitekey');
  };

  /** process restore user's login state with requesting /profile, only in client side */
  const profile = async () => {
    userRef.value = await $fetch(
      `${apiDomain.value}/rcms-api/1/profile`, {
      server: false,
      credentials: 'include'
    })
      .catch(() => null);
  }

  /** get user's information */
  const authUser = computed(() => {
    const u = userRef.value;
    const groupIds = Object.keys(u?.group_ids || {});
    // const isPremiumUser = groupIds.includes('105');
    // const isRegularUser = groupIds.includes('104');
    return {
      ...u,
    //   isPremiumUser,
    //   isRegularUser,
    };
  });

  /** get either user is logged in */
  const isLoggedIn = computed(() => Boolean(userRef.value?.member_id));

  return {
    authUser,
    isLoggedIn,
    login,
    logout,
    profile,
  };
};
