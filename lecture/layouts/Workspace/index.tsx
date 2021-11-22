import React, { useCallback, useEffect, VFC } from 'react';
import { 
  WorkspaceWrapper, 
  WorkspaceName, 
  Workspaces,
  Header, 
  Channels, 
  MenuScroll, 
  Chats,
  RightMenu,
  ProfileImg,
  WorkspaceButton,
  AddButton,
  LogOutButton
 } from './styles';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { useParams, Redirect, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import ChannelList from '@components/ChannelList'
import DMList from '@components/DMList';
import Channel from '@pages/Channel';
import fetcher from '@utils/fetcher';
import DirectMessage from '@pages/DirectMessage';
import axios from 'axios';
import useSocket from '@hooks/useSocket';

const Workspace:VFC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const [ socket, disconnectSocket ] = useSocket(workspace);

  useEffect(() => {
    return () => {
      console.info('disconnect socket', workspace);
      disconnectSocket();
    }
  }, [workspace]);

  useEffect(() => {
    if (userData) {
      console.info('Try to Login');
      socket?.emit('login', { id: userData?.id, channels: [] });
    }
  }, [userData])

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    })
    .then(() => {
      mutate(false, false);
    });
  }, []);

  if (!userData) {
    return <Redirect to='/login' />;
  }
  console.log(userData)

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(userData.email,{ s: '28px', d: 'retro' })} alt={userData.nickname} />
            </span>
          </RightMenu>
        )}  
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
        {userData?.Workspaces.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
              <WorkspaceButton>
                {ws.name.slice(0, 1).toUpperCase()}
              </WorkspaceButton>
            </Link>
          )
        })} 
        <AddButton >+</AddButton>
        <LogOutButton onClick={onLogout}>logout</LogOutButton>   
        </Workspaces>
        <Channels>
          <WorkspaceName>
            {userData?.Workspaces.find((ws) => ws.url === workspace)?.name}
          </WorkspaceName>
          <MenuScroll>
          <ChannelList />
          <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path='/workspace/:workspace/channel/:channel' component={Channel} />
            <Route path='/workspace/:workspace/dm/:id' component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  )
}

export default Workspace;