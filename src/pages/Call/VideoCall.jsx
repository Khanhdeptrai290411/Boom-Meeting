import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhone, FaComments, FaClipboard,FaTimesCircle} from 'react-icons/fa';

import io from 'socket.io-client';

const socketServerURL = 'http://localhost:3009';

const VideoCall = ({ userId }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null); // Lưu trữ localStream trong useRef
  const userIdRef = useRef(userId);
  const [screenStream, setScreenStream] = useState(null);

  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing,setIsScreenSharing]=useState(false);

  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user ? user.username : "Guest";

  useEffect(() => {
    // Tạo kết nối socket và lưu vào ref
    socketRef.current = io(socketServerURL);
    const socket = socketRef.current;

    const servers = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const startCall = async () => {
      try {
        // Lấy media stream của người dùng và lưu vào ref
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = localStream; // Lưu trữ localStream vào ref để dễ dàng quản lý
        localVideoRef.current.srcObject = localStream;

        // Tạo kết nối WebRTC
        const peerConnection = new RTCPeerConnection(servers);
        peerConnectionRef.current = peerConnection; // Lưu trữ peerConnection vào ref

        // Thêm các track của localStream vào peerConnection
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
    socket.on('receiveMessageMeeting', (message) => {
      if (message.userId !== userIdRef.current) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    

    socket.on('offer', async (offer) => {
      const peerConnection = peerConnectionRef.current;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer, roomId);
    });

    socket.on('answer', async (answer) => {
      const peerConnection = peerConnectionRef.current;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      const peerConnection = peerConnectionRef.current;
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    startCall();

    return () => {
      socket.disconnect();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch((err) => {
      console.error('Failed to copy room code:', err);
    });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        roomId,
        userId: userIdRef.current,
        userName: userName, // Include the sender's name
      };
      socketRef.current.emit('sendMessageMeeting', message);
      setMessages((prevMessages) => [...prevMessages, { ...message, fromSelf: true }]);
      setNewMessage('');
    }
  };
  

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        // Lấy danh sách nguồn màn hình từ Electron
        const sources = await window.electronAPI.getSources({ types: ['window', 'screen'] });
  
        // Kiểm tra nếu không có nguồn nào được trả về
        if (!sources || sources.length === 0) {
          console.error('No screen sources available');
          alert('Không tìm thấy nguồn màn hình để chia sẻ.');
          return;
        }
  
        // Hiển thị danh sách các nguồn và chọn một nguồn (giả định chọn nguồn đầu tiên)
        const source = sources[0]; // Bạn có thể tạo UI để người dùng chọn nguồn
  
        // Tạo stream từ nguồn đã chọn
        const screenStream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
            },
          },
          audio: false, // Bỏ qua audio vì không cần thiết cho màn hình
        });
  
        // Lấy video track từ stream màn hình
        const screenTrack = screenStream.getVideoTracks()[0];
  
        // Tìm sender video hiện tại và thay thế track
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
  
        // Hiển thị màn hình chia sẻ trong local video
        localVideoRef.current.srcObject = screenStream;
  
        // Xử lý khi người dùng dừng chia sẻ màn hình
        screenTrack.onended = () => {
          console.log('Screen sharing stopped');
          stopScreenShare();
        };
  
        setIsScreenSharing(true);
        console.log('Screen sharing started');
      } catch (error) {
        console.error('Error sharing screen:', error);
        alert('Không thể chia sẻ màn hình. Vui lòng kiểm tra cài đặt và thử lại.');
      }
    } else {
      stopScreenShare();
    }
  };
  
  
  const stopScreenShare= async ()=>{
    const videoTrack=localStreamRef.current.getVideoTracks()[0];
    const sender=peerConnectionRef.current.getSenders().find(s=>s.track.kind==='video');
    if(sender){
      sender.replaceTrack(videoTrack);

    }
    localVideoRef.current.srcObject=localStreamRef.current;
    setIsScreenSharing(false);
  }
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/chat');
  };

  return (
    <div className="flex h-screen w-full bg-gray-800 text-white relative">
      {/* Video Section */}
      <div className="flex flex-1">
        <div className={`flex ${isChatOpen ? "w-2/3" : "w-full"} flex-col items-center justify-center`}>
          <div className="flex w-full h-full justify-center items-center gap-4">
            {/* Local Video */}
            <div className="w-1/2 relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover border border-white rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                {userName}
              </div>
            </div>
            {/* Remote Video */}
            <div className="w-1/2 relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover border border-white rounded-lg"
              />
            </div>
          </div>
        </div>
  
        {/* Chat Section */}
        {isChatOpen && (
          <div className="flex flex-col w-1/3 h-full bg-gray-900 border-l border-gray-700">
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded ${
                    message.fromSelf ? 'bg-green-500 text-right' : 'bg-gray-700 text-left'
                  }`}
                >
                  {!message.fromSelf && (
                    <div className="text-xs text-gray-400">{message.userName}</div>
                  )}
                  <div>{message.text}</div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 flex items-center space-x-2 border-t border-gray-700">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
  
      {/* Room Code Display */}
      {showRoomCode && (
        <div className="absolute bottom-4 left-4 bg-gray-700 text-white px-4 py-2 rounded shadow-lg">
          Room Code: {roomId}
          <button
            onClick={copyRoomId}
            className="ml-2 bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 text-white"
          >
            Copy
          </button>
        </div>
      )}
  
      {/* Controls Section */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Toggle Audio */}
        <button onClick={toggleAudio} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        {/* Toggle Video */}
        <button onClick={toggleVideo} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>
        {/* Toggle Screen Share */}
        <button onClick={toggleScreenShare} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          <FaDesktop />
        </button>
        {/* Toggle Chat */}
        <button onClick={() => setChatOpen(!isChatOpen)} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          <FaComments />
        </button>
        {/* End Call */}
        <button onClick={endCall} className="bg-red-600 p-3 rounded-full hover:bg-red-700">
          <FaPhone />
        </button>
        {/* Toggle Room Code */}
        <button
          onClick={() => setShowRoomCode(!showRoomCode)}
          className="bg-gray-600 p-3 rounded-full hover:bg-gray-700"
        >
          {showRoomCode ? <FaTimesCircle /> : <FaClipboard />}
        </button>
      </div>
  
      {/* Show copied message */}
      {copied && (
        <div className="absolute bottom-16 left-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          Room code copied to clipboard!
        </div>
      )}
    </div>
  );
  
};  

export default VideoCall;