<template>
  <div>
    <el-table :data="receivedData" style="width: 100%">
      <el-table-column prop="name" label="识别图片" width="180">
        <template #default="scope">
          <img
            :style="{ height: 100 + 'px', borderRadius: 16 + 'px' }"
            :src="scope.row.image"
            :alt="scope.row.dish_info.name"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  total: number;
}>();
const tableVisiable = ref<boolean>(true)
const emit = defineEmits<(e: "update:total", value: number) => void>();
interface IDish {
  id: number;
  name: string;
  cname: string;
  price: number;
}
interface IDishInfo {
  dish_info: IDish;
  number: number;
}
const receivedData = ref<IDishInfo[]>([]);
const socket = new WebSocket("ws://localhost:8765");
socket.onopen = function () {
  console.log("Connected to the server");
};
socket.onmessage = function (event) {
  try {
    const data = JSON.parse(event.data);
    receivedData.value = data;
    console.log("Received data:", receivedData.value);
    computeTotal()
  } catch (error) {
    console.error("Error parsing data:", error);
  }
};

socket.onclose = function () {
  console.log("Disconnected from the server");
};

socket.onerror = function (error) {
  console.error("WebSocket error:", error);
};

const computeTotal = () => {
  let sum = 0;
  receivedData.value.forEach((item) => {
    sum += item.dish_info.price * item.number;
  });
  console.log(sum)
  emit("update:total", sum);
};
</script>

<style scoped></style>
