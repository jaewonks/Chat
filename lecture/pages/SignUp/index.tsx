import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Header, Label, Form, Input, Button, LinkContainer, Error, Success } from './styles';
import { Link, Redirect } from 'react-router-dom'

const SignUp = () => {
  const { data, error, revalidate } = useSWR('/api/users', fetcher);
  /*
  const [ email, setEmail ] = useState('');
  const onChangeEmail = useCallback((e) => {
    setEmail(e.taget.value)
  },[])

  const [ nickname, setNickname ] = useState('');
  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value)
  },[])
  */
  const [ email, onChangeEmail ] = useInput('');
  const [ nickname, onChangeNickname ] = useInput('');
  const [ password, , setPassword ] = useInput('');
  const [ passwordCheck, , setPasswordCheck ] = useInput('');
  const [ mismatchError, setMismatchError ] = useState(false);
  const [ signUpError, setSignUpError ] = useState('');
  const [ signUpSuccess, setSignUpSuccess ] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (!mismatchError && nickname) {
      console.log({
        email,
        password,
        nickname,
        passwordCheck
      });
      setSignUpError('');
      setSignUpSuccess(false);
      axios
        .post('/api/users', {
          email,
          nickname,
          password
        })
        .then((response) => {
          console.log(response);
          setSignUpSuccess(true)
        })
        .catch((error) => {
          console.log(error.response);
          setSignUpError(error.response.data)
        })
        .finally(() => {});
    }
  }, 
  [email, nickname, password, passwordCheck, mismatchError]
  );

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Redirect to='/workspace/sleact/channel/일반' />
  }
  return (
    <div id='container'>
      <Header>Chat</Header>
      <Form onSubmit={onSubmit}>
        <Label id='email-label'>
          <span>Email</span>
          <div>
            <Input type='email' id='email' name='email' value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id='nickname-label'>
          <span>Nickname</span>
          <div>
            <Input type='text' id='nickname' name='nickname' value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id='password-label'>
          <span>Password</span>
          <div>
          <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id='password-check-label'>
          <span>Password Check</span>
          <div>
            <Input 
              type='password-check' 
              id='password-check' 
              name='password-check'
              value={passwordCheck} 
              onChange={onChangePasswordCheck} />
          </div>
          {mismatchError && <Error>Passwords didn't match.</Error> }
          {!nickname && <Error>Input Nickname.</Error> }
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>You signed In!</Success>}
        </Label>
        <Button type='submit'>Sign Up</Button>
      </Form>
      <LinkContainer>
        Did you already sign up?&nbsp;
        <Link to='/login'>Login</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;