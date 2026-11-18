// Authentication & Role-based Access Control Service
const STORAGE_KEYS = {
  CURRENT_USER: 'usmworld_current_user',
  USERS_LIST: 'usmworld_users_list'
};

export const ADMIN_CREDENTIALS = {
  email: 'mns2015efootball@gmail.com',
  password: 'xurshid2006',
  name: 'Xurshid (Bosh Administrator)',
  role: 'admin'
};

// Initial setup with admin user and sample customer
const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const defaultList = [
    {
      id: 'admin-01',
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
      role: 'admin',
      phone: '+998 90 999 88 77',
      avatar: '👑'
    },
    {
      id: 'user-01',
      name: 'Alisher Karimov',
      email: 'alisher@gmail.com',
      password: 'password123',
      role: 'user',
      phone: '+998 90 123 45 67',
      avatar: '✈️'
    }
  ];
  localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(defaultList));
  return defaultList;
};

// Check if a user is admin
export const isUserAdmin = (user) => {
  if (!user) return false;
  return (
    user.email?.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase().trim() &&
    user.role === 'admin'
  );
};

// Get currently logged-in user
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

// Login function with strict error differentiation
export const loginUser = (email, password) => {
  const cleanEmail = email.toLowerCase().trim();
  const users = getStoredUsers();

  // 1. Check if it's the admin email
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase().trim()) {
    if (password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: 'admin-01',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        phone: '+998 90 999 88 77',
        avatar: '👑'
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
      return { success: true, user: adminUser, isAdmin: true };
    } else {
      return { 
        success: false, 
        error: "Email yoki parol xato!" 
      };
    }
  }

  // 2. Check if email exists in database
  const userWithEmail = users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  if (!userWithEmail) {
    return { 
      success: false, 
      error: "Bunday email ro'yxatdan o'tmagan! Iltimos, avval ro'yxatdan o'ting." 
    };
  }

  // 3. Email exists, now verify password
  if (userWithEmail.password !== password) {
    return { 
      success: false, 
      error: "Email yoki parol xato!" 
    };
  }

  // Successful login
  const sessionUser = {
    id: userWithEmail.id,
    name: userWithEmail.name,
    email: userWithEmail.email,
    phone: userWithEmail.phone || '',
    role: userWithEmail.role || 'user',
    avatar: userWithEmail.avatar || '✈️'
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
  return { success: true, user: sessionUser, isAdmin: sessionUser.role === 'admin' };
};

// Register function
export const registerUser = ({ name, email, password, phone = '' }) => {
  const cleanEmail = email.toLowerCase().trim();
  const users = getStoredUsers();

  const existing = users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  if (existing) {
    return { 
      success: false, 
      error: "Ushbu email bilan ro'yxatdan o'tilgan. Iltimos, Kirish bo'limidan foydalaning!" 
    };
  }

  const isAdmin = (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase().trim() && password === ADMIN_CREDENTIALS.password);
  
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password,
    phone: phone.trim(),
    role: isAdmin ? 'admin' : 'user',
    avatar: isAdmin ? '👑' : '🌍'
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));

  const sessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    avatar: newUser.avatar
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

  return { success: true, user: sessionUser, isAdmin };
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Update user profile (Name, phone, avatar, photo)
export const updateUserProfile = (userId, { name, phone, avatar, photo }) => {
  try {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index] = {
        ...users[index],
        name: name ? name.trim() : users[index].name,
        phone: phone !== undefined ? phone.trim() : users[index].phone,
        avatar: avatar || users[index].avatar,
        photo: photo !== undefined ? photo : users[index].photo
      };
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      
      // Also update session user
      const current = getCurrentUser();
      if (current && current.id === userId) {
        const updatedSession = {
          ...current,
          name: users[index].name,
          phone: users[index].phone,
          avatar: users[index].avatar,
          photo: users[index].photo
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
        return { success: true, user: updatedSession };
      }
    }
    return { success: false, error: "Foydalanuvchi topilmadi" };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
