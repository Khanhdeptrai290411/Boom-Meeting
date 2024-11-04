import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhone, FaUser, FaComments } from 'react-icons/fa';
import io from 'socket.io-client';
import styled from 'styled-components';

const socketServerURL = 'http://localhost:3009';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let localStream = null;
  let peerConnection;

  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isChatOpen, setChatOpen] = useState(false); // State to toggle chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user ? user.username : "Guest"; 

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
    socket.on('chat-message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    const sendMessage = () => {
      if (newMessage.trim()) {
        socket.emit('chat-message', { text: newMessage, roomId });
        setMessages(prevMessages => [...prevMessages, { text: newMessage, fromSelf: true }]);
        setNewMessage('');
      }
    };

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
    <div className="flex h-screen w-full bg-gray-800 text-white relative">
      <div className="flex flex-1">
        {/* Video Section */}
        <div className="flex w-2/3 flex-col items-center justify-center">
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
        <button className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
          <FaDesktop />
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
