<template>
  <div class="info">
    <div class="username">
      <el-icon style="padding-right: 10px;" :size="iconSize"
        ><User /></el-icon
      ><el-text size="large"
        >尊贵的{{
          receivedData?.name ? receivedData?.name : "unkown"
        }}用户</el-text
      >
    </div>
    <div class="phone">
      <el-icon style="padding-right: 10px;" :size="iconSize"
        ><Phone /></el-icon
      ><el-text size="large"
        >电话:{{
          receivedData?.phone_number ? receivedData?.phone_number : "unkown"
        }}</el-text
      >
    </div>
    <div class="account">
      <el-icon style="padding-right: 10px;" :size="iconSize"
        ><Wallet /></el-icon
      ><el-text size="large"
        >余额:￥{{
          receivedData?.account ? receivedData?.account : "unkown"
        }}</el-text
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, User, Wallet } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, watchEffect } from "vue";
const iconSize = 20;
const props = defineProps<{
  recogized: boolean;
}>();

const emit = defineEmits<(e: "update:recogized", value: boolean) => void>();
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

socket = new WebSocket("ws://192.168.1.102:8087");
socket.onopen = function () {
  console.log("Connected to the server");
};

socket.onmessage = function (event) {
  try {
    const data = JSON.parse(event.data);
    receivedData.value = data;
    console.log("Received data:", receivedData.value);
    emit("update:recogized", true);
  } catch (error) {
    console.error("数据解析错误:", error);
  }
};

socket.onclose = function () {
  console.error("人脸识别服务已断开");
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  .username,
  .phone,
  .account {
    display: flex;
  }
}
</style>
