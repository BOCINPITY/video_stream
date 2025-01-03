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
        <video ref="videoElement" autoplay></video>
        <div class="username">李华</div>
        <div class="phone">电话:17376477593</div>
        <div class="rest">余额:￥2000</div>
      </div>
      <div class="total">总记<span>￥52</span></div>
      <div class="footer">
        <div class="order_status">支付状态<span>未支付</span></div>
        <div class="exit">退出</div>
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
const publish = async () => {
  if (pc !== null && pc !== undefined) {
    console.log("已开始推流");
    return;
  }

  const httpURL = "http://localhost:1985/rtc/v1/publish/";
  const webRTCURL = "webRTC://localhost/live/1";
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
      aspectRadio: 16 / 9, // 宽高比
    },
  };
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
    video {
      object-fit: cover;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: #fff;
    }
  }
  .total {
    background-color: #000;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 8px;
    span {
      font-size: 24px;
    }
  }
  .footer {
    margin-top: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120px;
    font-weight: bold;
    font-size: 24px;
    .order_status {
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
      span {
        font-weight: bold;
        font-size: 24px;
      }
    }
    .exit {
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
