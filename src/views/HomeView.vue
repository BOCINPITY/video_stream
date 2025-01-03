<template>
  <div class="container">
    <div class="left">
      <div class="banner"></div>
      <div class="divid"></div>
      <div class="order">
        <table>
          <thead>
            <tr>
              <th>识别图片</th>
              <th>菜名</th>
              <th>单价</th>
              <th>价格</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src="../assets/th.jpeg" alt="红烧狮子头" /></td>
              <td>红烧狮子头</td>
              <td>￥18</td>
              <td>￥18</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="right">
      <div class="usercard">
        <video src=""></video>
        <div class="username">李华</div>
        <div class="phone">电话:17376477593</div>
        <div class="rest">余额:￥2000</div>
      </div>
      <div class="total">
        总记<span>￥52</span>
      </div>
      <div class="footer">
        <div class="order_status">支付状态<span>未支付</span></div>
        <div class="exit">退出</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.left {
  margin: 20px;
  padding: 20px;
  flex: 1;

  border: 2px black solid;
  display: flex;
  .banner {
    border-radius: 8px;
    background-color: #ccc;
    flex: 0.4;
  }
  .divid {
    width: 20px;
  }
  .order {
    flex: 0.6;
    display: flex;
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ccc;
      letter-spacing: 1px;
      th,
      td {
        img {
          width: 200px;
          height: 145px;
        }
        text-align: center;
        border: 1px solid rgb(160 160 160);
        padding: 20px;
      }
    }
  }
}
.right {
  margin: 20px;
  padding: 20px;
  width: 30vw;
  display: flex;
  flex-direction: column;
  color: white;
  .usercard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: black;

    padding: 10px;
    border-radius: 8px;
    video{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #fff;
    }
  }
  .total{
    background-color: #000;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 8px;
    span{
        font-size: 24px;
    }
  }
  .footer{
    margin-top: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120px;
    font-weight: bold;
    font-size: 24px;
    .order_status{
        background-color: #000;
        height: 100%;
        margin-right: 10px;
        width: 100%;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 16px;
        font-weight: normal;
        span{
            font-weight: bold;
            font-size: 24px;
        }
    }
    .exit{
        background-color: #000;
        height: 100%;
        width: 100%;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  }
}
</style>
