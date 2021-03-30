export default function ({ store, redirect, route }) {
  // 仮会員の時 / は ページ側でチェック
  if (
    store.$auth.loggedIn &&
    route.path !== "/upgrade" &&
    route.path !== "/inquiry" &&
    route.path !== "/testkuroschema" &&
    route.path !== "/topics" &&
    route.path !== "/topic/${id}" &&
    route.path !== "/top"
  ) {
  }
}
