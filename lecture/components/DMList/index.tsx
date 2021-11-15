import React, { useState, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { CollapseButton } from '@components/DMList/styles';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';

const DMList = () => {
  const { workspace } = useParams<{ workspace: string }>()
  const [ channelCollapse, setChannelCollapse ] = useState(false);
  const { data: userData, error, revalidate, mutate } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData? `/api/workspace/${workspace}/members`:null,
    fetcher,
    );
  const toggleChannelCollaps = useCallback(() => {
    setChannelCollapse((prev)=>  
    !prev 
    )},[]); 
  return <div>
    <h2>
      <CollapseButton 
        collapse={channelCollapse}
        onClick={toggleChannelCollaps} 
      >
        <i
          className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
          data-qa="channel-section-collapse"
          aria-hidden="true"
        />
      </CollapseButton>
      <span>Direct Message</span>
    </h2>
    <div>
      {!channelCollapse &&
        memberData?.map((member) => {
          const isOnline = false;
          return (
            <NavLink key={member.id}
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
            </NavLink>
            )})}
    </div>
  </div>
};

export default DMList;