<template>
  <div class="container">
    <h3>{{ product.title }}</h3>
    <p>{{ product.description }}</p>
    <img :src="product.imageUrl" :alt="product.title" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      const { id } = this.$route.params
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`
        )
        .then((res) => {
          this.product = res.data.product
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
