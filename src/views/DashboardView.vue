<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/admin">後台</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products"
              >產品列表</router-link
            >
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/coupon"
              >優惠券</router-link
            >
          </li>
        </ul>
        <div>
          <button class="btn btn-outline-primary me-3">
            <router-link to="/products">回前台</router-link>
          </button>
          <button class="btn btn-primary" @click.prevent="logout">登出</button>
        </div>
      </div>
    </div>
  </nav>
  <router-view v-if="checkSuccess"></router-view>
</template>
<script>
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      if (token) {
        // Axios 預設值
        this.$http.defaults.headers.common.Authorization = token

        this.$http
          .post(`${process.env.VUE_APP_API}/api/user/check`)
          .then((res) => {
            // console.log(res.data)
            this.checkSuccess = true
          })
          .catch((err) => {
            console.log(err.response.data)
          })
      } else {
        alert('你尚未登入')
        this.$router.push('/login')
      }
    },
    logout () {
      document.cookie = 'hexToken=;expires=;'
      alert('token 已清除')
      this.$router.push('/login')
      // 登出的 API
      // this.$http
      //   .post(`${process.env.VUE_APP_API}/logout`)
      //   .then((res) => {
      //     alert(res.data.message)
      //     this.$router.push('/login')
      //   })
      //   .catch((err) => {
      //     alert(err.response.data.message)
      //   })
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
