import signup from './actions';
import login from '../login/actions';

export default function RegisterPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={signup}>Sign up</button>
      <button formAction={login}>Log in</button>
    </form>
  );
}
