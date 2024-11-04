import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhone, FaComments ,FaTimesCircle} from 'react-icons/fa';
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
    socket.on('receiveMessage', (message) => {
      if (message.userId !== userIdRef.current) {
        setMessages(prevMessages => [...prevMessages, message]);
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      socketRef.current.emit('sendMessage', { text: newMessage, roomId, userId: userIdRef.current });
      setMessages(prevMessages => [...prevMessages, { text: newMessage, fromSelf: true }]);
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
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
        // Kiểm tra nếu screenStream là MediaStream
        if (screenStream instanceof MediaStream) {
          const screenTrack = screenStream.getVideoTracks()[0];
  
          const sender = peerConnectionRef.current.getSenders().find(s => s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
  
          localVideoRef.current.srcObject = screenStream; // Hiển thị màn hình chia sẻ
  
          // Dừng chia sẻ màn hình khi người dùng dừng screenTrack
          screenTrack.onended = () => {
            stopScreenShare();
          };
  
          setIsScreenSharing(true);
        } else {
          console.warn("No valid MediaStream found for screen sharing.");
        }
      } catch (error) {
        console.error("Error sharing screen:", error);
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
      <div className="flex flex-1">
        {/* Video Section */}
        <div className={`flex ${isChatOpen ? "w-2/3" : "w-full"} flex-col items-center justify-center`}>
          <div className="flex w-full h-full">
            <div className="w-1/2 relative">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover border border-white rounded-lg" />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">{userName}</div>
            </div>
            <div className="w-1/2 relative">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover border border-white rounded-lg" />
            </div>
          </div>
        </div>

        {/* Chat Section */}
        {isChatOpen && (
          <div className="flex flex-col w-1/3 h-full bg-gray-900 border-l border-gray-700">
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={`p-2 mb-2 rounded ${message.fromSelf ? 'bg-green-500 text-right' : 'bg-gray-700 text-left'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="p-4 flex items-center space-x-2 border-t border-gray-700">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
              <button onClick={sendMessage} className="bg-blue-600 p-2 rounded-full hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button onClick={toggleAudio} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button onClick={toggleVideo} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button onClick={toggleScreenShare} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
      
        
        
        </button>
        <button onClick={() => setChatOpen(!isChatOpen)} className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          <FaComments />
        </button>
        <button onClick={endCall} className="bg-red-600 p-3 rounded-full hover:bg-red-700">
          <FaPhone />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
