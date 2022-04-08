const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  formatting:state=> {
    let userId = localStorage.getItem('userId')
    let accountId = localStorage.getItem('accountId')
    console.log(state[`tiktok${accountId}${userId}`])
    let data = state[`tiktok${accountId}${userId}`] ? state[`tiktok${accountId}${userId}`]['arr']: []
    return data
  }
}
export default getters
