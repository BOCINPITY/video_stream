<template>
  <div>
    <el-table
      :data="receivedData"
      style="width: 100%"
      v-if="receivedData.length"
    >
      <el-table-column prop="name" label="识别图片" width="180">
        <template #default="scope">
          <img
            :style="{ height: 100 + 'px', borderRadius: 16 + 'px' }"
            :src="scope.row.dish_info.resource"
          />
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="菜名" width="180">
        <template #default="scope">
          <div>
            {{ scope.row.dish_info.cname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价">
        <template #default="scope">
          <div>
            {{ scope.row.dish_info.price + "￥" + "*" + scope.row.number }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格">
        <template #default="scope">
          <div>
            {{ scope.row.dish_info.price * scope.row.number + "￥" }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="margin-top: 20px; width: 100%"
      type="primary"
      v-if="receivedData.length"
      @click="handleCLickConfirmOrder"
      >确认订单</el-button
    >
    <el-empty
      v-if="!receivedData.length"
      :image-size="400"
      image="https://cdn.pixabay.com/photo/2014/04/03/10/09/place-setting-309980_640.png"
    >
      <template #description>
        <el-text style="font-size: 18px" type="info"
          >请把餐盘放置到智能识别台进行识别!</el-text
        >
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  total: number;
}>();
let orderDataSnap: OrderItem[] = []; //订单快照
const handleCLickConfirmOrder = () => {
  orderDataSnap = [];
  receivedData.value.map((item) => {
    orderDataSnap.push({
      id: item.dish_info.id,
      price: item.dish_info.price,
      num: item.number,
    });
  });
};
import type { IDishInfo, OrderItem } from "@/types";
import {dishSocket} from "@/config.ts";
const tableVisiable = ref<boolean>(true);
const emit = defineEmits<(e: "update:total", value: number) => void>();

const receivedData = ref<IDishInfo[]>([]);
const socket = new WebSocket(dishSocket);
socket.onopen = function () {
  console.log("Connected to the server");
};
socket.onmessage = function (event) {
  try {
    const data = JSON.parse(event.data);
    receivedData.value = data;
    // console.log("Received data:", receivedData.value);
    computeTotal();
  } catch (error) {
    console.error("菜品数据解析错误", error);
  }
};

socket.onclose = function () {
  console.error("菜品识别服务已断开");
};

socket.onerror = function (error) {
  console.error("WebSocket error:", error);
};

const computeTotal = () => {
  let sum = 0;
  receivedData.value.forEach((item) => {
    sum += item.dish_info.price * item.number;
  });
  emit("update:total", sum);
};
const clear = () => {
  receivedData.value = [];
  orderDataSnap = [];
};

const getOrder = () => orderDataSnap;
defineExpose({
  clear,
  getOrder,
});
</script>

<style scoped></style>
