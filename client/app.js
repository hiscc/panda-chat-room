//app.js
import { checkLogin } from 'services/user'

App({
    onLaunch: () => {
      checkLogin().then((res) => {
          console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    globalData: {
      user: "hello it's me"
    }
});
