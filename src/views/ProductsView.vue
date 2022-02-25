<template>
  <h2>產品列表</h2>
  <div class="container">
    <div class="row row-cols-1 row-cols-lg-3 g-4">
      <div class="col" v-for="item in products" :key="item.id">
        <div class="card h-100">
          <img :src="item.imageUrl" class="card-img-top card-img" alt="" />
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">
              {{ item.description }}
            </p>
          </div>
          <div class="card-footer bg-transparent border-0">
            <router-link class="btn btn-primary" :to="`/product/${item.id}`"
              >View More</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: []
    }
  },
  methods: {
    getProducts () {
      // https://vue3-course-api.hexschool.io/v2/api/filter117/products
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products`
        )
        .then((res) => {
          this.products = res.data.products
          console.log(this.products)
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
<style lang="scss">
.card-img {
  height: 200px;
  object-fit: cover;
}
</style>
