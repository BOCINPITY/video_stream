<template>
  <div class="payment-success">
    <h1>
      付款成功<el-icon color="green"><Check /></el-icon>
    </h1>
    <p>感谢您选择我们餐厅</p>
    <p>您的订单号: {{ orderId }}</p>
    <p>付款金额: {{ paymentAmount }}元</p>
    <p>付款时间: {{ paymentTime }}</p>
  </div>
</template>

<script lang="ts" setup>
import { Check } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRoute,useRouter } from 'vue-router';
const router = useRouter();

const route = useRoute();
const receivedData = route.query;
const orderId = Date.now();
const paymentAmount = ref(receivedData.total);
const paymentTime = ref(new Date());
setTimeout(() => {
  router.go(-1);
}, 3000);
</script>

<style scoped>
.payment-success {
  h1 {
    letter-spacing: 0.5rem;
  }

  text-align: center;
  padding: 20px;
}
</style>
