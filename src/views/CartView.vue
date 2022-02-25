<template>
  <div class="container">
    <h2>購物車</h2>
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
              style="
                height: 100px;
                background-size: cover;
                background-position: center;
              "
            ></div>
          </td>
          <td>{{ item.title }}</td>
          <td>
            <div class="h5" v-if="item.origin_price === item.price">
              {{ item.price }} 元
            </div>
            <template v-else>
              <del class="h6">原價 {{ item.origin_price }} 元</del>
              <div class="h5">現在只要 {{ item.price }} 元</div>
            </template>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="openProductModal(item.id)"
                :disabled="isLoadingItem === item.id"
              >
                查看更多
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="addToCart(item.id)"
                :disabled="isLoadingItem === item.id"
                style="width: 100px"
              >
                <span
                  class="spinner-border spinner-border-sm"
                  v-if="isLoadingItem === item.id"
                ></span
                ><span v-else>加到購物車</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import emitter from '@/libs/emitter'

export default {
  data () {
    return {
      products: [],
      cart: {
        carts: []
      },
      isLoadingItem: ''
    }
  },
  methods: {
    getProducts () {
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products`
        )
        .then((res) => {
          // console.log(res.data)
          this.products = res.data.products
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    addToCart (id, qty = 1) {
      this.isLoadingItem = id
      console.log(id)
      const obj = {
        data: {
          product_id: id,
          qty
        }
      }
      this.$http
        .post(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`,
          obj
        )
        .then((res) => {
          alert(res.data.message)
          // this.getCart()
          emitter.emit('get-cart')
          this.isLoadingItem = ''
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
