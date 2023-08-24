import './Login.css'

import { PdsButton, PdsInput } from '@pine-ds/react';

export const Login = () => {
  return (
    <>
      <h1>Welcome to PDS Sample Application</h1>
      <div className="card">
        <form id="login-form">
          <PdsInput componentId="username" label="Username" hint="username: jdoe" />
          <PdsInput componentId="password" label="Password" type="password" hint="password: password" />
        </form>
        <form method="post">
          <PdsButton type="submit">Login</PdsButton>
        </form>
      </div>
    </>
  )
}
