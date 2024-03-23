async function onSubmit(e) {
  e.preventDefault();

  const login = document.querySelector('#login').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const passwordConfirm = document.querySelector('#passwordConfirm').value;

  await register(login, email, password, passwordConfirm);
}
async function register(login, email, password, passwordConfirm) {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        email,
        password,
        passwordConfirm,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    } else {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    document.querySelector('#error').textContent = error;
  }
}

document.querySelector('#register').addEventListener('submit', onSubmit);
