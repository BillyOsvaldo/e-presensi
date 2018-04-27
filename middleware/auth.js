// If it's a private page and there's no payload, redirect.
export default function (context) {
  const { store, redirect, route } = context
  const { auth } = store.state

  if (!auth.publicPages.includes(route.name) && !auth.payload) {
    return redirect(process.env.HOST_URL_SSO + '/signin?app=' + process.env.ID_APP)
  }

  if (auth.publicPages.includes(route.name) && auth.payload) {
    return redirect('/')
  }
}
