// Mock dataset for User, Group, Participant, and Message

// Users Dataset
const user = [
    { user_id: 1, user_name: 'Kailey', email: 'kailey@example.com', password_hash: 'hashed_password_1', ip_address: '192.168.0.1', status: true, created_at: '2023-10-01 10:00:00' },
    { user_id: 2, user_name: 'Maryjane', email: 'maryjane@example.com', password_hash: 'hashed_password_2', ip_address: '192.168.0.2', status: true, created_at: '2023-10-02 11:00:00' },
    { user_id: 3, user_name: 'Niko', email: 'niko@example.com', password_hash: 'hashed_password_3', ip_address: '192.168.0.3', status: true, created_at: '2023-10-03 12:00:00' },
    { user_id: 4, user_name: 'Agustin', email: 'agustin@example.com', password_hash: 'hashed_password_4', ip_address: '192.168.0.4', status: true, created_at: '2023-10-04 13:00:00' },
    { user_id: 5, user_name: 'Manuel', email: 'manuel@example.com', password_hash: 'hashed_password_5', ip_address: '192.168.0.5', status: true, created_at: '2023-10-05 14:00:00' },
    { user_id: 6, user_name: 'Treva', email: 'treva@example.com', password_hash: 'hashed_password_6', ip_address: '192.168.0.6', status: true, created_at: '2023-10-06 15:00:00' }
  ];
  
  // Groups Dataset
  const groups = [
    { ID: 1, group_name: 'Work Group', created_time: '2023-10-01 10:00:00', creator_id: 1 },
    { ID: 2, group_name: 'Family Group', created_time: '2023-10-02 11:00:00', creator_id: 2 }
  ];
  
  // Participants Dataset
  const participants = [
    { ID: 1, group_id: 1, user_id: 1 },
    { ID: 2, group_id: 1, user_id: 3 },
    { ID: 3, group_id: 2, user_id: 2 },
    { ID: 4, group_id: 2, user_id: 4 }
  ];
  
  // Messages Dataset
  const messages = [
    { ID: 1, id_sender: 1, receiver: 1, Type: 'text', content: 'Hey, are you available for a meeting tomorrow?', timestamp: '2023-10-10 09:36:00' },
    { ID: 2, id_sender: 2, receiver: 2, Type: 'text', content: 'Don’t forget about the dinner tonight!', timestamp: '2023-10-10 12:02:00' },
    { ID: 3, id_sender: 3, receiver: 1, Type: 'text', content: 'I’ve sent you the latest report. Check your email.', timestamp: '2023-10-10 10:35:00' },
    { ID: 4, id_sender: 4, receiver: 2, Type: 'text', content: 'The tide is high and I’m holding on.', timestamp: '2023-10-10 04:00:00' },
    { ID: 5, id_sender: 5, receiver: 1, Type: 'text', content: 'I will always love you.', timestamp: '2023-10-10 08:42:00' },
    { ID: 6, id_sender: 6, receiver: 1, Type: 'text', content: 'There goes my baby.', timestamp: '2023-10-10 08:42:00' }
  ];
  
  export { user, groups, participants, messages };
  