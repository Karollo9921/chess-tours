async function onSubmit(e) {
  e.preventDefault();

  const loginEmail = document.querySelector('#loginEmail').value;
  const password = document.querySelector('#password').value;

  await login(loginEmail, password);
}
async function login(loginEmail, password) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginEmail,
        password,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.log(error);
    document.querySelector('#error').textContent = error;
  }
}

document.querySelector('#login').addEventListener('submit', onSubmit);
