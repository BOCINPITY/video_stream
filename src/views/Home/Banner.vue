<template>
  <div class="banner">
    <el-carousel direction="vertical" motion-blur :autoplay="false">
      <el-carousel-item v-for="item in bannerDatas" :key="item">
        <img :src="item.url" alt="food-descript" />
      </el-carousel-item>
    </el-carousel>
  </div>
  <el-divider />
  <el-steps finish-status="success">
    <el-step title="将餐盘放置到智能识别台进行识别" />
    <el-step title="识别无误后，请进行人脸识别" />
    <el-step title="点击人脸支付进行付款" />
  </el-steps>
  <el-divider />
  <el-text>祝您用餐愉快</el-text>
  <el-divider />
  <el-text>广告位招租</el-text>
  <el-divider />
</template>

<script setup lang="ts">
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
::v-deep(.el-step__icon.is-text),
::v-deep(.el-step__title.is-process) {
  color: #a8abb2;
  border-color: #a8abb2;
  font-weight: normal;
}
</style>
