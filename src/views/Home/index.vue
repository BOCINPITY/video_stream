<template>
  <div class="box">
    <div class="title" style="height: 100px"></div>

    <div class="container">
      <div class="left">
        <div class="banner">
          <Banner />
        </div>
        <el-divider direction="vertical" style="height: 100%" />
        <div class="order">
          <DishTable v-model:total="total" ref="dishTableComponentRef" />
        </div>
      </div>

      <div
        class="right"
        v-loading="paySpin"
        :element-loading-text="promtText"
        v-show="!showPayStatus"
      >
        <el-divider>请将人脸对准摄像头进行识别</el-divider>
        <div class="usercard">
          <video ref="videoElement" autoplay></video>
          <div class="mask" v-show="maskVisiable">
            <el-icon size="70" style="padding: 10px"><UserFilled /></el-icon>
          </div>
          <el-divider direction="vertical" style="height: 100%" />

          <UserProfile
            ref="userProfileComponentRef"
            v-model:recogized="recognized"
          />
        </div>
        <el-divider />
        <div class="total">
          <el-text>总计</el-text>
          <span>￥{{ total }}</span>
        </div>
        <el-divider />
        <div class="footer">
          <div
            class="face_recognize"
            v-show="footerVisiable"
            @click="facialPayment"
          >
            <el-icon size="24" style="padding: 10px"><FullScreen /></el-icon>
            人脸支付
          </div>
        </div>
        <el-divider />
      </div>
      <div class="right" v-show="true">
        <PayStatus
          :time-to-back="timeToBack"
          :phone="orderPayResponeData?.phone"
          :order-id="orderPayResponeData?.orderId"
          :details="orderPayResponeData?.orderdetails"
          :status="orderPayResponeData?.payStatus"
          :total="orderPayResponeData?.totalPrice"
          :username="orderPayResponeData?.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import DishTable from "./DishTable.vue";
import Banner from "./Banner.vue";
import UserProfile from "./UserProfile.vue";
import PayStatus from "@/components/PayStatus/index.vue";
import { FullScreen, UserFilled } from "@element-plus/icons-vue";
import type { OrderItem, orderDetail } from "@/types";
import { ElMessage } from "element-plus";
import { RTC, httpLocal, baseUrl } from "@/config.ts";
// 为子组件引用添加类型声明
interface UserProfileInstance {
  clear: () => void;
  sendDataToSocket: (data: number) => void;
  getUserId: () => number;
}

interface DishTableInstance {
  clear: () => void;
  getOrder: () => OrderItem[];
}

const maskVisiable = ref(true);
const paySpin = ref(false);
const timeToBack = ref(5);
const showPayStatus = ref(false);
const total = ref<number>(0);
const videoElement = ref<HTMLVideoElement>();
const start = ref<HTMLButtonElement>();
const recognized = ref<boolean>(false);
const promtText = ref<string>("正在支付，请稍候...");
const userProfileComponentRef = ref<UserProfileInstance | null>(null);
const dishTableComponentRef = ref<DishTableInstance | null>(null);
let pc: any = null;
let videoStream = null;

const publish = async () => {
  if (pc !== null && pc !== undefined) {
    console.log("已开始推流");
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("浏览器不支持 getUserMedia");
    return;
  }
  const constraints = {
    audio: {
      echoCancellation: true, // 回声消除
      noiseSuppression: true, // 降噪
      autoGainControl: true, // 自动增益
    },
    video: {
      frameRate: { min: 30 }, // 最小帧率
      width: { min: 640, ideal: 1080 }, // 宽度
      height: { min: 360, ideal: 720 }, // 高度
      aspectRatio: 16 / 9, // 宽高比
    },
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.value!.srcObject = stream;
    videoStream = stream;
    // ...existing code...
  } catch (error) {
    console.error("获取媒体流失败", error);
  }
  const httpURL = `${httpLocal}:1985/rtc/v1/publish/`;
  const webRTCURL = `${RTC}/live/livestream`;

  // 通过摄像头、麦克风获取音视频流
  videoStream = await navigator.mediaDevices.getUserMedia(constraints);
  //video播放流数据
  videoElement.value!.srcObject = videoStream;
  // 静音
  videoElement.value!.volume = 0;
  // 创建RTC连接对象
  pc = new RTCPeerConnection();

  // RTCPeerConnection方法addTransceiver()创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection关联的收发器集中。
  // 每个收发器代表一个双向流，RTCRtpSender和RTCRtpReceiver都与之相关联。
  // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
  // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
  pc.addTransceiver("audio", { direction: "recvonly" });
  pc.addTransceiver("video", { direction: "recvonly" });
  // 遍历getUserMedia（）获取到的流数据，拿到其中的音频轨道和视频轨道，加入到RTCPeerConnection连接的音频轨道和视频轨道中
  videoStream.getTracks().forEach((track) => {
    pc.addTrack(track);
  });
  // 创建本端offer
  const offer = await pc.createOffer();
  // 设置本端
  await pc.setLocalDescription(offer);

  const data = {
    api: httpURL,
    streamurl: webRTCURL,
    sdp: offer.sdp,
  };
  // SDP交换，请求SRS自带的信令服务器
  httpApi(httpURL, data)
    .then(async (data: any) => {
      // console.log("answer", data);
      // 设置远端描述，开始连接
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: data.sdp })
      );
      start.value!.disabled = true;
    })
    .catch((data) => {
      if (data.code === 400) {
        console.log("SDP交换失败");
      }
    });
};
const footerVisiable = ref<boolean>(true);
const facialPayment = async () => {
  if (dishTableComponentRef.value?.getOrder().length === 0) {
    ElMessage({
      message: "请先识别您餐盘中的菜品",
      type: "warning",
    });
    return;
  }
  userProfileComponentRef.value?.sendDataToSocket(1);
  paySpin.value = true;
  maskVisiable.value = false;
};

interface orderPayRespone {
  phone: string;
  orderId: string;
  orderdetails: orderDetail[];
  totalPrice: number;
  payStatus: boolean;
  name: string;
}
const orderPayResponeData = ref<orderPayRespone | null>();
watch(
  recognized,
  async (newValue, oldValue) => {
    if (newValue && !oldValue) {
      const paymentData = {
        userId: userProfileComponentRef.value?.getUserId(),
        dishList: dishTableComponentRef.value?.getOrder(),
      };

      try {
        const res = await httpApi(`${baseUrl}:8089/api/orderPay`, paymentData);
        orderPayResponeData.value = res;
        console.log(orderPayResponeData.value);
        paySpin.value = false;
        showPayStatus.value = true;
        setTimeout(() => {
          showPayStatus.value = false;
          orderPayResponeData.value = null;
          //清除数据
          dishTableComponentRef.value?.clear();
          userProfileComponentRef.value?.clear();
          total.value = 0;
          maskVisiable.value = true;
          recognized.value = false;
        }, timeToBack.value * 1000);
      } catch (error) {
        console.error("请求出错:", error);
      }
    }
  },
  { immediate: false, deep: true }
);
const httpApi = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    // console.log("Request data sent to server:", data);
    // console.log("Raw response from server:", result);
    return result;
  } catch (error) {
    console.error("Error in httpApi:", error);
    return null;
  }
};

onMounted(() => {
  publish();
});
</script>

<style scoped>
.box {
  background-image: url("../../assets/bg/title.png");
  background-size: 650px;
  background-position: center 20px;
  background-repeat: no-repeat;
}
.container {
  display: flex;
  justify-content: center;
  font-size: var(--font-size-mid);
}
.left {
  box-shadow: 10px 10px 50px -7px var(--color-dark);
  height: 70vh;
  min-width: 600px;
  overflow-y: scroll;
  margin: 20px;
  padding: 20px;
  flex: 1;
  border-radius: var(--border-radius-sm);
  border: var(--border-size-mid) var(--color-dark) solid;
  display: flex;
  .banner {
    border-radius: 8px;
    flex: 0.4;
  }
  .order {
    flex: 0.6;
  }
}
.right {
  border-radius: var(--border-radius-sm);
  box-shadow: 10px 10px 50px -7px var(--color-dark);
  border: var(--border-size-mid) var(--color-dark) solid;
  margin: 20px;
  padding: 20px;
  width: 30vw;
  min-height: 500px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  color: var(--color-font-dark);
  .usercard {
    border: var(--border-size-sm) var(--color-dark) solid;
    display: flex;
    background-color: var(--color-bg-7);
    padding: 10px;
    border-radius: var(--border-radius-mid);
    .mask {
      position: absolute;
      width: 150px;
      height: 150px;
      background-color: #d6d5d5;
      border-radius: var(--border-radius-round);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    video {
      object-fit: cover;
      width: 150px;
      height: 150px;
      border-radius: var(--border-radius-round);
      background-color: var(--color-bg);
      border: var(--border-size-sm) var(--color-dark) solid;
      margin-right: 100px;
    }
  }
  .total {
    border: var(--border-size-sm) var(--color-dark) solid;
    box-shadow: 10px 10px 50px -7px var(--color-dark);
    background-color: var(--color-bg-7);
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius-mid);
    span {
      font-size: 18px;
    }
  }
  .footer {
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120px;
    font-weight: bold;
    font-size: 24px;

    .face_recognize {
      border: var(--border-size-sm) var(--color-dark) solid;
      cursor: pointer;
      box-shadow: 10px 10px 50px -7px var(--color-dark);
      background-color: var(--color-bg-7);
      height: 100%;
      margin-right: 10px;
      width: 100%;
      border-radius: var(--border-radius-mid);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }

    .face_recognize:hover {
      background-color: #e9e9e9;
      transition: background-color 0.3s;
    }
  }
}
</style>
