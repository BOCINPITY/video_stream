<template>
  <div class="banner">
    <div class="ad">广告位招租</div>
    <el-carousel
      :height="bannerHeight"
      direction="vertical"
      motion-blur
      :autoplay="false"
    >
      <el-carousel-item v-for="item in bannerDatas" :key="item">
        <img :src="item.url" alt="food-descript" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
const bannerHeight = "400px";
const bannerDatas = [
  {
    name: "嘉兴肉粽",
    url: "https://cdn.pixabay.com/photo/2018/10/25/19/15/goulash-3773134_640.jpg",
    price: "15元",
  },
  {
    name: "猪肘",
    url: "https://cdn.pixabay.com/photo/2011/04/29/11/20/spaghetti-7113_640.jpg",
    price: "18元",
  },
  {
    name: "扒鸭盖饭",
    url: "https://cdn.pixabay.com/photo/2015/11/05/20/15/duck-1024739_960_720.jpg",
    price: "22元",
  },
  {
    name: "小龙虾",
    url: "https://cdn.pixabay.com/photo/2024/12/29/01/58/couscous-9297173_640.jpg",
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
.banner {
  position: relative;
}
.ad {
  position: absolute;
  z-index: 1000;
  font-size: 50px;
  color: white;
  font-weight: bold;
  text-align: center;
  background: -webkit-linear-gradient(left, #0f0, #00f) 0 0 no-repeat; /*设置线性渐变*/
  background-size: 120px; /*设置背景大小*/
  -webkit-background-size: 120px; /*设置背景大小*/
  background-clip: text; /*背景被裁剪到文字*/
  -webkit-background-clip: text; /*背景被裁剪到文字*/
  -webkit-text-fill-color: rgba(255, 255, 255, 0.3); /*设置文字的填充颜色*/
  animation: shine 3s infinite; /*设置动画*/
  -webkit-animation: shine 3s infinite; /*设置动画*/
}
@keyframes shine {
  /*创建动画*/
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

@-webkit-keyframes shine {
  /*创建动画*/
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
