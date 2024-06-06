/** set global state for user's information */
const useUser = () => useState('user', () => null);

export const apiDomain = reactive({
    sitekey: 'dev-nuxt-auth',
    baseURL: 'https://dev-nuxt-auth.a.kuroco.app'
});

export function setSitekey(sitekey) {
    apiDomain.sitekey = sitekey;
    localStorage.setItem('sitekey', apiDomain.sitekey);
    updateApiDomainFromLocalStorage();
}

export function updateApiDomainFromLocalStorage() {
    if (typeof window !== 'undefined' && localStorage.getItem('sitekey')) {
        apiDomain.sitekey = localStorage.getItem('sitekey');
        apiDomain.baseURL = apiDomain.sitekey === 'dev-nuxt-auth' ? 'https://dev-nuxt-auth.a.kuroco.app' : `https://${apiDomain.sitekey}.g.kuroco.app`;
    }
}

export const useAuth = () => {
    const { t } = useI18n();
    const userRef = useUser();
    const snackbar = useSnackbar();
    const localePath = useLocalePath();

    /** register user's information */
    const register = async (formData) => {
        const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/register`, {
            method: 'POST',
            body: formData,
            server: false
        });

        if (res.errors.length > 0) {
            snackbar.add({
                type: 'error',
                text: res.errors.join('\n') || t('common.error')
            });
        } else {
            const loginDetails = { email: formData.email, password: formData.login_pwd };
            await login({ ...loginDetails });
        }
    };

    /** login and set user's information */
    const login = async ({ email, password }) => {
        await $fetch(`${apiDomain.baseURL}/rcms-api/1/login`, {
            method: 'POST',
            body: {
                email,
                password
            },
            server: false,
            credentials: 'include'
        });
        await profile();
        useRouter().push(localePath('/'));
    };

    /** logout and clear user's information */
    const logout = async () => {
        await $fetch(`${apiDomain.baseURL}/rcms-api/1/logout`, {
            method: 'POST',
            server: false,
            credentials: 'include'
        }).catch(() => {
            /** NP, to run following process */
        });
        userRef.value = null;
        localStorage.removeItem('sitekey');
    };

    /** process restore user's login state with requesting /profile, only in client side */
    const profile = async () => {
        try {
            userRef.value = await $fetch(`${apiDomain.baseURL}/rcms-api/1/profile`, {
                server: false,
                credentials: 'include'
            });
        } catch {
            if (import.meta.server) {
                return;
            }

            const router = useRouter();
            await router.isReady();
            if (
                router.currentRoute.value.path === '/' ||
                router.currentRoute.value.path === '/ja' ||
                router.currentRoute.value.path === '/signup' ||
                router.currentRoute.value.path === '/ja/signup' ||
                router.currentRoute.value.path === '/reminder' ||
                router.currentRoute.value.path === '/ja/reminder' ||
                router.currentRoute.value.path === '/preview/topics_detail' ||
                router.currentRoute.value.path === 'ja/preview/topics_detail'
            ) {
                return;
            }
            await router.push('/');
            userRef.value = null;
        }
    };

    /** get user's information */
    const authUser = computed(() => {
        const u = userRef.value;
        return {
            ...u
        };
    });

    /** get either user is logged in */
    const isLoggedIn = computed(() => Boolean(userRef.value?.member_id));

    return {
        authUser,
        isLoggedIn,
        register,
        login,
        logout,
        profile
    };
};

export const useNavDrawerItems = () => {
    const items = [
        {
            icon: 'mdi-home',
            title: 'Home',
            titleLoggedIn: 'Home',
            to: '/'
        },
        {
            icon: 'mdi-newspaper-variant',
            title: 'Articles',
            to: '/topics_list'
        },
        {
            icon: 'mdi-star',
            title: 'Starred',
            to: '/favourite'
        },
        {
            icon: 'mdi-account-tie',
            title: 'Member',
            to: '/member'
        },
        {
            icon: 'mdi-account-box',
            title: 'My Profile',
            to: '/profile'
        },
        {
            icon: 'mdi-send',
            title: 'Feedback',
            to: '/inquiry'
        }
    ];
    return items;
};
