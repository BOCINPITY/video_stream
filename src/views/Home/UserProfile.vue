<template>
  <div class="info">
    <div class="username">
      <el-icon><User /></el-icon>{{ receivedData?.name }}
    </div>
    <div class="phone">
      <el-icon><Phone /></el-icon>电话:{{ receivedData?.phone_number }}
    </div>
    <div class="account">
      <el-icon><Wallet /></el-icon>余额:￥{{ receivedData?.account }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, User, Wallet } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  recogized: boolean;
}>();

const emit =
  defineEmits<(e: "update:recogized", value: boolean) => void>();
interface IUser {
  id: number;
  name: string;
  phone_number: string;
  account: number | null;
}
const receivedData = ref<IUser>();
let socket: WebSocket | null = null;
// 定义一个方法
const clear = () => {
  receivedData.value = {
    id: -1,
    name: "",
    phone_number: "",
    account: null,
  };
};

socket = new WebSocket("ws://localhost:8087");
socket.onopen = function () {
  console.log("Connected to the server");
};

socket.onmessage = function (event) {
  try {
    const data = JSON.parse(event.data);
    receivedData.value = data;
    console.log("Received data:", receivedData.value);
    emit("update:recogized",true)
  } catch (error) {
    console.error("Error parsing data:", error);
  }
};

socket.onclose = function () {
  console.log("Disconnected from the server");
  socket = null;
};

socket.onerror = function (error) {
  console.error("WebSocket error:", error);

  ElMessage({
    message: "WebSocket error:无法连接服务器",
    type: "error",
  });
  socket = null;
};

// 暴露方法
defineExpose({
  clear,
});
</script>

<style scoped>
.info {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 32px;
  flex-wrap: wrap;
  .account {
    display: flex;
    align-items: center;
  }
}
</style>
