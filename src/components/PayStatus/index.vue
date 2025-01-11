<template>
  <div class="pay-container">
    <div class="pay-list-item">
      <el-text size="large"
        ><el-icon><CollectionTag /></el-icon>支付账号:{{ props.phone }}</el-text
      >
    </div>
    <el-divider />
    <div class="pay-list-item">
      <el-text size="large"
        ><el-icon><User /></el-icon>用户:{{ props.username }}</el-text
      >
    </div>
    <el-divider />
    <div class="pay-list-item">
      <el-text size="large"
        ><el-icon><ShoppingTrolley /></el-icon>订单号:{{
          props.orderId
        }}</el-text
      >
    </div>
    <el-divider />
    <div class="pay-list-item">
      <div class="order-details">
        <el-icon><Document /></el-icon>
        <el-text size="large">订单详情</el-text>

        <el-table :data="props.details" style="width: 100%" border>
          <el-table-column prop="dishName" label="品类名" />
          <el-table-column prop="price" label="单价/元" />
          <el-table-column prop="num" label="数量" />
        </el-table>
      </div>
      <el-divider />
    </div>
    <div class="pay-list-item">
      <el-icon><Bowl /></el-icon
      ><el-text size="large">总计:{{ props.total }}元</el-text>
    </div>
    <el-divider />

    <div class="pay-list-item">
      <el-icon><Warning /></el-icon> <el-text size="large">支付状态：</el-text>
      <el-result
        icon="success"
        title="支付成功，祝您用餐愉快"
        sub-title="5s后自动返回"
        v-if="props.status"
      >
      </el-result>
      <el-result
        icon="error"
        title="支付失败，请检查账户余额是否充足！"
        sub-title="5s后自动返回"
        v-else
      >
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  ShoppingTrolley,
  Bowl,
  Warning,
  Document,
  CollectionTag,
} from "@element-plus/icons-vue";
import type { orderDetail } from "@/types";
const props = defineProps<{
  phone?: string;
  username?: string;
  orderId?: string;
  details?: orderDetail[];
  total?: number;
  status?: boolean;
  timeToBack?: number;
}>();
</script>

<style scoped>
.pay-container {
  display: flex;
  flex-direction: column;
  color: #000;
  .pay-list-item {
    font-size: 16px;
  }
}
</style>
