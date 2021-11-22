import fetcher from '@utils/fetcher';
import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import { IUser, IUserWithOnline } from '@typings/db';
import React, { useState, useCallback, useEffect, FC } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList:FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members`: null,
    fetcher,
  );
  const [ socket ] = useSocket(workspace);  
  const [ channelCollapse, setChannelCollapse ] = useState(false);
  const [ onlineList, setOnlineList ] = useState<number[]>([]);

  const toggleChannelCollaps = useCallback(() => {
    setChannelCollapse((prev)=> !prev);
  },[]); 

  useEffect(() => {
    console.log('DMList: workspace changed', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
  <>
    <h2>
      <CollapseButton 
        collapse={channelCollapse}
        onClick={toggleChannelCollaps} 
      >
        <i
          className='c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline'
          data-qa='channel-section-collapse'
          aria-hidden='true'
        />
      </CollapseButton>
      <span>Direct Message</span>
    </h2>
    <div>
      {!channelCollapse &&
        memberData?.map((member) => {
          const isOnline = onlineList.includes(member.id); // 실시간으로 누가 접속해 있는 지 볼 수 있다.

          return (
            <NavLink 
              key={member.id}
              activeClassName='selected'
              to={`/workspace/${workspace}/dm/${member.id}`}
            >
            <i
              className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
              }`}
              aria-hidden="true"
              data-qa="presence_indicator"
              data-qa-presence-self="false"
              data-qa-presence-active="false"
              data-qa-presence-dnd="false"
            />
            <span>{ member.nickname }</span>
            {member.id === userData?.id && <span>(me)</span>}
            </NavLink>
            )})}
    </div>
  </>
  )
};

export default DMList;