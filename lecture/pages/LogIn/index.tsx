import useInput from '@hooks/useInput';
import { Header, Label, Form, Input, Button, LinkContainer, Error } from './styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);
  const [ logInError, setLogInError ] = useState(false);
  const [ email, onChangeEmail ] = useInput('');
  const [ password, onChangePassword ] = useInput('');
  // setEmail and setPassword 는 사용하지 않기 때문 

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    // 이미 로그인한 사람들은 페이지로 접근 못하도록
    setLogInError(false)
      axios
        .post('api/users/login', {
          email,
          password
        })
        .then((response) => {
          revalidate(); // 서버에서 검증된 데이터를 받아오는 것
        })
        .catch((error) => {
          console.log(error.response);
          // 문법확인해보기
          setLogInError(error.response?.data?.statusCode === 401);
        })
  }, 
  [email, password],
  );
  console.log(userData);
  if (userData === undefined) {
    return <div>Loading...</div>;
  }

  if (userData) {
    return <Redirect to='/workspace/sleact/channel/일반' />
  }
  console.log(error, userData);
  if (!error && userData) {
    console.log('You Logged In');
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
        <Label id='password-label'>
          <span>Password</span>
          <div>
            <Input type='password' id='password' value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>Your email and password doesn't match</Error>}
        </Label>
        <Button type='submit'>Login</Button>
      </Form>
      <LinkContainer>
        Are you not a member yet?&nbsp;
        <Link to='/signup'>Sign Up</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;