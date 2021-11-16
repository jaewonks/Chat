import React from 'react'
import { useParams } from 'react-router-dom'
import ChatBox from '@components/ChatBox'
import ChatList from '@components/ChatList'
import { Header } from '@pages/DirectMessage/style'
import gravatar from 'gravatar'
import fetcher from '@utils/fetcher'
import useSWR from 'swr'
import { IUser } from '@typings/db'

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string, id: string }>();
  const { data: myData } = useSWR<IUser>('/api/user', fetcher)
  const { data: userData } = useSWR<IUser>(`/api/workspace/${workspace}/user/${id}`, fetcher)

  return (
    <>
    <Header>
      {userData && 
        <>
        <img src={gravatar.url(userData.email, { s: '28px' })} />
        <span>{userData.nickname}</span>
        </>
      }
    </Header>
    <ChatList></ChatList>
    <ChatBox></ChatBox>
    </>
  )
}

export default DirectMessage;
