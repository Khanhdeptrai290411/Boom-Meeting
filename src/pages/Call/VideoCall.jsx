import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhone, FaUser } from 'react-icons/fa';
import io from 'socket.io-client';
import styled from 'styled-components';

const socketServerURL = 'http://172.20.10.4:3009';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let localStream = null;
  let peerConnection;

  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user ? user.username : "Guest"; // Lấy tên người dùng hoặc hiển thị "Guest"

  useEffect(() => {
    const socket = io(socketServerURL);
    const servers = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const startCall = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: isVideoEnabled, audio: isAudioEnabled });
        localVideoRef.current.srcObject = localStream;

        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, roomId);
          }
        };

        peerConnection.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, roomId);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    socket.emit('join-room', roomId);
    socket.on('offer', async (offer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer, roomId);
    });

    socket.on('answer', async (answer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    startCall();

    return () => {
      socket.disconnect();
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [roomId]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    navigate('/chat');
  };

  return (
    <VideoCallContainer>
      <VideoContainer>
        <LocalVideo>
          <VideoWrapper>
            <video ref={localVideoRef} autoPlay playsInline muted />
            <UserInfo>
              <h2>{userName}</h2>
            </UserInfo>
          </VideoWrapper>
        </LocalVideo>
        <RemoteVideo>
          <video ref={remoteVideoRef} autoPlay playsInline />
        </RemoteVideo>
      </VideoContainer>
      <Controls>
        <MeetingCode>
          <h4>Mã cuộc họp: {roomId}</h4>
        </MeetingCode>
        <ControlButton onClick={toggleAudio}>
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </ControlButton>
        <ControlButton onClick={toggleVideo}>
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </ControlButton>
        <ControlButton>
          <FaDesktop />
        </ControlButton>
        <ControlButton onClick={endCall} style={{ backgroundColor: 'red', padding: '10px', borderRadius: '50%' }}>
          <FaPhone />
        </ControlButton>

      </Controls>
    </VideoCallContainer>
  );
};

// Styled Components
const VideoCallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2c2f33; /* Màu nền tối */
  color: white; /* Chữ trắng */
  width: 100%;
  height: 100vh;
  position: relative;
`;

const VideoContainer = styled.div`
  display: flex; /* Sử dụng flex để video nằm ngang */
  height: calc(100vh - 140px); /* Điều chỉnh chiều cao */
  width: 100%; /* Chiếm toàn bộ chiều rộng */
`;

const LocalVideo = styled.div`
  width: 50%; /* Đảm bảo video của người dùng chiếm một nửa màn hình */
  position: relative; /* Để có thể đặt UserInfo lên trên video */
`;

const VideoWrapper = styled.div`
  position: relative; /* Để chứa UserInfo và video */
  video {
    width: 100%; /* Đảm bảo video chiếm toàn bộ chiều rộng của LocalVideo */
    height: auto; /* Đảm bảo video giữ tỷ lệ khung hình */
    border: 1px solid #ffffff; /* Viền trắng cho video */
  }
`;

const UserInfo = styled.div`
  position: absolute; /* Đặt tên người dùng lên trên video */
  bottom: 10px; /* Đặt vị trí cách đáy video */
  left: 10px; /* Đặt vị trí cách trái video */
  background-color: rgba(0, 0, 0, 0.5); /* Nền mờ cho tên người dùng */
  padding: 5px 10px; /* Padding cho tên người dùng */
  border-radius: 5px; /* Bo góc */
`;

const RemoteVideo = styled.div`
  width: 50%; /* Đảm bảo video của người khác chiếm một nửa màn hình */
  video {
    width: 100%; /* Đảm bảo video chiếm toàn bộ chiều rộng của RemoteVideo */
    height: auto; /* Đảm bảo video giữ tỷ lệ khung hình */
    border: 1px solid #ffffff; /* Viền trắng cho video */
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0; /* Di chuyển sang bên trái */
  right: 0; /* Đảm bảo điều khiển chiếm toàn bộ chiều ngang */
  display: flex;
  justify-content: center; /* Canh giữa các nút điều khiển */
  align-items: center; /* Canh giữa theo chiều dọc */
  gap: 20px;
`;

const ControlButton = styled.div`
  background-color: rgb(30, 136, 229);
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    width: 30px;
    height: 30px;
    color: white; /* Màu của icon */
  }
  
  &:hover {
    background-color: rgba(179, 102, 249, 1);
  }
`;

const MeetingCode = styled.div`
  position: absolute;
  left: 20px; /* Đặt mã cuộc họp ở góc trái */
  bottom: 20px; /* Đặt vị trí cách đáy video */
  h4 {
    font-size: 18px; /* Kích thước chữ cho mã cuộc họp */
    color: white; /* Màu chữ */
  }
`;

export default VideoCall;
