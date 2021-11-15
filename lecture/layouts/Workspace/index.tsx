
import React from 'react';
import { WorkspaceWrapper, 
  WorkspaceName, 
  Workspaces,
  Header, 
  Channels, 
  ScrollMenu, 
  Chats,
  RightMenu,
  ProfileImg,
  WorkspaceButton,
  AddButton
 } from './style';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { Link, useParams } from 'react-router-dom';
import { IUser } from '@typings/db';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList'


const Workspace = () => {
  const { data: userData } = useSWR<IUser>('/api/user');
  const { workspace } = useParams<{ workspace: string }>();

  return <div>
    <Header>
      {userData&& (
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(userData.email,{ s: '28px', d: 'retro' 
            })} alt={userData.nickname} />
          </span>
        </RightMenu>
      )}  
    </Header>
    <WorkspaceWrapper>
      <Workspaces>
       {userData?.Workspaces.map((ws) => {
        return (
          <Link key={ws.id} to={`/workspace/${ws.url}`} >
            <WorkspaceButton>
              {ws.name.slice(0.1).toUpperCase()}
            </WorkspaceButton>
          </Link>
        )
       })}  
       <AddButton>+</AddButton>   
      </Workspaces>
      <Channels>
        <WorkspaceName>{userData?.Workspaces.find((myws) => {
          myws.url === workspace
        })?.name}</WorkspaceName>
        <ScrollMenu>
        <ChannelList></ChannelList>
        <DMList></DMList>
        </ScrollMenu>
      </Channels>
      <Chats />
    </WorkspaceWrapper>
  </div>
}

export default Workspace;