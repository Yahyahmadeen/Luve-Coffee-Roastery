
// Simple localStorage-based auth with Remember Me and orders
const STORE_KEY = 'users';
const SESSION_KEY = 'session';

function loadUsers(){ try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch(e){ return []; } }
function saveUsers(users){ localStorage.setItem(STORE_KEY, JSON.stringify(users)); }
function getUserByEmailOrUsername(id){
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase()===id.toLowerCase() || u.username.toLowerCase()===id.toLowerCase());
}
function upsertUser(user){
  const users = loadUsers();
  const i = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if(i >= 0) users[i] = user; else users.push(user);
  saveUsers(users);
}
function loginSession(email, remember){
  const session = { email, ts: Date.now(), remember: !!remember };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
function currentUser(){
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if(!session || !session.email) return null;
  const user = getUserByEmailOrUsername(session.email);
  return user ? { session, user } : null;
}
function logout(){
  localStorage.removeItem(SESSION_KEY);
  location.href = 'login.html';
}
function requireAuth(){
  const cur = currentUser();
  if(!cur){ location.href = 'login.html'; }
  return cur;
}
// Seed sample orders for new users
function ensureSampleOrders(user){
  if(user.orders && user.orders.length) return user;
  const today = new Date();
  user.orders = [
    { id: 'LUVE-1001', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-10).toISOString().slice(0,10), status: 'Completed', total: 12.00, items: [{name:'Classic Blend', size:'250g', grind:'Filter', qty:1, price:12.00}] },
    { id: 'LUVE-1002', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-4).toISOString().slice(0,10), status: 'Processing', total: 15.00, items: [{name:'Espresso Roast', size:'500g', grind:'Espresso', qty:1, price:15.00}] },
    { id: 'LUVE-1003', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-1).toISOString().slice(0,10), status: 'Cancelled', total: 14.50, items: [{name:'Mocha Delight', size:'250g', grind:'Whole Bean', qty:1, price:14.50}] }
  ];
  return user;
}
// Convert cart to order
function cartToOrder(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  if(!cart.length) return null;
  const total = cart.reduce((s,it)=> s + (it.price ? it.price*it.qty : 10*it.qty), 0); // default price if missing
  const id = 'LUVE-' + Math.floor(1000 + Math.random()*9000);
  const order = {
    id,
    date: new Date().toISOString().slice(0,10),
    status: 'Processing',
    total: Math.round(total*100)/100,
    items: cart.map(it => ({ name: it.name, size: it.size, grind: it.grind, qty: it.qty, price: it.price || 10 }))
  };
  return order;
}
