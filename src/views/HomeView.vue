<template>
  <h1>餐厅智能自助结算系统</h1>
  <div class="container">
    <div class="left">
      <div class="banner">
        <el-carousel
          :height="bannerHeight"
          direction="vertical"
          motion-blur
          :autoplay="false"
        >
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 text="2xl" justify="center">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="divid"></div>
      <div class="order">
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
    </div>
    <div class="right">
      <div class="usercard">
        <video ref="videoElement" autoplay></video>
        <div class="username">李华</div>
        <div class="phone">电话:17376477593</div>
        <div class="rest">余额:￥2000</div>
      </div>
      <div class="total">总记<span>￥52</span></div>
      <div class="footer">
        <div class="order_status">支付状态<span>未支付</span></div>
        <div class="exit" @click="exit">退出</div>
      </div>
    </div>
  </div>
  <button ref="start" @click="publish">开始推流</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
const videoElement = ref<HTMLVideoElement>();
const start = ref<HTMLButtonElement>();
let pc: any = null;
let videoStream = null;
const exit = () => {
  console.log("exit");
};
const bannerHeight = "600px";
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
  const httpURL = "http://localhost:1985/rtc/v1/publish/";
  const webRTCURL = "webRTC://localhost/live/livestream";

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
      console.log("answer", data);
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
    console.log("Request data sent to server:", data);
    console.log("Raw response from server:", result);
    return result;
  } catch (error) {
    console.error("Error in httpApi:", error);
    return null;
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  letter-spacing: 2rem;
  -webkit-text-stroke: 1px var(--color-dark);
  -webkit-text-fill-color: transparent;
  font-weight: bolder;

}
.container {
  display: flex;
  justify-content: center;
  font-size: var(--font-size-mid);
}
.left {
  height: 70vh;
  overflow-y: scroll;
  margin: 20px;
  padding: 20px;
  flex: 1;
  border-radius: var(--border-radius-sm);
  border: 2px var(--color-bg) solid;
  display: flex;
  .banner {
    border-radius: 8px;
    flex: 0.4;
    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: v-bind(bannerHeight);
      margin: 0;
      text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: var(--color-primary);
    }
    .el-carousel__item:nth-child(2n + 1) {
      background-color: var(--color-dark);
    }
  }
  .divid {
    width: 20px;
  }
  .order {
    flex: 0.6;
  }
}
.right {
  border-radius: var(--border-radius-sm);
  border: 2px var(--color-bg) solid;
  margin: 20px;
  padding: 20px;
  width: 30vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-font-light);
  .usercard {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-dark);
    padding: 10px;
    border-radius: var(--border-radius-mid);
    video {
      object-fit: cover;
      width: 150px;
      height: 150px;
      border-radius: var(--border-radius-round);
      background-color: var(--color-bg);
    }
  }
  .total {
    box-shadow: 10px 10px 50px -7px var(--color-dark);
    background-color: var(--color-dark);
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius-mid);
    span {
      font-size: 24px;
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
    .order_status {
      box-shadow: 10px 10px 50px -7px var(--color-dark);
      background-color: var(--color-dark);
      height: 100%;
      margin-right: 10px;
      width: 100%;
      border-radius: var(--border-radius-mid);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 16px;
      font-weight: normal;
      span {
        font-weight: bold;
        font-size: 24px;
      }
    }
    .exit {
      box-shadow: 10px 10px 50px -7px var(--color-dark);
      cursor: pointer;
      background-color: var(--color-dark);
      height: 100%;
      width: 100%;
      border-radius: var(--border-radius-mid);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .exit:hover {
      background-color: var(--color-primary);
      transition: background-color 0.3s;
    }
  }
}
</style>
