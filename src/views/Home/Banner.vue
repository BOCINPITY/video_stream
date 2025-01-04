<template>
  <div class="banner">
    <el-carousel
      :height="bannerHeight"
      direction="vertical"
      motion-blur
      :autoplay="false"
    >
      <el-carousel-item v-for="item in bannerDatas" :key="item">
        <div>
          <span>热销菜品:</span>{{ item.name }}<span>{{ item.price }}</span>
        </div>
        <img :src="item.url" alt="food-descript" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
const bannerHeight = "600px";
const bannerDatas = [
  {
    name: "嘉兴肉粽",
    url: "https://cdn.pixabay.com/photo/2021/01/21/06/41/rice-dumplings-5936416_960_720.jpg",
    price: "15元",
  },
  {
    name: "飘香鸡腿",
    url: "https://cdn.pixabay.com/photo/2017/06/26/13/58/chicken-2443901_960_720.jpg",
    price: "18元",
  },
  {
    name: "扒鸭盖饭",
    url: "https://cdn.pixabay.com/photo/2015/11/05/20/15/duck-1024739_960_720.jpg",
    price: "22元",
  },
  {
    name: "小龙虾",
    url: "https://cdn.pixabay.com/photo/2019/06/11/03/59/seafood-4265994_960_720.jpg",
    price: "45元",
  },
  {
    name: "炸鸡薯条",
    url: "https://cdn.pixabay.com/photo/2016/11/19/02/22/schnipo-1837703_960_720.jpg",
    price: "16元",
  },
];
</script>

<style scoped>
.el-carousel__item div {
  color: var(--color-font-dark);
  text-align: center;
  display: flex;
  align-items: center;
  span:last-child {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bolder;
    text-indent: 1rem;
  }
  span:first-child {
    letter-spacing: 1rem;
    font-weight: bold;
    font-size: 24px;
  }
}
.el-carousel__item img {
  width: 100%;
}
</style>
