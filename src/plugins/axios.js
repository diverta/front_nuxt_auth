export default function ({ $axios, route }) {
    const sitekey = localStorage.getItem('sitekey');
    if (sitekey !== undefined && sitekey !== null && sitekey !== 'undefined' && sitekey !== 'null' && sitekey.match(/^[A-Za-z0-9-]{2,50}$/)) {
        $axios.defaults.baseURL = 'https://' + sitekey + '.g.kuroco.app';
        if (sitekey === 'dev-nuxt-auth') { $axios.defaults.baseURL = 'https://dev-nuxt-auth.a.kuroco.app'; }
    }
    $axios.defaults.timeout = 100000;
}
