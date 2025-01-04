<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="image" label="识别图片" width="180">
            <template #default="scope">
              <img
                :style="{ height: 100 + 'px', borderRadius: 16 + 'px' }"
                :src="scope.row.image"
                alt="dish"
              />
            </template>
          </el-table-column>
          <el-table-column prop="dishName" label="菜名" width="180">
            <template #default="scope">
              <div>
                {{ scope.row.dishName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="siglePrice" label="单价">
            <template #default="scope">
              <div>
                {{ scope.row.siglePrice + "￥" }}
              </div>
            </template></el-table-column
          >
          <el-table-column prop="price" label="价格">
            <template #default="scope">
              <div>
                {{ scope.row.price + "￥" }}
              </div>
            </template></el-table-column
          >
        </el-table>
    </div>
</template>

<script setup lang="ts">
const tableData = [
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2014/11/05/15/57/new-years-eve-518032_1280.jpg",
    dishName: "红烧肉",
    siglePrice: "16",
    price: "16",
  },
];
</script>

<style scoped>

</style>