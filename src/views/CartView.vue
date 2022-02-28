<template>
  <div class="container">
    <h2>購物車</h2>

    <!-- 購物車清單 -->
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="deleteCarts"
        :disabled="cart.carts.length === 0"
        style="width: 120px"
      >
        <span
          class="spinner-border spinner-border-sm"
          v-if="isLoadingItem === true"
        ></span>
        <span v-else>清空購物車</span>
      </button>
    </div>

    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="deleteCartItem(item.id)"
                :disabled="isLoadingItem === item.id"
              >
                x
              </button>
            </td>
            <td>{{ item.product.title }}</td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <select
                    class="form-select"
                    v-model="item.qty"
                    @change="updateCartItem(item)"
                    :disabled="isLoadingItem === item.id"
                  >
                    <option disabled>Please select one</option>
                    <option
                      v-for="num in 20"
                      :value="num"
                      :key="`${num}-${item.id}`"
                    >
                      {{ num }}
                    </option>
                  </select>

                  <span class="input-group-text" id="basic-addon2">{{
                    item.product.unit
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-end">
              {{ item.product.origin_price }}
              <small class="text-success">折扣價：</small>
              {{ item.product.price }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cart.total }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- 表單 -->
    <div class="my-5 row justify-content-center">
      <Form
        class="col-md-6"
        v-slot="{ errors }"
        @submit="createOrder"
        ref="form"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="form.user.email"
          ></Field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <Field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="form.user.name"
          ></Field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <Field
            id="tel"
            name="電話"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            :rules="isPhone"
            v-model="form.user.tel"
          ></Field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <Field
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="form.user.address"
          ></Field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="3"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button
            type="submit"
            class="btn btn-danger"
            :disabled="
              cart.carts.length === 0 || Object.keys(errors).length > 0
            "
          >
            送出訂單
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import emitter from '@/libs/emitter'

export default {
  data () {
    return {
      isLoadingItem: '',
      products: [],
      cart: {
        carts: []
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getCart () {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          this.cart = res.data.data
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    updateCartItem (item) {
      this.isLoadingItem = item.id
      const obj = {
        data: {
          product_id: item.product_id,
          qty: item.qty
        }
      }

      this.$http
        .put(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`,
          obj
        )
        .then((res) => {
          alert(res.data.message)
          this.isLoadingItem = ''
          this.getCart()
          // Navbar 重新抓購物車資料
          emitter.emit('get-cart')
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    deleteCarts () {
      this.isLoadingItem = true
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`
        )
        .then((res) => {
          alert(res.data.message)
          this.getCart()
          this.isLoadingItem = ''
          // Navbar 重新抓購物車資料
          emitter.emit('get-cart')
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    deleteCartItem (id) {
      this.isLoadingItem = id
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`
        )
        .then((res) => {
          alert(res.data.message)
          this.getCart()
          this.isLoadingItem = ''
          // Navbar 重新抓購物車資料
          emitter.emit('get-cart')
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    createOrder () {
      const obj = {
        data: this.form
      }
      this.$http
        .post(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`,
          obj
        )
        .then((res) => {
          alert(res.data.message)
          this.getCart()
          emitter.emit('get-cart')
          // 重整表單
          this.$refs.form.resetForm()
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    },
    // vee-validate 規則
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>
