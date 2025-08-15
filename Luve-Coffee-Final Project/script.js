
// Theme toggle + active nav + account link state + cart count
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved){ root.setAttribute('data-theme', saved); }
  const btn = document.querySelector('[data-action="toggle-theme"]');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  function current(){ return root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  function updateIcon(mode){
    if(!icon || !label) return;
    if(mode === 'dark'){ icon.src='assets/icon-sun.svg'; label.textContent='Light'; }
    else{ icon.src='assets/icon-moon.svg'; label.textContent='Dark'; }
  }
  updateIcon(current());
  if(btn){
    btn.addEventListener('click', ()=>{
      const next = current()==='dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }
  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.links a').forEach(a => {
    if(a.getAttribute('href') === path) a.style.background = 'var(--surface)';
  });
  // Account link state
  const acc = document.getElementById('accountLink');
  const session = JSON.parse(localStorage.getItem('session')||'null');
  if(acc){
    acc.textContent = session && session.email ? 'My Account' : 'Login';
    acc.href = session && session.email ? 'account.html' : 'login.html';
  }
  // Cart count badge (optional enhancement)
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const count = cart.reduce((n,it)=> n + (parseInt(it.qty,10)||0), 0);
  const cartLink = document.getElementById('cartLink');
  if(cartLink){ cartLink.dataset.count = count; }
})();