const container = document.querySelector('#messages');
const form = document.querySelector('#commandLineForm');
const input = document.querySelector('#commandLineForm input');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/submit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text: input.value})
  });
  const responseData = await response.json();
  input.value = '';
  input.focus();
  
})

async function messageLoop() {
  const response = await fetch('/messages');
  const responseData = await response.json();
  responseData.forEach(message => {
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
    container.scrollTo(0, container.scrollHeight || 0);
  })
  window.setTimeout(messageLoop, 10);
}

console.clear();
input.focus();
messageLoop();