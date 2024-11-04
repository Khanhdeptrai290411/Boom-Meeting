import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socketServerURL = 'http://localhost:3009';

function MeetingRoom() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  let localStream;
  let peerConnection;

  useEffect(() => {
    const socket = io(socketServerURL);

    const servers = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const startCall = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

    // Chat message handlers
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

    // Video call signal handlers
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Room: {roomId}</h2>
      <div className="flex">
        <div className="mr-4">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full mb-4 rounded" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded" />
        </div>
        <div className="w-72 h-96 border border-gray-300 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto mb-3">
            {messages.map((message, index) => (
              <div key={index} className={`p-2 mb-2 rounded ${message.fromSelf ? 'bg-green-100 text-right' : 'bg-gray-100 text-left'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message"
              className="flex-1 p-2 border border-gray-300 rounded-l"
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
