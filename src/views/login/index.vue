<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box_logo">
        <p>
          <img src="@/assets/logoin-logo.svg" alt="">
        </p>
        <p class="text"><img src="@/assets/i.svg" alt=""><span>跨境后台管理系统</span></p>
      </div>
      <div class="body">
        <p class="body_logoin">登录</p>
        <div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top">
            <el-form-item label="" prop="username" style="padding-top: 20px;">
              <el-input ref="username" v-model="loginForm.username" name="username" placeholder="账号" />
            </el-form-item>
            <el-form-item label="" prop="password" style="padding-top: 30px;">
              <el-input v-model="loginForm.password" show-password type="password" placeholder="密码" @keyup.enter.native="handleLogin" />
            </el-form-item>
            <el-form-item style="padding-top: 30px;">
              <el-button type="primary" :loading="loading" style="width: 100%; height: 50px; font-size: 18px;background: #1A558F 0% 0% no-repeat padding-box; border: 0.5px solid #D9E7F8; border-radius: 10px;" @click.native.prevent="handleLogin">
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { authLogin } from '@/api/index'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value) || value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不低于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            this.loginForm.isMessage = false
            const res = await authLogin(this.loginForm)
            if (res.code) {
              window.sessionStorage.clear()
              this.$router.push(`/login`)
            }
            if (res && res.code === 0 && res.data && res.data.token) {
              this.loading = false
              window.sessionStorage.setItem('visible', true)
              window.sessionStorage.setItem('token', res.data.token)
              window.sessionStorage.setItem('userToken', res.data.token)
              window.sessionStorage.setItem('userName', this.loginForm.username)
              localStorage.removeItem('accountList')
              localStorage.removeItem('fansList')
              const Base64 = require('js-base64').Base64
              window.sessionStorage.setItem('userInfo',
                Base64.decode(
                  window.sessionStorage.getItem('token').split('.')[1]
                )
              )
              let userInfo = JSON.parse(Base64.decode(window.sessionStorage.getItem('token').split('.')[1]))
              localStorage.setItem('locale', 'zh')
              let role = userInfo.data.r
              localStorage.setItem('promptVisible', 'true')
              if (role === 0) {
                this.$router.push({ name: 'userHome' })
              } else if (role === 1) {
                this.$router.push({ name: 'adminHome' })
              } else if (role === 2) {
                this.$router.push({ name: 'agency' })
              } else if (role === 3) {
                this.$router.push({ name: 'operatorHome' })
              } else if (role === 4) {
                this.$router.push({ name: 'Chatroom' })
              } else if (role === 5) {
                this.$router.push({ name: 'resourceAudit' })
              } else if (role === 6) {
                this.$router.push({ name: 'accountingAgentLevel' })
                localStorage.setItem('promptVisible', 'false')
              }
            }
          } catch (err) {
            if (err && err.code && err.code === -400) {
              this.$message.error('账号错误，登录失败')
            }
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped="">
.login {
  align-items: center;
  background: url('../../assets/backg.png');
  /* 以上为登录背景,可以自己更换成自己喜欢的 */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  font-family: Lato, Helvetica, sans-serif;
  justify-content: center;
  text-align: center;
  height: 100vh;
  min-height: 800px;
  width: 100%;
  color: #656565;
}
.login-box .logo {
  height: 100px;
  padding-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box .body {
  width: 22vw;
  /* background: #4680C8; */
  padding: 50px 50px 30px 50px;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #FFFFFF, 5px 4px 10px #00000029;
  border-radius: 8px;
}
.login-box_logo {
  font-size: 28px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 30px;
}
.login-box_logo .text {
  position: relative;
}
.login-box_logo .text img {
  position: absolute;
  top: -1px;
}
.login-box_logo .text span {
  letter-spacing: 5px;
  margin-left: 15px;
}
.body_logoin {
  color: #13497F;
  text-align: center;
  font: normal normal normal 35px/29px Adobe Heiti Std;
  letter-spacing: 5px;
  text-shadow: 0px 3px 6px #00000029;
  border-bottom: 1px solid #707070;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
</style>
