export default function ({ $axios, route }) {
    let sitekey = localStorage.getItem("sitekey");
    if( sitekey !== undefined && sitekey !== null && sitekey !== 'undefined' && sitekey !== 'null' && sitekey.match(/^[A-Za-z0-9-]{3,30}$/)){
      $axios.defaults.baseURL = "https://" + sitekey + ".g.kuroco.app";
    }
    $axios.defaults.timeout = 100000;
  }
  