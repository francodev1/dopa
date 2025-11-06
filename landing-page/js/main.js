document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const result = document.getElementById('formResult');

  if(!name||!email||!message){ result.textContent='Preencha todos os campos.'; return }
  result.textContent='Enviando...';

  // Simulação de envio — integrável com backend
  setTimeout(()=>{ result.textContent='Obrigado! Entraremos em contato.' },800);
});
