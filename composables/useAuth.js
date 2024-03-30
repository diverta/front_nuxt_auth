/** set global state for user's information */
const useUser = () => useState('user', () => null);

export const apiDomain = reactive({
    sitekey: 'dev-nuxt-auth',
    baseURL: 'https://dev-nuxt-auth.a.kuroco.app'
});

export const useAuth = () => {
    const userRef = useUser();
    const snackbar = useSnackbar();

    /** register user's information */
    const register = async (formData) => {
        console.log('bamboo');
        console.log(formData);
        console.log(formData.email);
        const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/register`, {
            method: 'POST',
            body: formData,
            server: false
        });

        console.log('Herer bhaii');
        if (res.errors.length > 0) {
            snackbar.add({
                type: 'error',
                text: res.errors.join('\n') || 'An error occurred'
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
        useRouter().push('/');
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
            if (router.currentRoute.value.path === '/') {
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
